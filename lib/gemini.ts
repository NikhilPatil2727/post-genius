import { GoogleGenAI } from "@google/genai";
import type { ContentResponse, Platform, PostOptimizationAnalysis } from "@/types";
import { getServerGeminiApiKey } from "@/lib/server-env";

const MODEL_NAME = "gemini-2.5-flash";

const PLATFORM_CHARACTER_LIMITS = {
  linkedin: 600,
  twitter: 280,
  instagram: 500,
  peerlist: 600,
} as const satisfies Record<Platform, number>;

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

const OPTIMIZATION_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    scores: {
      type: "object",
      properties: {
        hookStrength: { type: "number" },
        readability: { type: "number" },
        ctaEffectiveness: { type: "number" },
        engagementPotential: { type: "number" },
        platformFit: { type: "number" },
        sentenceStructure: { type: "number" },
        emojiBalance: { type: "number" },
        viralityPotential: { type: "number" },
        emotionalImpact: { type: "number" },
        audienceRetention: { type: "number" },
        contentRichness: { type: "number" },
        scrollStoppingQuality: { type: "number" },
      },
      required: [
        "hookStrength",
        "readability",
        "ctaEffectiveness",
        "engagementPotential",
        "platformFit",
        "sentenceStructure",
        "emojiBalance",
        "viralityPotential",
        "emotionalImpact",
        "audienceRetention",
        "contentRichness",
        "scrollStoppingQuality",
      ],
    },
    overallScore: { type: "number" },
    summary: { type: "string" },
    topWeaknesses: {
      type: "array",
      items: { type: "string" },
    },
    suggestions: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["scores", "overallScore", "summary", "topWeaknesses", "suggestions"],
};

const IMPROVED_POST_SCHEMA = {
  type: "object",
  properties: {
    content: { type: "string" },
  },
  required: ["content"],
};

const LINKEDIN_ONLY_REFUSAL =
  "I can only help with LinkedIn post content generation and optimization.";

const SYSTEM_PROMPT = [
  "Write human-sounding social posts for LinkedIn, X, Instagram, and Peerlist.",
  `Only handle LinkedIn post requests; unrelated asks return JSON fields as: ${LINKEDIN_ONLY_REFUSAL}`,
  "Be clear, specific, and platform-native.",
  "Avoid jargon, generic AI phrasing, and stale hooks.",
  "Return JSON only.",
].join(" ");

const OPTIMIZATION_SYSTEM_PROMPT = [
  "You are a concise social media post optimization analyst.",
  `Only optimize LinkedIn post content; unrelated asks return summary: ${LINKEDIN_ONLY_REFUSAL}`,
  "Score strictly, suggest practical fixes, and return JSON only.",
].join(" ");

const IMPROVEMENT_SYSTEM_PROMPT = [
  "You improve social posts without changing the core meaning.",
  `Only improve LinkedIn post content; unrelated asks return content: ${LINKEDIN_ONLY_REFUSAL}`,
  "Preserve platform style and original tone unless a weakness requires a small adjustment.",
  "Return JSON only.",
].join(" ");

