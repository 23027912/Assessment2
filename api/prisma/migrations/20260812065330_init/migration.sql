-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "imageUrl" TEXT,
    "link" TEXT,
    "category" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestStat" (
    "id" SERIAL NOT NULL,
    "route" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feed_publishedAt_idx" ON "Feed"("publishedAt");

-- CreateIndex
CREATE INDEX "Feed_author_idx" ON "Feed"("author");

-- CreateIndex
CREATE UNIQUE INDEX "RequestStat_route_key" ON "RequestStat"("route");
