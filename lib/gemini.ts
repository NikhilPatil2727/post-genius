import { GoogleGenAI } from "@google/genai";
import type { ContentResponse } from "@/types";
import { getServerGeminiApiKey } from "@/lib/server-env";

const MODEL_NAME = "gemini-2.5-flash";

const CONTENT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    linkedin: { type: "string" },
    twitter: { type: "string" },
    instagram: { type: "string" },
    peerlist: { type: "string" },
  },
  required: ["linkedin", "twitter", "instagram", "peerlist"],
};

const SYSTEM_PROMPT = [
  "Write human-sounding social posts for LinkedIn, X, Instagram, and Peerlist.",
  "Be clear, specific, and platform-native.",
  "Avoid jargon, generic AI phrasing, and stale hooks.",
  "Return JSON only.",
].join(" ");

const PLATFORM_RULES = `
Rules by platform:
- linkedin: <=700 chars, strong hook, short paragraphs, useful takeaway, end with exactly 3 relevant hashtags.
- twitter: <=280 chars, concise hook, one core insight, optional CTA.
- instagram: <=600 chars, strong first line with no emoji, readable body, end with exactly 5 relevant hashtags.
- peerlist: <=700 chars, builder/project-update tone, practical and transparent, end with exactly 5 relevant tags or hashtags.
`.trim();

const buildMainPrompt = (
  mode: string,
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
) => `
Task: generate platform-native posts.
Context:
- mode: ${mode}
- topic: ${topic || "use source text"}
- tone: ${tone || "professional yet accessible"}
- audience: ${audience || "general professionals and enthusiasts"}

${mode === "rewrite"
    ? `Source text:
${text}`
    : `Create content about:
${topic}`}

${PLATFORM_RULES}
Keep it human, useful, and non-repetitive.
Return valid JSON with keys: linkedin, twitter, instagram, peerlist.
`;

function normalizeStructuredContentResponse(value: unknown): ContentResponse {
  if (!value || typeof value !== "object") {
    throw new Error("Gemini returned an invalid JSON response.");
  }

  const record = value as Record<string, unknown>;

  return {
    linkedin: typeof record.linkedin === "string" ? record.linkedin.trim() : "",
    twitter: typeof record.twitter === "string" ? record.twitter.trim() : "",
    instagram: typeof record.instagram === "string" ? record.instagram.trim() : "",
    peerlist: typeof record.peerlist === "string" ? record.peerlist.trim() : "",
  };
}

function createGeminiClient() {
  return new GoogleGenAI({ apiKey: getServerGeminiApiKey() });
}

async function generateStructuredContent(prompt: string): Promise<ContentResponse> {
  const response = await createGeminiClient().models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt.trim() }],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: CONTENT_RESPONSE_SCHEMA,
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  return normalizeStructuredContentResponse(JSON.parse(response.text ?? "{}"));
}

export async function generateContent(
  mode: "topic" | "rewrite",
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
  return generateStructuredContent(buildMainPrompt(mode, topic, text, tone, audience));
}

export async function generateContentFromTranscript(
  youtubeUrl: string,
  transcriptText: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
  return generateStructuredContent(`
Task: turn this YouTube transcript into platform-native posts.
Context:
- url: ${youtubeUrl}
- tone: ${tone || "professional"}
- audience: ${audience || "general"}

Keep the meaning accurate. Remove filler, repetition, sponsor reads, and off-topic parts.
Do not mention the transcript, video, or AI unless the transcript itself requires it.
${PLATFORM_RULES}
Return valid JSON with keys: linkedin, twitter, instagram, peerlist.

Transcript:
${transcriptText}
  `);
}
