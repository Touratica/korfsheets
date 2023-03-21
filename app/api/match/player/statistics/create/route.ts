import { updatePlayerStatistics } from "@/app/api/player/statistics/update/route";
import prisma from "@/lib/prisma";
import { MatchPlayerStatistics, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function createMatchPlayerStatistics(
  matchPlayerStatistics: MatchPlayerStatistics
): Promise<MatchPlayerStatistics> {
  try {
    const upsertedMatchPlayerStatistics =
      await prisma.matchPlayerStatistics.create({
        data: matchPlayerStatistics,
      });

    updatePlayerStatistics(upsertedMatchPlayerStatistics);

    return upsertedMatchPlayerStatistics;
  } catch (e) {
    // PrismaClientKnownRequestError: Error occurred during query execution:
    //     Code: P2002
    //     Message: Unique constraint failed on the fields: (`matchPlayerId`)
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return prisma.matchPlayerStatistics.findUniqueOrThrow({
        where: { matchPlayerId: matchPlayerStatistics.matchPlayerId },
      });
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { matchPlayerId, minutes, goals, yellowCards, redCards, whiteCards } =
    body;
  const match: MatchPlayerStatistics = {
    matchPlayerId,
    minutes,
    goals,
    yellowCards,
    redCards,
    whiteCards,
  };

  const upsertedMatchPlayer = await createMatchPlayerStatistics(match);

  return NextResponse.json({ upsertedMatchPlayer });
}
