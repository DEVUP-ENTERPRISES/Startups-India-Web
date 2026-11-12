/**
 * @jest-environment node
 */
import ExcelJS from 'exceljs';
import { parseSpreadsheetFile } from '@/lib/crm';

jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

function fakeFile(name, data, type = '') {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  return {
    name,
    type,
    text: async () => buf.toString('utf8'),
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  };
}

describe('parseSpreadsheetFile', () => {
  it('reads .xlsx headers and rows as text, skipping blank rows', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Leads');
    ws.addRow(['Name', 'Email', 'Phone']);
    ws.addRow(['Asha', 'asha@example.com', 9876543210]);
    ws.addRow([]);
    ws.addRow(['Ravi', 'ravi@example.com', '']);
    const buf = Buffer.from(await wb.xlsx.writeBuffer());

    const { headers, rows } = await parseSpreadsheetFile(fakeFile('leads.xlsx', buf));
    expect(headers).toEqual(['Name', 'Email', 'Phone']);
    expect(rows).toEqual([
      { Name: 'Asha', Email: 'asha@example.com', Phone: '9876543210' },
      { Name: 'Ravi', Email: 'ravi@example.com', Phone: '' },
    ]);
  });

  it('reads .csv including quoted commas and missing trailing cells', async () => {
    const csv =
      'Name,Email,College\n"Mehta, Priya",priya@example.com,IIT Bombay\nKiran,kiran@example.com\n\n';
    const { headers, rows } = await parseSpreadsheetFile(fakeFile('leads.csv', csv, 'text/csv'));
    expect(headers).toEqual(['Name', 'Email', 'College']);
    expect(rows).toEqual([
      { Name: 'Mehta, Priya', Email: 'priya@example.com', College: 'IIT Bombay' },
      { Name: 'Kiran', Email: 'kiran@example.com', College: '' },
    ]);
  });

  it('explains that legacy .xls is unsupported', async () => {
    await expect(parseSpreadsheetFile(fakeFile('old.xls', 'x'))).rejects.toThrow(/\.xlsx or \.csv/);
  });

  it('rejects a corrupt .xlsx with a friendly message', async () => {
    await expect(parseSpreadsheetFile(fakeFile('bad.xlsx', 'not a zip'))).rejects.toThrow(
      /valid \.xlsx or \.csv/
    );
  });

  it('rejects an empty file', async () => {
    await expect(
      parseSpreadsheetFile(fakeFile('empty.csv', 'Name,Email\n', 'text/csv'))
    ).rejects.toThrow(/no rows/);
  });
});
