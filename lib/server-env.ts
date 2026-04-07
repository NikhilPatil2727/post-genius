const GEMINI_API_KEY_ENV = "GEMINI_API_KEY";

export function getServerGeminiApiKey() {
  const apiKey = process.env[GEMINI_API_KEY_ENV];

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(`${GEMINI_API_KEY_ENV} is not configured on the server.`);
  }

  return apiKey;
}
