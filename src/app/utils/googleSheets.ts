// src/utils/googleSheets.ts ou no arquivo onde está a função getGoogleSheetsClient
import path from 'path';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = '1Q20g2hLf1D84p6FOG1jf_gIsVtcVGQyBKpmPnxTx9Vg';

const getGoogleSheetsClient = async () => {
    // Ajuste o caminho corretamente para apontar para src/app/api/sheets
    const keyFilePath = path.join(process.cwd(), 'src', 'app', 'api', 'sheets', 'stockrefino-240e97b71329.json');

    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: SCOPES,
    });

    return google.sheets({ version: 'v4', auth });
};

export const getSheetData = async (range: string) => {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
    });




    return response.data.values;
};
