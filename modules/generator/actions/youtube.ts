'use server';

import { YoutubeTranscript } from 'youtube-transcript';
import { auth } from '@clerk/nextjs/server';

import { generateContentFromTranscript } from '@/lib/gemini';
import { toUserFriendlyError } from '@/lib/error-utils';
import { prisma } from '@/lib/prisma';
import {
  consumeDailyPostGenerationLimit,
  FREE_DAILY_LIMIT_EXCEEDED_MESSAGE,
} from '@/lib/rate-limit';
import type { ContentTemplate, YouTubeToPostActionResult } from '@/types';

const MAX_TRANSCRIPT_CHARS = 12000;

function collapseTranscript(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export async function generateYouTubePostAction(data: {
  youtubeUrl?: string;
  tone?: string;
  audience?: string;
  template?: ContentTemplate;
}): Promise<YouTubeToPostActionResult> {
  const { youtubeUrl, tone, audience, template } = data;

  if (!youtubeUrl || youtubeUrl.trim() === '') {
    return { success: false, error: 'Please add a YouTube URL.' };
  }

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: 'Please sign in to generate content.' };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    return {
      success: false,
      error: 'Your account is not ready yet. Please reload the homepage and try again.',
    };
  }

  const rateLimit = await consumeDailyPostGenerationLimit(user.id);
  if (!rateLimit.allowed) {
    return { success: false, error: FREE_DAILY_LIMIT_EXCEEDED_MESSAGE };
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl.trim());

    if (!transcript.length) {
      return { success: false, error: 'We could not find a transcript for this YouTube video.' };
    }

    const transcriptText = collapseTranscript(
      transcript
        .map((segment) => segment.text)
        .filter(Boolean)
        .join(' ')
    );

    if (!transcriptText) {
      return { success: false, error: 'The transcript was empty for this YouTube video.' };
    }

    const condensedTranscript = transcriptText.slice(0, MAX_TRANSCRIPT_CHARS);
    const content = await generateContentFromTranscript(
      youtubeUrl.trim(),
      condensedTranscript,
      tone,
      audience,
      template
    );

    return {
      success: true,
      content,
      transcript: {
        sourceUrl: youtubeUrl.trim(),
        segmentCount: transcript.length,
        textLength: condensedTranscript.length,
      },
    };
  } catch (error) {
    console.error('YouTube transcript generation error:', error);

    return {
      success: false,
      error: toUserFriendlyError(
        error,
        'We could not process this YouTube video right now. Please try another link.'
      ),
    };
  }
}
