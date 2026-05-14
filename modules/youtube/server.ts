import { YoutubeTranscript } from 'youtube-transcript';

import { toUserFriendlyError } from '@/lib/error-utils';
import { generateContentFromTranscript } from '@/lib/gemini';
import type { YouTubeToPostActionResult } from '@/types';

const MAX_TRANSCRIPT_CHARS = 12000;

function collapseTranscript(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export async function generateYouTubePost(data: {
  youtubeUrl: string;
  tone?: string;
  audience?: string;
}): Promise<YouTubeToPostActionResult> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(data.youtubeUrl);

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
      data.youtubeUrl,
      condensedTranscript,
      data.tone,
      data.audience
    );

    return {
      success: true,
      content,
      transcript: {
        sourceUrl: data.youtubeUrl,
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
