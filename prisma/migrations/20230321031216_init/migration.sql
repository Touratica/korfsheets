-- CreateTable
CREATE TABLE "clubs" (
    "initials" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("initials")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "club_initials" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams_season_competition_statistics" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "matches" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "golden_goal_wins" INTEGER NOT NULL DEFAULT 0,
    "golden_goal_losses" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "goals_against" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "teams_season_competition_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "player_fpc_id" INTEGER NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "team_designation" TEXT NOT NULL,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players_statistics" (
    "match_player_id" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "yellow_cards" INTEGER NOT NULL DEFAULT 0,
    "red_cards" INTEGER NOT NULL DEFAULT 0,
    "white_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "match_players_statistics_pkey" PRIMARY KEY ("match_player_id")
);

-- CreateTable
CREATE TABLE "players" (
    "fpc_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("fpc_id")
);

-- CreateTable
CREATE TABLE "players_statistics" (
    "fpc_id" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "yellow_cards" INTEGER NOT NULL DEFAULT 0,
    "red_cards" INTEGER NOT NULL DEFAULT 0,
    "white_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "players_statistics_pkey" PRIMARY KEY ("fpc_id")
);

-- CreateTable
CREATE TABLE "players_competition_statistics" (
    "id" TEXT NOT NULL,
    "fpc_id" INTEGER NOT NULL,
    "competition" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "yellow_cards" INTEGER NOT NULL DEFAULT 0,
    "red_cards" INTEGER NOT NULL DEFAULT 0,
    "white_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "players_competition_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players_season_statistics" (
    "id" TEXT NOT NULL,
    "fpc_id" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "yellow_cards" INTEGER NOT NULL DEFAULT 0,
    "red_cards" INTEGER NOT NULL DEFAULT 0,
    "white_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "players_season_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players_competition_season_statistics" (
    "id" TEXT NOT NULL,
    "fpc_id" INTEGER NOT NULL,
    "competition" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "yellow_cards" INTEGER NOT NULL DEFAULT 0,
    "red_cards" INTEGER NOT NULL DEFAULT 0,
    "white_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "players_competition_season_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_designation_club_initials_key" ON "teams"("designation", "club_initials");

-- CreateIndex
CREATE UNIQUE INDEX "teams_season_competition_statistics_team_id_season_competit_key" ON "teams_season_competition_statistics"("team_id", "season", "competition");

-- CreateIndex
CREATE UNIQUE INDEX "matches_season_number_key" ON "matches"("season", "number");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_match_id_player_fpc_id_key" ON "match_players"("match_id", "player_fpc_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_match_id_team_designation_jersey_number_key" ON "match_players"("match_id", "team_designation", "jersey_number");

-- CreateIndex
CREATE UNIQUE INDEX "players_competition_statistics_fpc_id_competition_key" ON "players_competition_statistics"("fpc_id", "competition");

-- CreateIndex
CREATE UNIQUE INDEX "players_season_statistics_fpc_id_season_key" ON "players_season_statistics"("fpc_id", "season");

-- CreateIndex
CREATE UNIQUE INDEX "players_competition_season_statistics_fpc_id_competition_se_key" ON "players_competition_season_statistics"("fpc_id", "competition", "season");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_club_initials_fkey" FOREIGN KEY ("club_initials") REFERENCES "clubs"("initials") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams_season_competition_statistics" ADD CONSTRAINT "teams_season_competition_statistics_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_player_fpc_id_fkey" FOREIGN KEY ("player_fpc_id") REFERENCES "players"("fpc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_team_designation_fkey" FOREIGN KEY ("team_designation") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players_statistics" ADD CONSTRAINT "match_players_statistics_match_player_id_fkey" FOREIGN KEY ("match_player_id") REFERENCES "match_players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_statistics" ADD CONSTRAINT "players_statistics_fpc_id_fkey" FOREIGN KEY ("fpc_id") REFERENCES "players"("fpc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_competition_statistics" ADD CONSTRAINT "players_competition_statistics_fpc_id_fkey" FOREIGN KEY ("fpc_id") REFERENCES "players"("fpc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_season_statistics" ADD CONSTRAINT "players_season_statistics_fpc_id_fkey" FOREIGN KEY ("fpc_id") REFERENCES "players"("fpc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_competition_season_statistics" ADD CONSTRAINT "players_competition_season_statistics_fpc_id_fkey" FOREIGN KEY ("fpc_id") REFERENCES "players"("fpc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
