-- CreateEnum
CREATE TYPE "FeedStatus" AS ENUM ('ACTIVE', 'ERROR', 'STALE');

-- AlterTable
ALTER TABLE "Feed" ADD COLUMN "status" "FeedStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Feed_status_idx" ON "Feed"("status");

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" SERIAL NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "feedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestLog_route_idx" ON "RequestLog"("route");

-- CreateIndex
CREATE INDEX "RequestLog_clientId_idx" ON "RequestLog"("clientId");

-- CreateIndex
CREATE INDEX "RequestLog_feedId_idx" ON "RequestLog"("feedId");

-- CreateIndex
CREATE INDEX "RequestLog_createdAt_idx" ON "RequestLog"("createdAt");

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE SET NULL ON UPDATE CASCADE;
