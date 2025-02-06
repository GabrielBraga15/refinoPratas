import { google } from "googleapis";
import { NextResponse } from "next/server";
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

const SPREADSHEET_ID = '1Q20g2hLf1D84p6FOG1jf_gIsVtcVGQyBKpmPnxTx9Vg';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

// Função POST para cadastrar produto
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const price = formData.get("price")?.toString() || "";
    const stock = formData.get("stock")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const image = formData.get("image") as File;
    const category = formData.get("category")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";

    if (!image) {
      return NextResponse.json({ error: "Imagem é obrigatória!" }, { status: 400 });
    }

    // Convertendo o File para um Buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Convertendo o Buffer para um Stream
    const imageStream = streamifier.createReadStream(imageBuffer);

    const driveResponse = await drive.files.create({
      requestBody: {
        name: image.name,
        mimeType: image.type,
        parents: ["1hZ6ZjT6xTRR1RquoRucW8Q1B9TJfUeHk"], // Substitua pelo ID da pasta no Drive, se necessário
      },
      media: {
        mimeType: image.type,
        body: imageStream,
      },
    });

    const imageUrl = `https://drive.google.com/file/d/${driveResponse.data.id}/view?usp=drive_link`;

    const values = [[name, price, stock, description, imageUrl, category, gender]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Vendas!A1:H100",
      valueInputOption: "RAW",
      requestBody: { values },
    });

    return NextResponse.json({ message: "Produto cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return NextResponse.json({ error: "Erro ao cadastrar produto" }, { status: 500 });
  }
}

// Função GET para listar produtos
export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Vendas!A1:G1000",
    });

    const rows = response.data.values || [];

    const products = rows.slice(1).map((row) => ({
      name: row[0] || "",
      price: row[1] || "",
      stock: row[2] || "",
      description: row[3] || "",
      imageUrl: row[4] || "", // Faltava incluir a imagem
      category: row[5] || "",
      gender: row[6] || "",  // Aqui o índice deve ser 6
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
  }
}
