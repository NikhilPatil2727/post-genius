import { Platform, Prisma } from '@/lib/generated/prisma/client';
import { toUserFriendlyError } from '@/lib/error-utils';
import { generateContent } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import type { ContentResponse } from '@/types';

type GeneratePostInput =
  | {
      mode: 'topic';
      topic: string;
      tone?: string;
      audience?: string;
    }
  | {
      mode: 'rewrite';
      text: string;
      tone?: string;
      audience?: string;
    };

export async function generatePostContent(data: GeneratePostInput): Promise<ContentResponse> {
  try {
    if (data.mode === 'topic') {
      return await generateContent('topic', data.topic, undefined, data.tone, data.audience);
    }

    return await generateContent('rewrite', undefined, data.text, data.tone, data.audience);
  } catch (error) {
    console.error('API Generate Error:', error);
    throw new Error(
      toUserFriendlyError(
        error,
        'We could not generate your content right now. Please try again.'
      )
    );
  }
}

export async function savePostForUser(
  clerkId: string,
  data: {
    topic?: string;
    sourceText?: string;
    tone?: string;
    audience?: string;
    variants: { platform: Platform; content: string }[];
  }
) {
  try {
    return await prisma.post.create({
      data: {
        user: { connect: { clerkId } },
        topic: data.topic,
        sourceText: data.sourceText,
        tone: data.tone,
        audience: data.audience,
        variants: {
          create: data.variants.map((variant) => ({
            platform: variant.platform,
            content: variant.content,
          })),
        },
      },
      include: {
        variants: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('Your account is not ready yet. Please reload and try again.');
    }

    console.error('Error saving post:', error);
    throw new Error('Failed to save generated content.');
  }
}

export async function getPostsForUser(clerkId: string) {
  return prisma.post.findMany({
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
}

export async function getPostForUser(clerkId: string, postId: string) {
  return prisma.post.findFirst({
    where: {
      id: postId,
      user: { clerkId },
    },
    include: {
      variants: true,
    },
  });
}

export async function deletePostForUser(clerkId: string, postId: string) {
  return prisma.post.deleteMany({
    where: {
      id: postId,
      user: { clerkId },
    },
  });
}
