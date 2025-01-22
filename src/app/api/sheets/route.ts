import { getSheetData } from "@/app/utils/googleSheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const range = 'Vendas!A1:F30'; // Ajuste conforme necessário
    const data = await getSheetData(range);

    console.log("Dados obtidos com sucesso:", data);

    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      console.error("Formato inesperado:", data);
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Erro ao acessar o Google Sheets:", error);
    return NextResponse.json({ error: 'Erro ao acessar o Google Sheets', details: error }, { status: 500 });
  }
}
