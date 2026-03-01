'use server';

import { generateContent } from '@/lib/gemini';
import { ContentRequest, ContentResponse } from '@/types';

/**
 * Server action to generate AI content.
 * Timeout/maxDuration is controlled via the route config (layout/page).
 */
export async function generateAction(data: ContentRequest): Promise<ContentResponse> {
  try {
    const { mode, topic, text, tone, audience, apiKey } = data;
    
    if (!apiKey) throw new Error('Gemini API key is required');
    if (!mode || (mode === 'topic' && !topic) || (mode === 'rewrite' && !text)) {
      throw new Error('Missing required prompt fields');
    }
    
    return await generateContent(mode, apiKey, topic, text, tone, audience);
  } catch (error) {
    console.error('generateAction error:', error);
    const message = error instanceof Error ? error.message : 'Server error during generation';
    throw new Error(message);
  }
}

