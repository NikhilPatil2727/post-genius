import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

const FREE_DAILY_POST_GENERATION_LIMIT = 5;
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const SLIDING_WINDOW_RATE_LIMIT_KEY = "post-generation-free-daily";

type SlidingWindowResult =
  | {
      allowed: true;
      limit: number;
      remaining: number;
      resetAt: Date;
    }
  | {
      allowed: false;
      limit: number;
      remaining: 0;
      resetAt: Date;
    };

type RateLimitCounterRow = {
  id: string;
  userId: string;
  key: string;
  windowStart: Date;
  windowEnd: Date;
  currentBucket: number;
  previousBucket: number;
  lastRequestAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type RawSqlClient = {
  $queryRaw<T>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
  $executeRaw(query: TemplateStringsArray, ...values: unknown[]): Promise<number>;
};

function startOfUtcDay(value = new Date()) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function endOfUtcDay(value: Date) {
  return new Date(value.getTime() + DAILY_WINDOW_MS);
}

function previousUtcDay(value: Date) {
  return new Date(value.getTime() - DAILY_WINDOW_MS);
}

async function getWindowCounter(
  tx: RawSqlClient,
  userId: string,
  windowStart: Date,
  windowEnd: Date
) {
  const rows = await tx.$queryRaw<RateLimitCounterRow[]>`
    SELECT *
    FROM "RateLimitCounter"
    WHERE "userId" = ${userId}
      AND "key" = ${SLIDING_WINDOW_RATE_LIMIT_KEY}
      AND "windowStart" = ${windowStart}
      AND "windowEnd" = ${windowEnd}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function consumeDailyPostGenerationLimit(userId: string): Promise<SlidingWindowResult> {
  const now = new Date();
  const currentWindowStart = startOfUtcDay(now);
  const currentWindowEnd = endOfUtcDay(currentWindowStart);
  const previousWindowStart = previousUtcDay(currentWindowStart);
  const previousWindowEnd = currentWindowStart;

  return prisma.$transaction(async (tx) => {
    const [currentCounter, previousCounter] = await Promise.all([
      getWindowCounter(tx, userId, currentWindowStart, currentWindowEnd),
      getWindowCounter(tx, userId, previousWindowStart, previousWindowEnd),
    ]);

    const elapsedMs = now.getTime() - currentWindowStart.getTime();
    const overlapWeight = Math.max(0, (DAILY_WINDOW_MS - elapsedMs) / DAILY_WINDOW_MS);
    const weightedCount =
      (currentCounter?.currentBucket ?? 0) + (previousCounter?.currentBucket ?? 0) * overlapWeight;

    if (weightedCount >= FREE_DAILY_POST_GENERATION_LIMIT) {
      return {
        allowed: false,
        limit: FREE_DAILY_POST_GENERATION_LIMIT,
        remaining: 0,
        resetAt: currentWindowEnd,
      };
    }

    const nextCurrentBucket = (currentCounter?.currentBucket ?? 0) + 1;
    const previousBucket = previousCounter?.currentBucket ?? 0;

    await tx.$executeRaw`
      INSERT INTO "RateLimitCounter" (
        "id",
        "userId",
        "key",
        "windowStart",
        "windowEnd",
        "currentBucket",
        "previousBucket",
        "lastRequestAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${userId},
        ${SLIDING_WINDOW_RATE_LIMIT_KEY},
        ${currentWindowStart},
        ${currentWindowEnd},
        1,
        ${previousBucket},
        ${now},
        ${now},
        ${now}
      )
      ON CONFLICT ("userId", "key", "windowStart", "windowEnd")
      DO UPDATE SET
        "currentBucket" = ${nextCurrentBucket},
        "previousBucket" = ${previousBucket},
        "lastRequestAt" = ${now},
        "updatedAt" = ${now}
    `;

    const projectedCount = nextCurrentBucket + previousBucket * overlapWeight;
    const remaining = Math.max(0, Math.floor(FREE_DAILY_POST_GENERATION_LIMIT - projectedCount));

    return {
      allowed: true,
      limit: FREE_DAILY_POST_GENERATION_LIMIT,
      remaining,
      resetAt: currentWindowEnd,
    };
  });
}

export const FREE_DAILY_LIMIT_EXCEEDED_MESSAGE =
  "Your free limit has been exceeded. Please try again later.";
