'use server';

import { generateContent } from '@/lib/gemini';
import { ContentRequest, ContentResponse } from '@/types';

export async function generateAction(data: ContentRequest): Promise<ContentResponse> {
  try {
    const { mode, topic, text, tone, audience, apiKey } = data;
    
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    if (!mode || (mode === 'topic' && !topic) || (mode === 'rewrite' && !text)) {
      throw new Error('Missing required fields');
    }
    
    const content = await generateContent(mode, apiKey, topic, text, tone, audience);
    return content;
  } catch (error) {
    console.error('Content generation action error:', error);
    throw new Error('Failed to generate content');
  }
}
