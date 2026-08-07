import type { DasAnalysisResult, DasRow, DasTotals, DasYearGroup } from '../types/das';
import { createId } from '../utils/format';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
] as const;

const SITUATION_LABELS = ['Liquidado', 'A Vencer', 'Vencido', 'Em Aberto', 'Parcelado', 'Suspenso'];
const MONEY_PATTERN = /R\$\s*-?[\d.]+(?:,\d{1,2})?/gi;
const DATE_PATTERN = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
const PERIOD_PATTERN = /\b(Janeiro|Fevereiro|Março|Marco|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|\d{1,2})\s*\/\s*(\d{4})\b/i;

export function createEmptyDasRow(): DasRow {
  return {
    id: createId('das'),
    period: '',
    assessed: '',
    inssBenefit: false,
    situation: '',
    principal: '',
    fine: '',
    interest: '',
    total: '',
    dueDate: '',
    acceptanceDate: ''
  };
}

export function parseMoney(value: string): number {
  const normalized = value
    .replace(/R\$/gi, '')
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoneyInput(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function calculateDasTotals(rows: DasRow[]): DasTotals {
  return rows.reduce<DasTotals>((totals, row) => ({
    principal: totals.principal + parseMoney(row.principal),
    fine: totals.fine + parseMoney(row.fine),
    interest: totals.interest + parseMoney(row.interest),
    total: totals.total + parseMoney(row.total)
  }), { principal: 0, fine: 0, interest: 0, total: 0 });
}

export function getDasYear(period: string): number | null {
  const match = period.match(/\b(\d{4})\b/);
  if (!match) return null;
  const year = Number.parseInt(match[1], 10);
  return Number.isInteger(year) ? year : null;
}

export function groupDasRowsByYear(rows: DasRow[]): DasYearGroup[] {
  const groups = new Map<string, { year: number | null; rows: DasRow[] }>();

  rows.forEach((row) => {
    const year = getDasYear(row.period);
    const key = year === null ? 'unknown' : String(year);
    const current = groups.get(key);
    if (current) {
      current.rows.push(row);
      return;
    }
    groups.set(key, { year, rows: [row] });
  });

  return Array.from(groups.entries())
    .map(([key, group]) => ({
      key,
      year: group.year,
      label: group.year === null ? 'Sem ano informado' : `DAS - ${group.year}`,
      rows: group.rows,
      recordCount: group.rows.filter(hasDasRowData).length,
      totals: calculateDasTotals(group.rows)
    }))
    .sort((a, b) => {
      if (a.year === null) return 1;
      if (b.year === null) return -1;
      return a.year - b.year;
    });
}

export function hasDasRowData(row: DasRow): boolean {
  return Boolean(
    row.period.trim() ||
    row.assessed.trim() ||
    row.inssBenefit ||
    row.situation.trim() ||
    row.principal.trim() ||
    row.fine.trim() ||
    row.interest.trim() ||
    row.total.trim() ||
    row.dueDate.trim() ||
    row.acceptanceDate.trim()
  );
}

export function getFilledDasRows(rows: DasRow[]): DasRow[] {
  return rows.filter(hasDasRowData);
}

function normalizeYesNo(value: string): string {
  const normalized = value.trim().toLocaleLowerCase('pt-BR');
  if (normalized === 'sim') return 'Sim';
  if (normalized === 'não' || normalized === 'nao') return 'Não';
  return '';
}

function normalizeDate(value: string): string {
  const match = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return value.trim();
  const [, day, month, year] = match;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

function normalizePeriod(value: string): string {
  const match = value.match(PERIOD_PATTERN);
  if (!match) return value.trim();
  const rawMonth = match[1];
  const year = match[2];
  const numericMonth = Number.parseInt(rawMonth, 10);
  if (Number.isInteger(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
    return `${MONTH_NAMES[numericMonth - 1]}/${year}`;
  }
  const normalizedMonth = rawMonth.toLocaleLowerCase('pt-BR').replace('marco', 'março');
  const index = MONTH_NAMES.findIndex((month) => month.toLocaleLowerCase('pt-BR') === normalizedMonth);
  return `${index >= 0 ? MONTH_NAMES[index] : rawMonth}/${year}`;
}

function stripMoney(value: string): string {
  return value.replace(/R\$/gi, '').trim();
}

function findSituation(values: string[]): string {
  for (const value of values) {
    const normalized = value.trim().toLocaleLowerCase('pt-BR');
    const match = SITUATION_LABELS.find((label) => label.toLocaleLowerCase('pt-BR') === normalized);
    if (match) return match;
  }
  return '';
}

function parseLine(line: string): DasRow | null {
  const periodMatch = line.match(PERIOD_PATTERN);
  if (!periodMatch) return null;

  const row = createEmptyDasRow();
  row.period = normalizePeriod(periodMatch[0]);

  const tabs = line.includes('\t') ? line.split('\t').map((part) => part.trim()) : [];
  const periodIndex = tabs.findIndex((part) => PERIOD_PATTERN.test(part));
  const afterPeriod = periodIndex >= 0 ? tabs.slice(periodIndex + 1) : [];

  const yesNoValues = afterPeriod.map(normalizeYesNo).filter(Boolean);
  row.assessed = yesNoValues[0] ?? '';
  if (yesNoValues.length > 1) row.inssBenefit = yesNoValues[1] === 'Sim';

  if (!row.assessed) {
    const rest = line.slice((periodMatch.index ?? 0) + periodMatch[0].length);
    const assessedMatch = rest.match(/\b(Sim|Não|Nao)\b/i);
    if (assessedMatch) row.assessed = normalizeYesNo(assessedMatch[1]);
  }

  row.situation = findSituation(afterPeriod.length ? afterPeriod : line.split(/\s{2,}/));

  const moneyMatches = line.match(MONEY_PATTERN) ?? [];
  const monetaryValues = moneyMatches.map(stripMoney);
  row.principal = monetaryValues[0] ?? '';
  row.fine = monetaryValues[1] ?? '';
  row.interest = monetaryValues[2] ?? '';
  row.total = monetaryValues[3] ?? '';

  const dates = (line.match(DATE_PATTERN) ?? []).map(normalizeDate);
  row.dueDate = dates[0] ?? '';
  row.acceptanceDate = dates[1] ?? '';

  if (tabs.length && moneyMatches.length < 4) {
    const moneyLike = afterPeriod.filter((part) => /^-?[\d.]+,\d{1,2}$/.test(part.replace(/R\$\s*/i, '')));
    const values = moneyLike.map((part) => stripMoney(part));
    if (!row.principal) row.principal = values[0] ?? '';
    if (!row.fine) row.fine = values[1] ?? '';
    if (!row.interest) row.interest = values[2] ?? '';
    if (!row.total) row.total = values[3] ?? '';
  }

  return row;
}

export function analyzeDasText(text: string): DasAnalysisResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows: DasRow[] = [];
  let rejectedLines = 0;

  lines.forEach((line) => {
    const row = parseLine(line);
    if (!row) {
      rejectedLines += 1;
      return;
    }
    rows.push(row);
  });

  return { rows, rejectedLines };
}
