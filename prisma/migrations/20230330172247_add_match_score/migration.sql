/*
  Warnings:

  - Added the required column `away_team_score` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_team_score` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "away_team_score" INTEGER NOT NULL CHECK ("away_team_score" >= 0),
ADD COLUMN     "home_team_score" INTEGER NOT NULL CHECK ("home_team_score" >= 0);
