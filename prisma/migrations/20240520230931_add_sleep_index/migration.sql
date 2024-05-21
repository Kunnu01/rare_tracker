/*
  Warnings:

  - You are about to drop the `Sleep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sleep" DROP CONSTRAINT "Sleep_userId_fkey";

-- DropTable
DROP TABLE "Sleep";

-- CreateTable
CREATE TABLE "sleeps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sleeps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sleeps_userId_idx" ON "sleeps"("userId");

-- AddForeignKey
ALTER TABLE "sleeps" ADD CONSTRAINT "sleeps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
