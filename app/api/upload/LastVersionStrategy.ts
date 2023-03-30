import { Worksheet } from "exceljs";
import ImportStrategy from "./ImportStrategy";
import {
  Match,
  MatchPlayer,
  MatchPlayerStatistics,
  Player,
} from "@prisma/client";
import { getTeamByName } from "../teams/[name]/route";
import { createMatch } from "../match/create/route";
import { createPlayer } from "../player/create/route";
import { createMatchPlayer } from "../match/player/create/route";
import { createMatchPlayerStatistics } from "../match/player/statistics/create/route";

function getCompetitionFromMatchCode(matchCode: string): string {
  switch (matchCode.slice(0, 2)) {
    case "CN":
      return matchCode.slice(0, 3);

    case "TP":
      return "TP";

    default:
      throw new Error("Invalid match code");
  }
}

/** This strategy is used to import match sheet made after Nov 29, 2022. */
export default class LastVersionStrategy implements ImportStrategy {
  /**
   * Import a match sheet made after Nov 29, 2022.
   * @override
   * @param worksheet The worksheet to import
   */
  public async import(worksheet: Worksheet): Promise<void> {
    const match: Omit<Match, "id"> = {
      season: worksheet.getCell("F2").value as string,
      number: worksheet.getCell("S2").value as number,
      competition: getCompetitionFromMatchCode(
        worksheet.getCell("T2").result as string
      ),
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
  }
}
