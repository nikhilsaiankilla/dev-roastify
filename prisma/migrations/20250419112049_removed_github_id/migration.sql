/*
  Warnings:

  - You are about to drop the column `github_id` on the `RoastCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoastCard" DROP COLUMN "github_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
