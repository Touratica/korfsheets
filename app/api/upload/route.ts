import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type {
  Match,
  MatchPlayer,
  MatchPlayerStatistics,
  Player,
} from "@prisma/client";
import { createMatch } from "@/app/api/match/create/route";
import { createPlayer } from "@/app/api/player/create/route";
import { createMatchPlayer } from "@/app/api/match/player/create/route";
import { createMatchPlayerStatistics } from "@/app/api/match/player/statistics/create/route";
import { getTeamByName } from "../teams/[name]/route";

export async function POST(req: NextRequest) {
  try {
    const file = (await req.formData()).get("file") as File;
    const fileData = Buffer.from(await file.arrayBuffer());

    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(fileData).then(async () => {
      const worksheet = workbook.getWorksheet("Ficha de Jogo");

      const match: Omit<Match, "id"> = {
        season: worksheet.getCell("F2").value as string,
        number: worksheet.getCell("S2").value as number,
        date: worksheet.getCell("F3").result as Date,
        homeTeamId: (
          await getTeamByName(worksheet.getCell("A6").result as string)
        )?.id as string,
        awayTeamId: (
          await getTeamByName(worksheet.getCell("L6").result as string)
        )?.id as string,
      };

      const createdMatch = await createMatch(match);

      worksheet.getRows(10, 14)?.forEach(async (row) => {
        // Check if if there is a player playing for the home team in the row
        if (row.getCell("A").value) {
          const player: Player = {
            fpcId: row.getCell("A").value as number,
            name: row.getCell("C").result as string,
          };

          const createdPlayer = await createPlayer(player);

          const matchPlayer: Omit<MatchPlayer, "id"> = {
            matchId: createdMatch.id,
            playerFpcId: createdPlayer.fpcId,
            jerseyNumber: row.getCell("B").value as number,
            teamId: match.homeTeamId,
          };

          const createdMatchPlayer = await createMatchPlayer(matchPlayer);

          const matchPlayerStatistics: MatchPlayerStatistics = {
            matchPlayerId: createdMatchPlayer.id,
            minutes: (row.getCell("E").result as number) ?? 0,
            goals: (row.getCell("G").value as number) ?? 0,
            yellowCards: (row.getCell("H").value as number) ?? 0,
            redCards: (row.getCell("I").value as number) ?? 0,
            whiteCards: (row.getCell("J").value as number) ?? 0,
          };

          await createMatchPlayerStatistics(matchPlayerStatistics);
        }

        // Check if if there is a player playing for the away team in the row
        if (row.getCell("L").value) {
          const player: Player = {
            fpcId: row.getCell("L").value as number,
            name: row.getCell("N").result as string,
          };

          const createdPlayer = await createPlayer(player);

          const matchPlayer: Omit<MatchPlayer, "id"> = {
            matchId: createdMatch.id,
            playerFpcId: createdPlayer.fpcId,
            jerseyNumber: row.getCell("M").value as number,
            teamId: match.awayTeamId,
          };

          const createdMatchPlayer = await createMatchPlayer(matchPlayer);

          const matchPlayerStatistics: MatchPlayerStatistics = {
            matchPlayerId: createdMatchPlayer.id,
            minutes: (row.getCell("P").result as number) ?? 0,
            goals: (row.getCell("R").value as number) ?? 0,
            yellowCards: (row.getCell("S").value as number) ?? 0,
            redCards: (row.getCell("T").value as number) ?? 0,
            whiteCards: (row.getCell("U").value as number) ?? 0,
          };

          await createMatchPlayerStatistics(matchPlayerStatistics);
        }
      });
    });

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    throw error;
  }
}
