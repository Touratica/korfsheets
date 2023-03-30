import { NextRequest, NextResponse } from "next/server";
import { Workbook } from "exceljs";
import ImportContext from "./ImportContext";
import LastVersionStrategy from "./LastVersionStrategy";

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

export async function POST(req: NextRequest) {
  try {
    const file = (await req.formData()).get("file") as File;
    const fileData = Buffer.from(await file.arrayBuffer());

    const workbook = new Workbook();
    workbook.xlsx.load(fileData).then(async () => {
      const worksheet = workbook.getWorksheet("Ficha de Jogo");

      const importContext = new ImportContext(new LastVersionStrategy());

      importContext.import(worksheet);
    });

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    throw error;
  }
}
