'use server';

import { streamGenerateContent } from '@/lib/gemini';
import { ContentRequest } from '@/types';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Platform } from '@/lib/generated/prisma/client';

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



/**
 * Saves a new post and its platform variants to the database.
 */
export async function savePostAction(data: {
  topic?: string;
  sourceText?: string;
  tone?: string;
  audience?: string;
  variants: { platform: Platform; content: string }[];
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    // 1. Find the user in our DB by their Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (!user) {
      return { success: false, error: 'User profile not found. Please sign in again.' };
    }
    // 2. Create the post and its variants in a single transaction
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        topic: data.topic,
        sourceText: data.sourceText,
        tone: data.tone,
        audience: data.audience,
        variants: {
          create: data.variants.map((v) => ({
            platform: v.platform,
            content: v.content,
          })),
        },
      },
      include: {
        variants: true,
      },
    });
    // Revalidate dashboard to show the new post
    revalidatePath('/dashboard');
    
    return { success: true, post };
  } catch (error) {
    console.error('Error saving post:', error);
    return { success: false, error: 'Failed to save generated content' };
  }
}
/**
 * Fetches all posts for the currently logged-in user.
 * Useful for the Dashboard view.
 */
export async function getUserPostsAction() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        variants: {
          orderBy: {
            platform: 'asc'
          }
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });
    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching dashboard posts:', error);
    return { success: false, error: 'Failed to load posts' };
  }
}
/**
 * Deletes a post and all its variants.
 */
export async function deletePostAction(postId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Unauthorized' };
  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: 'User not found' };
    // Verify ownership before deleting
    const post = await prisma.post.findFirst({
      where: { id: postId, userId: user.id },
    });
    if (!post) return { success: false, error: 'Post not found or access denied' };
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}
