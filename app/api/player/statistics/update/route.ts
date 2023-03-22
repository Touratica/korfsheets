import prisma from "@/lib/prisma";
import { MatchPlayerStatistics } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function updatePlayerStatistics(
  matchPlayerStatistics: MatchPlayerStatistics
) {
  const matchPlayer = await prisma.matchPlayer.findUniqueOrThrow({
    where: {
      id: matchPlayerStatistics.matchPlayerId,
    },
  });

  const playerStatistics = await prisma.playerStatistics.findUnique({
    where: {
      fpcId: matchPlayer.playerFpcId,
    },
  });

  if (!playerStatistics) {
    return await prisma.playerStatistics.create({
      data: {
        fpcId: matchPlayer.playerFpcId,
        minutes: matchPlayerStatistics.minutes,
        goals: matchPlayerStatistics.goals,
        yellowCards: matchPlayerStatistics.yellowCards,
        redCards: matchPlayerStatistics.redCards,
        whiteCards: matchPlayerStatistics.whiteCards,
      },
    });
  }

  return await prisma.playerStatistics.update({
    where: {
      fpcId: matchPlayer.playerFpcId,
    },
    data: {
      minutes: { increment: matchPlayerStatistics.minutes },
      goals: { increment: matchPlayerStatistics.goals },
      yellowCards: { increment: matchPlayerStatistics.yellowCards },
      redCards: { increment: matchPlayerStatistics.redCards },
      whiteCards: { increment: matchPlayerStatistics.whiteCards },
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { matchPlayerId, minutes, goals, yellowCards, redCards, whiteCards } =
    body;
  const matchPlayerStatistics: MatchPlayerStatistics = {
    matchPlayerId,
    minutes,
    goals,
    yellowCards,
    redCards,
    whiteCards,
  };

  const upsertedPlayer = await updatePlayerStatistics(matchPlayerStatistics);

  return NextResponse.json({ upsertedPlayer });
}
