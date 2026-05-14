import { Prisma } from '@/lib/generated/prisma/client';
import { apiError } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

const AI_ACTION_LIMIT_KEY = 'ai:daily-action';
const AI_ACTION_LIMIT = 1;
const AI_ACTION_WINDOW_MS = 24 * 60 * 60 * 1000;

export const DAILY_AI_LIMIT_EXCEEDED_MESSAGE =
  'Daily AI usage limit exceeded. Please try again after 24 hours.';

type RateLimitDecision =
  | {
      allowed: true;
      retryAfter?: never;
    }
  | {
      allowed: false;
      retryAfter: Date;
    };

export function dailyAiLimitExceededResponse() {
  return apiError(DAILY_AI_LIMIT_EXCEEDED_MESSAGE, 429);
}

export async function reserveDailyAiAction(userId: string): Promise<RateLimitDecision> {
  return prisma.$transaction(
    async (tx) => {
      const now = new Date();
      const windowStartThreshold = new Date(now.getTime() - AI_ACTION_WINDOW_MS);
      const lockKey = `${AI_ACTION_LIMIT_KEY}:${userId}`;

      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      const activeCounter = await tx.rateLimitCounter.findFirst({
        where: {
          userId,
          key: AI_ACTION_LIMIT_KEY,
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
          key: AI_ACTION_LIMIT_KEY,
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
