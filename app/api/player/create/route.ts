import prisma from "@/lib/prisma";
import { Player, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function createPlayer(player: Player): Promise<Player> {
  try {
    const upsertedPlayer = await prisma.player.upsert({
      create: player,
      update: player,
      where: {
        fpcId: player.fpcId,
      },
    });

    return upsertedPlayer;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return createPlayer(player);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fpcId, name } = body;
  const player: Player = { fpcId, name };

  const upsertedPlayer = await createPlayer(player);

  return NextResponse.json({ upsertedPlayer });
}
