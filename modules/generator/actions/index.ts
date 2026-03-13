'use server';

import { streamGenerateContent } from '@/lib/gemini';
import { ContentRequest } from '@/types';

/**
 * A streaming Server Action for content generation.
 * This function initiates the Gemini stream and passes it back to the client
 * via a ReadableStream, optimized for high-speed content delivery.
 */
export async function generateStreamAction(data: ContentRequest) {
  const { mode, topic, text, tone, audience, apiKey } = data;

  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Execute streaming in a secondary context to prevent blocking
  (async () => {
    try {
      const generator = streamGenerateContent(mode, apiKey, topic, text, tone, audience);
      for await (const chunk of generator) {
        if (chunk) {
          await writer.write(encoder.encode(chunk));
        }
      }
    } catch (error) {
      console.error('Server Action Streaming Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown generation error';
      await writer.write(encoder.encode(`[[ERROR]] ${errorMessage}`));
    } finally {
      await writer.close();
    }
  })();

  return readable;
}
