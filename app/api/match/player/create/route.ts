import prisma from "@/lib/prisma";
import { MatchPlayer, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function createMatchPlayer(
  matchPlayer: Omit<MatchPlayer, "id">
): Promise<MatchPlayer> {
  try {
    const upsertedMatchPlayer = await prisma.matchPlayer.upsert({
      create: matchPlayer,
      update: matchPlayer,
      where: {
        matchId_playerFpcId: {
          matchId: matchPlayer.matchId,
          playerFpcId: matchPlayer.playerFpcId,
        },
      },
    });

    return upsertedMatchPlayer;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return createMatchPlayer(matchPlayer);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { matchId, playerFpcId, team, jerseyNumber } = body;
  const match: Omit<MatchPlayer, "id"> = {
    matchId,
    playerFpcId,
    team,
    jerseyNumber,
  };

  const upsertedMatchPlayer = await createMatchPlayer(match);

  return NextResponse.json({ upsertedMatchPlayer });
}
