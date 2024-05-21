/*
  Warnings:

  - You are about to drop the column `duration` on the `sleeps` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `sleeps` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `sleeps` table. All the data in the column will be lost.
  - Added the required column `total_duration` to the `sleeps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sleeps" DROP COLUMN "duration",
DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "total_duration" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "sleep_sessions" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "sleepId" TEXT NOT NULL,

    CONSTRAINT "sleep_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sleep_sessions_sleepId_idx" ON "sleep_sessions"("sleepId");

-- AddForeignKey
ALTER TABLE "sleep_sessions" ADD CONSTRAINT "sleep_sessions_sleepId_fkey" FOREIGN KEY ("sleepId") REFERENCES "sleeps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
