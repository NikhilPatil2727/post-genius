'use server';

import { generateContent } from '@/lib/gemini';
import { ContentRequest } from '@/types';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Platform, Prisma } from '@/lib/generated/prisma/client';
import { toUserFriendlyError } from '@/lib/error-utils';

/**
 * A server action for content generation.
 * This waits for the full Gemini response before returning it.
 */
export async function generateContentAction(data: ContentRequest) {
  const { mode, topic, text, tone, audience } = data;

  if (mode === 'youtube') {
    throw new Error('YouTube generation uses a dedicated server action.');
  }

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Please sign in to generate content.');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    throw new Error('Your account is not ready yet. Please reload the homepage and try again.');
  }

  try {
    return await generateContent(mode, topic, text, tone, audience);
  } catch (error) {
    console.error('Server Action Generate Error:', error);
    throw new Error(
      toUserFriendlyError(
        error,
        'We could not generate your content right now. Please try again.'
      )
    );
  }
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
    return { success: false, error: 'Please sign in to save your post.' };
  }
  try {
    const post = await prisma.post.create({
      data: {
        user: { connect: { clerkId } },
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
    revalidatePath('/admin/generate');
    revalidatePath('/admin');

    return { success: true, post };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return {
        success: false,
        error: 'Your account is not ready yet. Please reload the homepage and try again.',
      };
    }

    console.error('Error saving post:', error);
    return { success: false, error: 'Failed to save generated content' };
  }
}

export async function getUserPostsAction() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: 'Please sign in to view your posts.' };
  }
  try {
    const posts = await prisma.post.findMany({
      where: {
        user: { clerkId },
      },
      select: {
        id: true,
        topic: true,
        sourceText: true,
        createdAt: true,
        variants: {
          select: {
            platform: true,
          },
          orderBy: {
            platform: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 25,
    });
    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching dashboard posts:', error);
    return { success: false, error: 'Failed to load posts' };
  }
}

export async function deletePostAction(postId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Please sign in to delete this post.' };
  try {
    const deleteResult = await prisma.post.deleteMany({
      where: {
        id: postId,
        user: { clerkId },
      },
    });

    if (deleteResult.count === 0) {
      return { success: false, error: 'Post not found or access denied' };
    }

    revalidatePath('/admin/generate');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

export async function getPostByIdAction(postId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Please sign in to open this post.' };
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        user: { clerkId },
      },
      include: {
        variants: true,
      },
    });
    if (!post) return { success: false, error: 'Post not found' };
    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, error: 'Failed to load post' };
  }
}