const PLATFORM_RULES = `
Rules by platform:
- linkedin: <=${PLATFORM_CHARACTER_LIMITS.linkedin} chars, strong hook, short paragraphs, useful takeaway, end with exactly 3 relevant hashtags.
- twitter: <=${PLATFORM_CHARACTER_LIMITS.twitter} chars, concise hook, one core insight, optional CTA.
- instagram: <=${PLATFORM_CHARACTER_LIMITS.instagram} chars, strong first line with no emoji, readable body, end with exactly 5 relevant hashtags.
- peerlist: <=${PLATFORM_CHARACTER_LIMITS.peerlist} chars, builder/project-update tone, practical and transparent, end with exactly 5 relevant tags or hashtags.
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

const clampScore = (value: unknown, max: number) => {
  const score = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(max, Math.round(score)));
};

function normalizeOptimizationAnalysis(value: unknown): PostOptimizationAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("Gemini returned an invalid optimization response.");
  }

  const record = value as Record<string, unknown>;
  const scores = (record.scores ?? {}) as Record<string, unknown>;

  return {
    scores: {
      hookStrength: clampScore(scores.hookStrength, 10),
      readability: clampScore(scores.readability, 10),
      ctaEffectiveness: clampScore(scores.ctaEffectiveness, 10),
      engagementPotential: clampScore(scores.engagementPotential, 10),
      platformFit: clampScore(scores.platformFit, 10),
      sentenceStructure: clampScore(scores.sentenceStructure, 10),
      emojiBalance: clampScore(scores.emojiBalance, 10),
      viralityPotential: clampScore(scores.viralityPotential, 10),
      emotionalImpact: clampScore(scores.emotionalImpact, 10),
      audienceRetention: clampScore(scores.audienceRetention, 10),
      contentRichness: clampScore(scores.contentRichness, 10),
      scrollStoppingQuality: clampScore(scores.scrollStoppingQuality, 10),
    },
    overallScore: clampScore(record.overallScore, 100),
    summary: typeof record.summary === "string" ? record.summary.trim() : "",
    topWeaknesses: Array.isArray(record.topWeaknesses)
      ? record.topWeaknesses.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 5)
      : [],
    suggestions: Array.isArray(record.suggestions)
      ? record.suggestions.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 6)
      : [],
  };
}

function getCharacterLength(content: string): number {
  return content.length;
}

function trimToCharacterLimit(content: string, limit: number): string {
  const normalized = content
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (getCharacterLength(normalized) <= limit) {
    return normalized;
  }

  const candidate = normalized.slice(0, limit + 1);
  const sentenceEnd = Math.max(
    candidate.lastIndexOf(". "),
    candidate.lastIndexOf("! "),
    candidate.lastIndexOf("? "),
    candidate.lastIndexOf("\n\n")
  );
  const wordEnd = candidate.lastIndexOf(" ");
  const cutAt = sentenceEnd >= Math.floor(limit * 0.55)
    ? sentenceEnd + 1
    : wordEnd >= Math.floor(limit * 0.55)
      ? wordEnd
      : limit;

  const suffix = "...";
  const availableLength = Math.max(0, limit - suffix.length);
  const readable = candidate
    .slice(0, Math.min(cutAt, availableLength))
    .replace(/[\s,;:.-]+$/g, "")
    .trim();

  const trimmed = readable ? `${readable}${suffix}` : normalized.slice(0, limit);
  return trimmed.slice(0, limit).trimEnd();
}

function enforceContentLimits(content: ContentResponse): ContentResponse {
  const limited = {
    linkedin: trimToCharacterLimit(content.linkedin, PLATFORM_CHARACTER_LIMITS.linkedin),
    twitter: trimToCharacterLimit(content.twitter, PLATFORM_CHARACTER_LIMITS.twitter),
    instagram: trimToCharacterLimit(content.instagram, PLATFORM_CHARACTER_LIMITS.instagram),
    peerlist: trimToCharacterLimit(content.peerlist, PLATFORM_CHARACTER_LIMITS.peerlist),
  };

  for (const platform of Object.keys(PLATFORM_CHARACTER_LIMITS) as Platform[]) {
    const limit = PLATFORM_CHARACTER_LIMITS[platform];
    if (getCharacterLength(limited[platform]) > limit) {
      throw new Error(`Generated ${platform} content exceeded ${limit} characters after validation.`);
    }
  }

  return limited;
}

function getExceededPlatforms(content: ContentResponse): Platform[] {
  return (Object.keys(PLATFORM_CHARACTER_LIMITS) as Platform[]).filter(
    (platform) => getCharacterLength(content[platform]) > PLATFORM_CHARACTER_LIMITS[platform]
  );
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

  const content = normalizeStructuredContentResponse(JSON.parse(response.text ?? "{}"));
  const exceededPlatforms = getExceededPlatforms(content);

  if (exceededPlatforms.length === 0) {
    return enforceContentLimits(content);
  }

  const repaired = await generateJson(
    `
Task: shorten only the posts that exceed their character limits.
Preserve meaning, readability, formatting, platform style, and hashtag requirements where possible.
Never return any field over its character limit.

Limits:
${(Object.keys(PLATFORM_CHARACTER_LIMITS) as Platform[])
  .map((platform) => `- ${platform}: ${PLATFORM_CHARACTER_LIMITS[platform]} characters`)
  .join("\n")}

Current JSON:
${JSON.stringify(content)}
    `,
    CONTENT_RESPONSE_SCHEMA,
    SYSTEM_PROMPT,
    normalizeStructuredContentResponse
  );

  return enforceContentLimits(repaired);
}

async function generateJson<T>(
  prompt: string,
  responseSchema: object,
  systemInstruction: string,
  normalize: (value: unknown) => T
): Promise<T> {
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
      responseSchema,
      systemInstruction,
    },
  });

  return normalize(JSON.parse(response.text ?? "{}"));
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

export async function analyzePostOptimization(
  content: string,
  platform: Platform
): Promise<PostOptimizationAnalysis> {
  return generateJson(
    `
Task: analyze this ${platform} post. Do not rewrite it.
Score each category 0-10 and overallScore 0-100.
Keep summary, weaknesses, and suggestions short.

Post:
${content}
    `,
    OPTIMIZATION_ANALYSIS_SCHEMA,
    OPTIMIZATION_SYSTEM_PROMPT,
    normalizeOptimizationAnalysis
  );
}

export async function improvePostContent(
  content: string,
  platform: Platform,
  analysis: PostOptimizationAnalysis
): Promise<string> {
  const weakest = analysis.topWeaknesses.slice(0, 4).join("; ") || "general performance";
  const suggestions = analysis.suggestions.slice(0, 5).join("; ") || "improve clarity and engagement";

  const improved = await generateJson(
    `
Task: improve this ${platform} post using the supplied analysis.
Maintain meaning and platform style. Improve weak areas, readability, emotion, retention, and CTA.
Keep the improved post at or below ${PLATFORM_CHARACTER_LIMITS[platform]} characters.
Do not explain. Return only the improved post in content.

Current score: ${analysis.overallScore}/100
Weaknesses: ${weakest}
Suggestions: ${suggestions}

Original post:
${content}
    `,
    IMPROVED_POST_SCHEMA,
    IMPROVEMENT_SYSTEM_PROMPT,
    (value) => {
      if (!value || typeof value !== "object") {
        throw new Error("Gemini returned an invalid improved post response.");
      }

      const improved = (value as Record<string, unknown>).content;
      return typeof improved === "string" ? improved.trim() : "";
    }
  );

  return trimToCharacterLimit(improved, PLATFORM_CHARACTER_LIMITS[platform]);
}
