import { getReports } from "kruk";
import prependHttp from "prepend-http";

function groupByMetricAndSort(data, sortBy = "histogram") {
  if (!data) return {};
  const byMetric = { CLS: [], FCP: [], LCP: [], INP: [], TTFB: [], RTT: [] };

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST({ request }) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const checkOrigin = params.get("checkOrigin") === null ? false : true;

    const formFactor = params.get("formFactor");
    const urls = params
      .getAll("url")
      .filter((item) => !!item)
      .map((url) => prependHttp(url));

    const API_KEY = process.env.PSIKUS;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing API key configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const queryParams = {
      effectiveConnectionType: "",
      formFactor: formFactor,
      origin: checkOrigin,
    };

    const cruxData = await getReports(urls, API_KEY, queryParams);
    const cruxDataByMetric = groupByMetricAndSort(cruxData.metrics);

    return new Response(
      JSON.stringify({
        cruxData,
        byMetric: { params: cruxData.params, metrics: cruxDataByMetric },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in getCrux endpoint:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}