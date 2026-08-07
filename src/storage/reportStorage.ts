import { MAX_HISTORY_ITEMS, STORAGE_KEY } from '../constants/diagnostic';
import type {
  CurrentCnpjStatus,
  CurrentStatusGroup,
  CustomerForm,
  CustomPendingIssue,
  DiagnosticStatus,
  ReportHistoryEntry
} from '../types/diagnostic';

const diagnosticStatuses: DiagnosticStatus[] = ['regular', 'atencao', 'pendencias', 'critico'];
const periodTypes = ['none', 'date', 'month', 'year'] as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isCustomer(value: unknown): value is CustomerForm {
  if (!value || typeof value !== 'object') return false;
  const customer = value as Partial<CustomerForm>;
  return typeof customer.name === 'string'
    && typeof customer.cnpj === 'string'
    && typeof customer.companyName === 'string'
    && typeof customer.consultationDate === 'string';
}

function isCurrentStatusGroup(value: unknown): value is CurrentStatusGroup {
  if (!value || typeof value !== 'object') return false;
  const group = value as Partial<CurrentStatusGroup>;
  return typeof group.status === 'string'
    && typeof group.periodType === 'string'
    && periodTypes.includes(group.periodType as CurrentStatusGroup['periodType'])
    && typeof group.date === 'string'
    && typeof group.month === 'string'
    && typeof group.year === 'string';
}

function isCurrentStatus(value: unknown): value is CurrentCnpjStatus {
  if (!value || typeof value !== 'object') return false;
  const currentStatus = value as Partial<CurrentCnpjStatus>;
  return isCurrentStatusGroup(currentStatus.simples) && isCurrentStatusGroup(currentStatus.simei);
}

function isCustomPendingIssues(value: unknown): value is CustomPendingIssue[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const pendingIssue = item as Partial<CustomPendingIssue>;
    return typeof pendingIssue.id === 'string' && typeof pendingIssue.label === 'string';
  });
}

function isPendingYears(value: unknown): value is Record<string, number[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value).every((years) => Array.isArray(years) && years.every((year) => Number.isInteger(year)));
}

function isHistoryEntry(value: unknown): value is ReportHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<ReportHistoryEntry>;
  return entry.schemaVersion === 1
    && typeof entry.id === 'string'
    && typeof entry.createdAt === 'string'
    && isCustomer(entry.customer)
    && typeof entry.status === 'string'
    && diagnosticStatuses.includes(entry.status as DiagnosticStatus)
    && isCurrentStatus(entry.currentStatus)
    && isStringArray(entry.pendingIssueIds)
    && isCustomPendingIssues(entry.customPendingIssues)
    && isPendingYears(entry.pendingYears)
    && isStringArray(entry.dasCompetencies)
    && isStringArray(entry.activeRecommendationIds)
    && isStringArray(entry.selectedServiceIds)
    && typeof entry.recommendations === 'string'
    && typeof entry.specialistNotes === 'string';
}

export function loadReportHistory(): ReportHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry).slice(-MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function saveReportHistory(items: ReportHistoryEntry[]): void {
  const normalized = items.slice(-MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}
