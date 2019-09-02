import * as moment from 'moment';

interface BillEntry {
  transaction_date: moment.Moment;
  bill_date: moment.Moment;
  from_account: number;
  to_account: number;
  transaction_amount: number;
  description: string;
  category: string;
  original_currency: string;
  billed_amount: number;
  notes: string;
}

type ParseFunction = (row: string) => BillEntry[];

interface ParseFunctionsMap {
  [type: string]: ParseFunction;
}

const parseFunctions: ParseFunctionsMap = {
  leumi: parseLeumiDump,
  leumicard: parseLeumiCardDump,
  cal: parseCalDump,
};

export function parseDump(dump: string, format: string): BillEntry[] {
  const trimmed = dump.trim();
  if (!trimmed) {
    return [];
  }
  const parseFunction = parseFunctions[format];

  if (!parseFunction) {
    throw new Error(`Invalid format: ${format}`);
  }

  return parseFunction(dump);
}

function splitRows(dump: string): string[] {
  return dump.split('\n').map((r) => r.trim()).filter((r) => r);
}

function parseLeumiDump(dump: string): BillEntry[] {
  const rows = splitRows(dump);

  return rows.map(parseLeumiRow);
}

function parseLeumiRow(row: string): BillEntry {
  const columns = row.split('\t');
  const entry: BillEntry = {
    transaction_date: moment(columns[0], 'DD/MM/YY'),
    bill_date: moment(columns[0], 'DD/MM/YY'),
    transaction_amount: parseFloat(columns[2]),
    description: columns[1],
    notes: columns[3],
    billed_amount: parseFloat(columns[4]),
    original_currency: 'ILS',
    from_account: null,
    to_account: null,
    category: ''
  };

  return entry;
}

function parseLeumiCardDump(dump: string): BillEntry[] {
  const rows = splitRows(dump);

  return rows.map(parseLeumiCardRow).filter((e) => e);
}

function leumicardParseAmountCurrency(rawTransactionAmount: string): [string, string] {
  let transactionAmount;
  let currency = 'ILS';

  const result = /^([0-9.-]+) ([A-Z]+)$/.exec(rawTransactionAmount);
  if (result) {
    // Format is: $AMOUNT $CURRENCY
    transactionAmount = result[1];
    currency = result[2];
  } else {
    // Format is: $CURRENCY_SYMBOL$AMOUNT
    transactionAmount = rawTransactionAmount.slice(1);
    currency = 'ILS';
  }
  transactionAmount = transactionAmount.replace(',', '');

  return [transactionAmount, currency];
}

function parseLeumiCardRow(row: string): BillEntry {
  const columns = row.split('\t');

  // Skip lines that aren't part of the transactions table
  if (columns.length < 6) {
    return null;
  }

  const date = moment(columns[0], 'DD/MM/YYYY');
  // Skip lines with invalid date, e.g. the table title line
  if (!date.isValid()) {
    return null;
  }
  const [transactionAmount, currency] = leumicardParseAmountCurrency(columns[4]);
  const billedAmount = columns[5].replace(',', '');

  const entry: BillEntry = {
    transaction_date: date,
    bill_date: date,
    transaction_amount: parseFloat(transactionAmount),
    description: columns[2],
    notes: columns[6],
    billed_amount: parseFloat(billedAmount),
    original_currency: currency,
    category: '',
    from_account: null,
    to_account: null
  };
  return entry;
}

function extractCalTable(dump: string): string[] {
  const rows = splitRows(dump);
  let startIndex = null;
  let endIndex = null;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (startIndex === null) {
      const date = moment(r, 'DD/MM/YY', true);
      if (date.isValid()) {
        startIndex = i;
      }
    } else {
      if (r.startsWith('סה"כ:')) {
        endIndex = i;
        break;
      }
    }
  }
  if (startIndex === null || endIndex === null) {
    throw new Error('Couldn\'t isolate table from dump');
  }

  return rows.slice(startIndex, endIndex);
}

function extractCalTableRows(table: string[]): string[][] {
  return table.reduce((total, r) => {
    const date = moment(r, 'DD/MM/YY', true);
    if (date.isValid()) {
      // New entry
      const entry = [r];
      total.push(entry);
    } else {
      // Existing entry
      const entry = total[total.length - 1];
      entry.push(r);
    }

    return total;
  }, []);
}

function parseCalAmount(amount: string): number {
  const amountCurrency = amount.split(' ');

  return parseFloat(amountCurrency[1].replace(',', ''));
}

function parseCalRow(row: string[]): BillEntry {
  const entry: BillEntry = {
    transaction_date: moment(row[0], 'DD/MM/YY'),
    bill_date: moment(row[0], 'DD/MM/YY'),
    transaction_amount: parseCalAmount(row[2]),
    description: row[1],
    notes: row[4],
    billed_amount: parseCalAmount(row[3]),
    original_currency: 'ILS',
    category: '',
    from_account: null,
    to_account: null
  };

  return entry;
}

function parseCalDump(dump: string): BillEntry[] {
  const table = extractCalTable(dump);
  const rows = extractCalTableRows(table);

  return rows.map(parseCalRow);
}

