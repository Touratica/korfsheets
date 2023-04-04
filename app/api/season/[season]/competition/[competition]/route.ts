import prisma from "@/lib/prisma";
import { PrismaClient, TeamSeasonCompetitionStatistics } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function untie(
  a: TeamSeasonCompetitionStatistics & { points: number },
  b: TeamSeasonCompetitionStatistics & { points: number }
): number {
  if (!a.points !== !b.points) {
    return a.points > b.points ? -1 : 1;
  }
  if (a.goals - a.goalsAgainst !== b.goals - b.goalsAgainst) {
    return a.goals - a.goalsAgainst > b.goals - b.goalsAgainst ? -1 : 1;
  }
  if (a.goals !== b.goals) {
    return a.goals > b.goals ? -1 : 1;
  }

  let homeCardPoints = 0;
  let awayCardPoints = 0;

  prisma.matchPlayerStatistics
    .aggregate({
      where: {
        MatchPlayer: {
          Match: {
            season: a.season,
            competition: a.competition,
          },
          teamId: a.teamId,
        },
      },
      _sum: { yellowCards: true, redCards: true },
    })
    .then((homeTeamCards) => {
      homeCardPoints =
        (homeTeamCards._sum.yellowCards as number) * 3 +
        (homeTeamCards._sum.redCards as number) * 6;
    });

  prisma.matchPlayerStatistics
    .aggregate({
      where: {
        MatchPlayer: {
          Match: {
            season: b.season,
            competition: b.competition,
          },
          teamId: b.teamId,
        },
      },
      _sum: { yellowCards: true, redCards: true },
    })
    .then((awayTeamCards) => {
      awayCardPoints =
        (awayTeamCards._sum.yellowCards as number) * 3 +
        (awayTeamCards._sum.redCards as number) * 6;
    });

  if (homeCardPoints !== awayCardPoints) {
    return homeCardPoints < awayCardPoints ? -1 : 1;
  }

  return 0;
}

function TeamSeasonCompetitionStatistics(
  prismaTeamSeasonCompetitionStatistics: PrismaClient["teamSeasonCompetitionStatistics"]
) {
  return Object.assign(prismaTeamSeasonCompetitionStatistics, {
    async calculateTeamPoints({
      where: { season, competition, teamId },
    }: {
      where: { season: string; competition: string; teamId: string };
    }): Promise<TeamSeasonCompetitionStatistics & { points: number }> {
      const teamStatistics =
        await prismaTeamSeasonCompetitionStatistics.findUniqueOrThrow({
          where: {
            teamId_season_competition: {
              teamId,
              season,
              competition,
            },
          },
        });

      return {
        ...teamStatistics,
        points:
          teamStatistics.wins * 3 +
          teamStatistics.goldenGoalWins * 2 +
          teamStatistics.goldenGoalLosses,
      };
    },
    async calculateTeamsPoints({
      where: { season, competition },
    }: {
      where: { season: string; competition: string };
    }): Promise<(TeamSeasonCompetitionStatistics & { points: number })[]> {
      const teamsStatistics =
        await prismaTeamSeasonCompetitionStatistics.findMany({
          where: {
            season,
            competition,
          },
          include: {
            Team: {
              select: {
                clubInitials: true,
                designation: true,
              },
            },
          },
        });

      return teamsStatistics.map((teamStatistics) => {
        return {
          ...teamStatistics,
          points:
            teamStatistics.wins * 3 +
            teamStatistics.goldenGoalWins * 2 +
            teamStatistics.goldenGoalLosses,
        };
      });
    },
  });
}

async function getSeasonCompetitionStatistics(
  season: string,
  competition: string
): Promise<(TeamSeasonCompetitionStatistics & { points: number })[]> {
  const teamSeasonCompetitionStatistics = TeamSeasonCompetitionStatistics(
    prisma.teamSeasonCompetitionStatistics
  );

  return await teamSeasonCompetitionStatistics
    .calculateTeamsPoints({
      where: { season, competition },
    })
    .then((teamsStatistics) => {
      return teamsStatistics.sort(untie);
    });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { season: string; competition: string } }
): Promise<NextResponse> {
  const { season, competition } = params;
  const teamSeasonCompetitionStatistics = await getSeasonCompetitionStatistics(
    season,
    competition
  );
  return NextResponse.json(teamSeasonCompetitionStatistics);
}
