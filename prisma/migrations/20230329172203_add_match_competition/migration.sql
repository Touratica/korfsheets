/*
  Warnings:

  - Added the required column `competition` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "competition" TEXT NOT NULL;
