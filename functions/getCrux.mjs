import { getReports } from "kruk";
import prependHttp from "prepend-http";

function groupByMetricAndSort(data, sortBy = "histogram") {
  if (!data) return {};
  const byMetric = { CLS: [], FCP: [], LCP: [],  INP: [], TTFB: [], RTT: [] };

  data.forEach((site) => {
    for (const metric in byMetric) {
      byMetric[metric].push({ url: site.url, ...site[metric] });
    }
  });

  for (const metric in byMetric) {
    byMetric[metric].sort((a, b) => {
      const aValue =
        sortBy === "histogram" ? parseFloat(a.histogram[0]) : parseFloat(b.p75);
      const bValue =
        sortBy === "histogram" ? parseFloat(b.histogram[0]) : parseFloat(a.p75);

      return bValue - aValue;
    });
  }

  return byMetric;
}

export default async (req, context) => {
  const params = new URLSearchParams(await new Response(req.body).text());
  const checkOrigin = params.get("checkOrigin") === null ? false : true;

  const formFactor = params.get("formFactor");
  const urls = params
    .getAll("url")
    .filter((item) => !!item)
    .map((url) => prependHttp(url));

  const API_KEY = process.env.PSIKUS;

  const queryParams = {
    effectiveConnectionType: "",
    formFactor: formFactor,
    origin: checkOrigin,
  };

  const cruxData = await getReports(urls, API_KEY, queryParams);
  const cruxDataByMetric = groupByMetricAndSort(cruxData.metrics);

  return Response.json({
    cruxData,
    byMetric: { params: cruxData.params, metrics: cruxDataByMetric },
  });
};
