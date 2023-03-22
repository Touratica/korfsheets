import { updatePlayerStatistics } from "@/app/api/player/statistics/update/route";
import prisma from "@/lib/prisma";
import { MatchPlayerStatistics } from "@prisma/client";
import { NextRequest } from "next/server";
import { createMatchPlayerStatistics } from "../create/route";

export async function updateMatchPlayerStatistics(
  matchPlayerStatistics: MatchPlayerStatistics
): Promise<MatchPlayerStatistics> {
  try {
    const oldMatchPlayerStatistics =
      await prisma.matchPlayerStatistics.findUniqueOrThrow({
        where: {
          matchPlayerId: matchPlayerStatistics.matchPlayerId,
        },
      });

    oldMatchPlayerStatistics.minutes = -oldMatchPlayerStatistics.minutes;
    oldMatchPlayerStatistics.goals = -oldMatchPlayerStatistics.goals;
    oldMatchPlayerStatistics.yellowCards =
      -oldMatchPlayerStatistics.yellowCards;
    oldMatchPlayerStatistics.redCards = -oldMatchPlayerStatistics.redCards;
    oldMatchPlayerStatistics.whiteCards = -oldMatchPlayerStatistics.whiteCards;

    await updatePlayerStatistics(oldMatchPlayerStatistics);

    await prisma.matchPlayerStatistics.delete({
      where: {
        matchPlayerId: oldMatchPlayerStatistics.matchPlayerId,
      },
    });

    return createMatchPlayerStatistics(matchPlayerStatistics);
  } catch (error) {
    throw error;
  }
}

export async function POST(req: NextRequest) {
  throw new Error("Not implemented");
}
