import { Prisma } from '@/lib/generated/prisma/client';
import { apiError } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export type AiRateLimitedAction = 'generate-content' | 'optimize-post' | 'improve-post';

const AI_ACTION_LIMIT_KEYS: Record<AiRateLimitedAction, string> = {
  'generate-content': 'ai:daily:generate-content',
  'optimize-post': 'ai:daily:optimize-post',
  'improve-post': 'ai:daily:improve-post',
};

const AI_ACTION_LIMIT_MESSAGES: Record<AiRateLimitedAction, string> = {
  'generate-content': 'Generate Content daily limit exceeded.',
  'optimize-post': 'Optimize Post daily limit exceeded.',
  'improve-post': 'Improve Post daily limit exceeded.',
};

const AI_ACTION_LIMIT = 1;
const AI_ACTION_WINDOW_MS = 24 * 60 * 60 * 1000;

type RateLimitDecision =
  | {
      allowed: true;
      retryAfter?: never;
    }
  | {
      allowed: false;
      retryAfter: Date;
    };

export function dailyAiLimitExceededResponse(action: AiRateLimitedAction) {
  return apiError(AI_ACTION_LIMIT_MESSAGES[action], 429);
}

export async function reserveDailyAiAction(
  userId: string,
  action: AiRateLimitedAction
): Promise<RateLimitDecision> {
  return prisma.$transaction(
    async (tx) => {
      const now = new Date();
      const windowStartThreshold = new Date(now.getTime() - AI_ACTION_WINDOW_MS);
      const counterKey = AI_ACTION_LIMIT_KEYS[action];
      const lockKey = `${counterKey}:${userId}`;

      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      const activeCounter = await tx.rateLimitCounter.findFirst({
        where: {
          userId,
          key: counterKey,
          lastRequestAt: {
            gt: windowStartThreshold,
          },
        },
        orderBy: {
          lastRequestAt: 'desc',
        },
        select: {
          currentBucket: true,
          previousBucket: true,
          lastRequestAt: true,
        },
      });

      const usageCount =
        (activeCounter?.currentBucket ?? 0) + (activeCounter?.previousBucket ?? 0);

      if (activeCounter && usageCount >= AI_ACTION_LIMIT) {
        return {
          allowed: false,
          retryAfter: new Date(activeCounter.lastRequestAt.getTime() + AI_ACTION_WINDOW_MS),
        };
      }

      await tx.rateLimitCounter.create({
        data: {
          userId,
          key: counterKey,
          windowStart: now,
          windowEnd: new Date(now.getTime() + AI_ACTION_WINDOW_MS),
          currentBucket: 1,
          previousBucket: 0,
          lastRequestAt: now,
        },
      });

      return { allowed: true };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}
