import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  response.headers.set("X-Orcism", "shoo boo");
  return response;
};
