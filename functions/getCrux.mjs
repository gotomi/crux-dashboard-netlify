import { getReports } from "kruk";
import prependHttp from "prepend-http";

export default async (req, context) => {
  const params = new URLSearchParams(await new Response(req.body).text());

  const checkOrigin = !!params.get("checkOrigin");
  const formFactor = params.get("formFactor");
  const urls = params
    .getAll("url")
    .filter((item) => !!item)
    .map((url) => prependHttp(url));

  const API_KEY = process.env.PSIKUS;

  const queryParams = {
    effectiveConnectionType: "",
    formFactor: formFactor,
    checkOrigin: checkOrigin,
  };
  const cruxData = await getReports(urls, API_KEY, queryParams);

  return Response.json(cruxData);
};
