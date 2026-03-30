import { GoogleGenAI } from "@google/genai";
import type { ContentResponse } from "@/types";

/**
 * MARKERS for streaming protocol.
 * These are used to separate content for different platforms in the stream.
 */
export const MARKERS = {
  LINKEDIN: '[[LINKEDIN]]',
  TWITTER: '[[TWITTER]]',
  INSTAGRAM: '[[INSTAGRAM]]',
  PEERLIST: '[[PEERLIST]]',
};

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
You write with a "Human-First" approach: avoid corporate jargon, robotic listicles, or cliché AI openings.`;

/**
 * Optimized dynamic prompt builder.
 */
const BUILD_MAIN_PROMPT = (mode: string, topic?: string, text?: string, tone?: string, audience?: string) => `
CORE OBJECTIVE:
Generate highly tailored content based on the following context:
- MODE: ${mode === 'topic' ? 'Idea Generation' : 'Content Refinement/Rewrite'}
- TARGET KEYWORDS/TOPIC: ${topic || 'Analyze the provided text'}
- VOICE TONE: ${tone || 'Professional yet accessible'}
- TARGET AUDIENCE: ${audience || 'General professionals and enthusiasts'}

${mode === 'rewrite' ? `SOURCE MATERIAL TO TRANSFORM:
"${text}"
Analyze the core message above and expand/refine it for the platforms below.` : `GENERATE FROM TOPIC:
Create a thought-leadership narrative around "${topic}".`}

PLATFORM SPECIFIC INSTRUCTIONS:

1) LinkedIn (The Professional Narrative):
   - LENGTH: Up to 700 characters (aim for comprehensive value).
   - STRUCTURE: 
     * Start with a "Scroll-Stopping" hook (a question, a controversial take, or a bold result).
     * Use short, punchy paragraphs for readability.
     * Incorporate bullet points for key takeaways.
     * End with a "Call to Conversation" (meaningful question).
   - TONE: Authoritative but conversational.
   - CTA: Exactly 3 relevant hashtags at the very bottom.

2) X / Twitter (The Viral Hook):
   - LENGTH: Strictly Max 280 characters.
   - STRUCTURE: 1-2 sentence hook + 1 core insight + 1 CTA/Follow-up.
   - TONE: Sharp, witty, and high-energy.

3) Instagram (The Aesthetic Story):
   - LENGTH: Max 600 characters.
   - STRUCTURE: Captivating first line (no emojis in line 1).
   - TONE: Relatable, visual, and friendly.
   - CTA: Exactly 5 hashtags.

4) Peerlist (The Tech/Maker Shout):
   - LENGTH: Max 700 characters.
   - STRUCTURE: Focus on "What I built/learned" or "Project Update".
   - TONE: Collaborative and transparent.
   - CTA: Exactly 5 tags/hashtags.

OUTPUT FORMAT:
Do NOT include any preamble. Start immediately with the first marker.
`;

/**
 * Streams AI content using the Gemini model.
 */
export async function* streamGenerateContent(
  mode: 'topic' | 'rewrite',
  apiKey: string,
  topic?: string,
  text?: string,
  tone?: string,
  audience?: string
) {
  const ai = new GoogleGenAI({ apiKey });

  const mainPrompt = BUILD_MAIN_PROMPT(mode, topic, text, tone, audience);

  try {
    const response = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: [{ 
        role: 'user', 
        parts: [{ text: `
          Follow this structure exactly:
          ${MARKERS.LINKEDIN}
          [Content]
          ${MARKERS.TWITTER}
          [Content]
          ${MARKERS.INSTAGRAM}
          [Content]
          ${MARKERS.PEERLIST}
          [Content]

          Context to use:
          ${mainPrompt}
        ` }] 
      }],
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) yield text;
    }
  } catch (error) {
    console.error('Gemini Stream Error:', error);
    throw error;
  }
}

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

export async function generateContentFromTranscript(
  apiKey: string,
  youtubeUrl: string,
  transcriptText: string,
  tone?: string,
  audience?: string
): Promise<ContentResponse> {
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
- Peerlist: maker/tech-focused update style, practical and transparent, end with exactly 5 relevant tags or hashtags.

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
