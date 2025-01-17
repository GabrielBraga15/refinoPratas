// src/utils/googleSheets.ts ou no arquivo onde está a função getGoogleSheetsClient

import { google } from 'googleapis';


const SPREADSHEET_ID = '1Q20g2hLf1D84p6FOG1jf_gIsVtcVGQyBKpmPnxTx9Vg';

const getGoogleSheetsClient = async () => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
        },
        projectId: process.env.GOOGLE_PROJECT_ID,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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
