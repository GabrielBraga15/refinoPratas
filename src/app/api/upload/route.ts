import formidable from "formidable";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { IncomingMessage } from "http";
import { google } from "googleapis";

// Configuração do Google Drive e Google Sheets
const DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";  // Substitua com o ID da pasta do Google Drive
const SHEET_ID = "GOOGLE_PROJECT_ID";  // Substitua com o ID da sua planilha
const SHEET_RANGE = "Vendas!A1:G300";  // Intervalo onde os dados serão inseridos

// Função para autenticar com as APIs do Google
const authenticateGoogleAPI = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "path/to/your/service-account-credentials.json",  // Caminho para o arquivo de credenciais da conta de serviço
    scopes: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  return { drive, sheets };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Define o diretório de upload
  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Cria o form passando as opções desejadas
  const form = formidable({
    uploadDir,          // Diretório de upload
    keepExtensions: true, // Mantém as extensões dos arquivos
  });

  try {
    // Usa a API baseada em promise, que retorna uma tuple: [fields, files]
    const [fields, files] = await form.parse(req as unknown as IncomingMessage);

    // Verifica se o arquivo foi enviado
    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Extração dos dados enviados no formulário (não relacionados à imagem)
    const { name, price, stock, description, category, gender } = fields;

    // Autentica com as APIs do Google
    const { drive, sheets } = await authenticateGoogleAPI();

    // Faz o upload do arquivo para o Google Drive
    const fileMetadata = {
      name: file.newFilename,
      parents: [DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: file.mimetype || "application/octet-stream", // Defina um valor padrão caso 'file.mimetype' seja undefined
      body: fs.createReadStream(file.filepath),
    };

    // Ajuste da chamada para o Google Drive API
    const response = await drive.files.create({
      requestBody: fileMetadata,  // Passando 'requestBody' em vez de 'resource'
      media,  // Corretamente passando 'media'
      fields: "id, name, webViewLink",  // Inclui o link da visualização
    });

    // Verificando a resposta
    const imageLink = response.data?.webViewLink || "";  // Corrigido para lidar com a possibilidade de 'undefined'

    // Agora, vamos adicionar o link da imagem na planilha
    const values = [[name, price, stock, description, category, gender, imageLink]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    // Resposta de sucesso
    return NextResponse.json({ message: "Produto cadastrado com sucesso!", imageUrl: imageLink });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro no upload da imagem ou na integração com o Google Drive/Sheets" }, { status: 500 });
  }
}
