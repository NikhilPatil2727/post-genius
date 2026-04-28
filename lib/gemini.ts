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

const SYSTEM_PROMPT = `You are an elite Social Media Ghostwriter and Content Strategist.
Your goal is to transform raw ideas or topics into viral-ready, high-engagement content across 4 specific platforms.
You write with a "Human-First" approach: avoid corporate jargon, robotic listicles, or cliched AI openings.`;

const buildMainPrompt = (
  mode: string,
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
) => `
CORE OBJECTIVE:
Generate highly tailored content based on the following context:
- MODE: ${mode === "topic" ? "Idea Generation" : "Content Refinement/Rewrite"}
- TARGET KEYWORDS/TOPIC: ${topic || "Analyze the provided text"}
- VOICE TONE: ${tone || "Professional yet accessible"}
- TARGET AUDIENCE: ${audience || "General professionals and enthusiasts"}

${mode === "rewrite"
    ? `SOURCE MATERIAL TO TRANSFORM:
"${text}"
Analyze the core message above and expand or refine it for the platforms below.`
    : `GENERATE FROM TOPIC:
Create a thought-leadership narrative around "${topic}".`}

PLATFORM SPECIFIC INSTRUCTIONS:

1) LinkedIn:
   - Length: Up to 700 characters.
   - Structure: Strong hook, short readable paragraphs, useful takeaways, end with a conversation-starting question.
   - Tone: Authoritative but conversational.
   - CTA: Exactly 3 relevant hashtags at the very bottom.

2) X / Twitter:
   - Length: Strictly max 280 characters.
   - Structure: 1-2 sentence hook, 1 core insight, 1 CTA or follow-up.
   - Tone: Sharp, witty, and high-energy.

3) Instagram:
   - Length: Max 600 characters.
   - Structure: Captivating first line with no emoji in line 1.
   - Tone: Relatable, visual, and friendly.
   - CTA: Exactly 5 hashtags.

4) Peerlist:
   - Length: Max 700 characters.
   - Structure: Focus on what I built, what I learned, or a project update.
   - Tone: Collaborative and transparent.
   - CTA: Exactly 5 tags or hashtags.

OUTPUT FORMAT:
Return valid JSON only with the keys linkedin, twitter, instagram, and peerlist.
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

export async function generateContent(
  mode: "topic" | "rewrite",
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
  const apiKey = getServerGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [{ text: buildMainPrompt(mode, topic, text, tone, audience).trim() }],
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

export async function generateContentFromTranscript(
  youtubeUrl: string,
  transcriptText: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
  const apiKey = getServerGeminiApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Transform the following YouTube transcript into polished social posts for LinkedIn, X, Instagram, and Peerlist.

Context:
- SOURCE TYPE: YouTube video transcript
- YOUTUBE URL: ${youtubeUrl}
- VOICE TONE: ${tone || "professional"}
- TARGET AUDIENCE: ${audience || "general"}

Rules:
- Keep the core message accurate to the transcript.
- Remove filler, repetition, sponsor mentions, and off-topic sections.
- Make each platform version feel native to that platform.
- Do not mention that the source was AI-generated.
- Return valid JSON only.

Platform rules:
- LinkedIn: clear hook, short paragraphs, actionable takeaway, end with exactly 3 relevant hashtags.
- Twitter: max 280 characters, sharp and concise.
- Instagram: compelling opener, readable body, end with exactly 5 relevant hashtags.
- Peerlist: maker-focused update style, practical and transparent, end with exactly 5 relevant tags or hashtags.

Transcript:
${transcriptText}
            `.trim(),
          },
        ],
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
