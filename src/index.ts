import 'dotenv/config';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, ServiceAccountCredentials } from 'google-spreadsheet';
import credentials from './credentials.json';
import readCSV, { ReadReturns } from './readCSV';

async function addDataInRows(newSheet: GoogleSpreadsheetWorksheet, infos: ReadReturns) {
  const headers = infos.headers;

  let row: { [key: string]: string } = {};
  let rows: { [key: string]: string }[] = [];

  for (const data of infos.data) {
    const info = data.split(',');
    for (let i = 0; i < info.length; i++) {
      row[headers[i]] = info[i];
    }
    rows.push(row);

    row = {};
  }

  if (rows !== undefined) await newSheet.addRows(rows);
}

(async function addInNewSheet(): Promise<void> {
  try {
    const result = await readCSV('../page1.csv');
    const accessAccount: ServiceAccountCredentials = {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    };

    const doc = new GoogleSpreadsheet(process.env.DOC_ID);
    await doc.useServiceAccountAuth(accessAccount);

    // get cell info
    await doc.loadInfo();
    const table = doc.sheetsByIndex[0];
    await table.loadCells('A1:AJ11');
    const c2 = table.getCellByA1('C2');
    console.log(c2.value);

    // add in a new sheet
    if (result !== undefined) {
      const newSheet = await doc.addSheet({ title: 'Testando', gridProperties: {  columnCount: result.headers.length }, headerValues: result.headers });
      
      await addDataInRows(newSheet, result);
    }
  } catch (err) {
    console.log('err: ' + err);
  }
})();
