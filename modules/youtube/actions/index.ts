'use server';

import { YoutubeTranscript } from 'youtube-transcript';

import { GEMINI_FLASH_PREVIEW_MODEL, getGeminiClient } from '@/lib/gemini';
import type {
  Platform,
  YouTubeGenerationData,
  YouTubeGenerationRequest,
  YouTubeGenerationResult,
} from '@/types';

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

const PLATFORM_LABELS: Record<Platform, string> = {
  linkedin: 'linkedin',
  twitter: 'x',
  instagram: 'instagram',
  peerlist: 'peerlist',
};

function extractVideoId(youtubeUrl: string) {
  if (!YOUTUBE_URL_REGEX.test(youtubeUrl.trim())) {
    return null;
  }

  try {
    const parsedUrl = new URL(youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`);

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.split('/').filter(Boolean)[0] ?? null;
    }

    return parsedUrl.searchParams.get('v');
  } catch {
    return null;
  }
}

function buildYoutubePrompt({
  transcript,
  voice,
  audience,
  platforms,
}: {
  transcript: string;
  voice: string;
  audience: string;
  platforms: Platform[];
}) {
  const platformList = platforms.map((platform) => PLATFORM_LABELS[platform]).join(', ');

  return `You are a social media content expert for PostBloom.

Below is the transcript of a YouTube video:
---
${transcript}
---

Based on this transcript, extract key insights, main points, and
valuable takeaways. Then generate social media posts for these
platforms: ${platformList}

Platform rules:
- LinkedIn: 150-300 words, professional tone, line breaks, end with a question
- X (Twitter): max 280 chars, punchy, 2-3 hashtags
- Instagram: 100-150 words, engaging, 5-8 hashtags, emoji friendly
- Peerlist: developer-focused, technical tone, 100-200 words

Editorial Voice: ${voice}
Target Audience: ${audience}

Return ONLY valid JSON, no markdown, no explanation, no code blocks:
{
  "videoTitle": "infer the title from the transcript content",
  "keySummary": "2-3 line summary of the video",
  "posts": {
    "linkedin": "post content",
    "x": "post content",
    "instagram": "post content",
    "peerlist": "post content"
  }
}`;
}

function stripJsonFences(rawText: string) {
  return rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
}

function normalizePosts(posts: Record<string, unknown> | undefined): YouTubeGenerationData['posts'] {
  if (!posts) return {};

  return {
    linkedin: typeof posts.linkedin === 'string' ? posts.linkedin : '',
    twitter:
      typeof posts.x === 'string'
        ? posts.x
        : typeof posts.twitter === 'string'
          ? posts.twitter
          : '',
    instagram: typeof posts.instagram === 'string' ? posts.instagram : '',
    peerlist: typeof posts.peerlist === 'string' ? posts.peerlist : '',
  };
}

function parseYoutubeResponse(rawText: string): YouTubeGenerationData {
  const parsed = JSON.parse(stripJsonFences(rawText)) as {
    videoTitle?: unknown;
    keySummary?: unknown;
    posts?: Record<string, unknown>;
  };

  if (typeof parsed.videoTitle !== 'string' || typeof parsed.keySummary !== 'string') {
    throw new Error('Could not parse the generated video response.');
  }

  return {
    videoTitle: parsed.videoTitle,
    keySummary: parsed.keySummary,
    posts: normalizePosts(parsed.posts),
  };
}

export async function generatePostFromYouTube({
  youtubeUrl,
  voice,
  audience,
  platforms,
}: YouTubeGenerationRequest): Promise<YouTubeGenerationResult> {
  try {
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL' };
    }

    let transcript: string;

    try {
      const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = transcriptArr.map((t) => t.text).join(' ');
    } catch {
      return {
        success: false,
        error: "This video doesn't have transcripts enabled",
      };
    }

    const ai = getGeminiClient();
    const prompt = buildYoutubePrompt({ transcript, voice, audience, platforms });
    const response = await ai.models.generateContent({
      model: GEMINI_FLASH_PREVIEW_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = response.text;

    if (!responseText) {
      return { success: false, error: 'Gemini returned an empty response.' };
    }

    const data = parseYoutubeResponse(responseText);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'We could not analyze this video right now.';

    if (message.toLowerCase().includes('json') || message.toLowerCase().includes('parse')) {
      return {
        success: false,
        error: 'We could not understand the AI response. Please try again.',
      };
    }

    return { success: false, error: message };
  }
}

