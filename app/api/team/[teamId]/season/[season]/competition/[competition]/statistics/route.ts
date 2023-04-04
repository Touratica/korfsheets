import prisma from "@/lib/prisma";
import {
  Match,
  Prisma,
  Team,
  TeamSeasonCompetitionStatistics,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function getTeamMatchStatistics(
  teamId: Team["id"],
  match: Pick<
    Match,
    "homeTeamId" | "awayTeamId" | "homeTeamScore" | "awayTeamScore"
  >
): Pick<
  TeamSeasonCompetitionStatistics,
  "wins" | "losses" | "goals" | "goalsAgainst"
> {
  switch (teamId) {
    case match.homeTeamId:
      const didHomeTeamWon = match.homeTeamScore > match.awayTeamScore;

      return {
        wins: didHomeTeamWon ? 1 : 0,
        losses: didHomeTeamWon ? 0 : 1,
        goals: match.homeTeamScore,
        goalsAgainst: match.awayTeamScore,
      };

    case match.awayTeamId:
      const didAwayTeamWon = match.awayTeamScore > match.homeTeamScore;

      return {
        wins: didAwayTeamWon ? 1 : 0,
        losses: didAwayTeamWon ? 0 : 1,
        goals: match.awayTeamScore,
        goalsAgainst: match.homeTeamScore,
      };

    default:
      throw new Error("Team not found in match");
  }
}

export async function updateTeamSeasonCompetitionStatistics(
  teamId: Team["id"],
  match: Match
): Promise<TeamSeasonCompetitionStatistics> {
  const teamSeasonCompetitionStatistics =
    await prisma.teamSeasonCompetitionStatistics.findUnique({
      where: {
        teamId_season_competition: {
          teamId,
          season: match.season,
          competition: match.competition,
        },
      },
    });

  const teamMatchStatistics = getTeamMatchStatistics(teamId, match);

  if (!teamSeasonCompetitionStatistics) {
    try {
      return await prisma.teamSeasonCompetitionStatistics.create({
        data: {
          teamId,
          season: match.season,
          competition: match.competition,
          matches: 1,
          goldenGoalWins: 0,
          goldenGoalLosses: 0,
          ...teamMatchStatistics,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        return await prisma.teamSeasonCompetitionStatistics.findUniqueOrThrow({
          where: {
            teamId_season_competition: {
              teamId,
              season: match.season,
              competition: match.competition,
            },
          },
        });

      throw e;
    }
  }

  return await prisma.teamSeasonCompetitionStatistics.update({
    where: {
      teamId_season_competition: {
        teamId,
        season: match.season,
        competition: match.competition,
      },
    },
    data: {
      matches: {
        increment: 1,
      },
      wins: {
        increment: teamMatchStatistics.wins,
      },
      losses: {
        increment: teamMatchStatistics.losses,
      },
      goals: {
        increment: teamMatchStatistics.goals,
      },
      goalsAgainst: {
        increment: teamMatchStatistics.goalsAgainst,
      },
    },
  });
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { teamId: string; season: string; competition: string };
  }
) {
  try {
    const { teamId, season, competition } = params;

    const teamSeasonCompetitionStatistics =
      await prisma.teamSeasonCompetitionStatistics.findUniqueOrThrow({
        where: {
          teamId_season_competition: {
            teamId,
            season,
            competition,
          },
        },
      });

    return NextResponse.json(teamSeasonCompetitionStatistics);
  } catch (error: any) {
    // checks if params are valid
    if (error instanceof TypeError)
      return NextResponse.json({ error: error.message });

    // checks if teamSeasonCompetitionStatistics exists
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return NextResponse.json({ error: error.message });
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: { params: { teamId: string; season: string; competition: string } }
) {
  const teamId = params.teamId;
  const season = params.season;
  const competition = params.competition;

  const body = await request.json();
  const {
    id,
    number,
    date,
    homeTeamId,
    awayTeamId,
    homeTeamScore,
    awayTeamScore,
  } = body;
  const match: Match = {
    id,
    season,
    number,
    competition,
    date,
    homeTeamId,
    awayTeamId,
    homeTeamScore,
    awayTeamScore,
  };

  const upsertedTeamSeasonCompetitionStatistics =
    await updateTeamSeasonCompetitionStatistics(teamId, match);

  return NextResponse.json(upsertedTeamSeasonCompetitionStatistics);
}
