import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function getTeamByName(name: string) {
  const [clubInitials, designation] = name.split(" ");

  const team = await prisma.team.findUnique({
    where: {
      designation_clubInitials: {
        clubInitials,
        designation,
      },
    },
  });
  return team;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const team = await getTeamByName(slug);
  return NextResponse.json(team);
}
