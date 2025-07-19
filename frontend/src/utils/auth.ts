export function isValidApiKey(req: Request): boolean {
  const apiKey = req.headers.get("x-api-key");
  return apiKey === process.env.API_KEY;
}
