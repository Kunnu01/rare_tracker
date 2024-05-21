/*
  Warnings:

  - You are about to drop the column `api_key` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "users_api_key_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "api_key",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "tokens";
