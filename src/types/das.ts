import type { CustomerForm } from './diagnostic';

export type DasRow = {
  id: string;
  period: string;
  assessed: string;
  inssBenefit: boolean;
  situation: string;
  principal: string;
  fine: string;
  interest: string;
  total: string;
  dueDate: string;
  acceptanceDate: string;
};

export type DasTotals = {
  principal: number;
  fine: number;
  interest: number;
  total: number;
};

export type DasYearGroup = {
  key: string;
  year: number | null;
  label: string;
  rows: DasRow[];
  recordCount: number;
  totals: DasTotals;
};

export type DasAnalysisResult = {
  rows: DasRow[];
  rejectedLines: number;
};

export type DasPdfData = {
  customer: CustomerForm;
  analysisDate: string;
  source: string;
  rows: DasRow[];
  orientation: string;
  notes: string;
};
