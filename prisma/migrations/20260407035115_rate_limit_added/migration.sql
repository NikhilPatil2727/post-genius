-- CreateTable
CREATE TABLE "RateLimitCounter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "currentBucket" INTEGER NOT NULL,
    "previousBucket" INTEGER NOT NULL DEFAULT 0,
    "lastRequestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimitCounter_userId_key_windowEnd_idx" ON "RateLimitCounter"("userId", "key", "windowEnd");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimitCounter_userId_key_windowStart_windowEnd_key" ON "RateLimitCounter"("userId", "key", "windowStart", "windowEnd");

-- AddForeignKey
ALTER TABLE "RateLimitCounter" ADD CONSTRAINT "RateLimitCounter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
