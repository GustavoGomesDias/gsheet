import * as fs from 'fs/promises';
import * as path from 'path';

export interface ReadReturns {
  headers: string[]
  data: string[]
}

export default async function readCSV(file: string): Promise<ReadReturns | undefined> {
  try {
    const filePath = path.join(__dirname, file);
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    const lstData = data.split('\r\n');
    const headers: string[] = lstData[0].split(',');
    lstData.shift();
    return {
      headers,
      data: lstData,
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};