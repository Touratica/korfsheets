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

  playerStatistics.minutes += matchPlayerStatistics.minutes;
  playerStatistics.goals += matchPlayerStatistics.goals;
  playerStatistics.yellowCards += matchPlayerStatistics.yellowCards;
  playerStatistics.redCards += matchPlayerStatistics.redCards;
  playerStatistics.whiteCards += matchPlayerStatistics.whiteCards;

  return await prisma.playerStatistics.update({
    where: {
      fpcId: matchPlayer.playerFpcId,
    },
    data: playerStatistics,
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
