import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const deleted = await prisma.matchPlayer.deleteMany({});

  return NextResponse.json({ deleted });
}
