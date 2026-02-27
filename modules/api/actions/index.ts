'use server';

import { generateContent } from '@/lib/gemini';
import { ContentRequest, ContentResponse } from '@/types';

export async function generateAction(data: ContentRequest): Promise<ContentResponse> {
  try {
    const { mode, topic, text, tone, audience } = data;
    
    if (!mode || (mode === 'topic' && !topic) || (mode === 'rewrite' && !text)) {
      throw new Error('Missing required fields');
    }
    
    const content = await generateContent(mode, topic, text, tone, audience);
    return content;
  } catch (error) {
    console.error('Content generation action error:', error);
    throw new Error('Failed to generate content');
  }
}
