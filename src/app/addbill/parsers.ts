import * as moment from 'moment';

interface BillEntry {
  date: moment.Moment;
  transactionAmount: number;
  description: string;
  currency: string;
  billedAmount: number;
  comments: string;
  category: string;
}

type ParseFunction = (row: string) => BillEntry[];

interface ParseFunctionsMap {
  [type: string]: ParseFunction;
}

const parseFunctions: ParseFunctionsMap = {
  leumi: parseLeumiDump,
  leumicard: parseLeumiCardDump,
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

function splitRows(dump: string) : string[] {
  return dump.split('\n').map((r) => r.trim()).filter((r) => r);
}

function parseLeumiDump(dump: string): BillEntry[] {
  const rows = splitRows(dump);

  return rows.map(parseLeumiRow);
}

function parseLeumiRow(row: string): BillEntry {
  const columns = row.split('\t');
  const entry: BillEntry = {
    date: moment(columns[0], 'DD/MM/YY'),
    transactionAmount: parseFloat(columns[2]),
    description: columns[1],
    comments: columns[3],
    billedAmount: parseFloat(columns[4]),
    currency: 'ILS',
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
    date: date,
    transactionAmount: parseFloat(transactionAmount),
    description: columns[2],
    comments: columns[6],
    billedAmount: parseFloat(billedAmount),
    currency: currency,
    category: ''
  };
  return entry;
}
