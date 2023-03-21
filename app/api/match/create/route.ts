import prisma from "@/lib/prisma";
import { Match, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function createMatch(match: Omit<Match, "id">): Promise<Match> {
  try {
    const upsertedMatch = await prisma.match.upsert({
      create: match,
      update: match,
      where: {
        season_number: {
          season: match.season,
          number: match.number,
        },
      },
    });

    return upsertedMatch;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return createMatch(match);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { season, number, date, homeTeam, awayTeam } = body;
  const match: Omit<Match, "id"> = { season, number, date, homeTeam, awayTeam };

  const upsertedMatch = await createMatch(match);

  return NextResponse.json({ upsertedMatch });
}
