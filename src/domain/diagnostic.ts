import { PENDING_ISSUES, SERVICE_CATALOG } from '../constants/diagnostic';
import type { CurrentCnpjStatus, DiagnosticState, PendingIssueDefinition } from '../types/diagnostic';
import { formatList } from '../utils/format';
import { formatCompetency, getDasCompetencies, getYears } from './recommendations';

export function createEmptyCurrentStatus(): CurrentCnpjStatus {
  return {
    simples: { status: '', periodType: 'none', date: '', month: '', year: '' },
    simei: { status: '', periodType: 'none', date: '', month: '', year: '' }
  };
}

export function getPendingDefinition(id: string): PendingIssueDefinition | undefined {
  return PENDING_ISSUES.find((item) => item.id === id);
}

export function getSuggestedServiceIds(state: DiagnosticState): string[] {
  const ids = state.pendingIssueIds.flatMap((id) => getPendingDefinition(id)?.serviceIds ?? []);
  return [...new Set(ids)].filter((id) => SERVICE_CATALOG.some((service) => service.id === id));
}

export function buildPendingLabel(state: DiagnosticState, id: string): string {
  const definition = getPendingDefinition(id);
  if (!definition) {
    return state.customPendingIssues.find((item) => item.id === id)?.label ?? id;
  }

  if (id === 'das') {
    const years = getYears(state, 'das');
    const competencies = getDasCompetencies(state);
    const details: string[] = [];
    if (years.length) details.push(`${years.length === 1 ? 'ano' : 'anos'} de ${formatList(years.map(String))}`);
    if (competencies.length) details.push(`${competencies.length === 1 ? 'mês' : 'meses'} de ${formatList(competencies.map((value) => formatCompetency(value, true)))}`);
    return details.length ? `Guias DAS em atraso — ${details.join('; ')}` : definition.label;
  }

  const years = getYears(state, id);
  if (!years.length) return definition.label;
  const joined = formatList(years.map(String));
  if (id === 'dasn') return years.length === 1 ? `DASN não entregue — referente ao ano de ${joined}` : `Declarações DASN não entregues — referentes aos anos de ${joined}`;
  if (id === 'multas') return `Multas em aberto — referentes ${years.length === 1 ? 'ao ano' : 'aos anos'} de ${joined}`;
  if (id === 'parcelamento') return `${definition.label} — débitos referentes ${years.length === 1 ? 'ao ano' : 'aos anos'} de ${joined}`;
  if (id === 'divida_ativa') return `Dívida Ativa — débitos inscritos referentes ${years.length === 1 ? 'ao ano' : 'aos anos'} de ${joined}`;
  return `${definition.label} — ${years.length === 1 ? 'ano informado' : 'anos informados'}: ${joined}`;
}

function formatPeriod(value: { periodType: string; date: string; month: string; year: string }): string {
  if (value.periodType === 'date' && value.date) {
    const [year, month, day] = value.date.split('-');
    return day && month && year ? `${day}/${month}/${year}` : '';
  }
  if (value.periodType === 'month' && value.month) {
    const [year, month] = value.month.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
  if (value.periodType === 'year' && value.year) return value.year;
  return '';
}

export function getCurrentStatusLines(currentStatus: CurrentCnpjStatus): string[] {
  const lines: string[] = [];
  const simpleLabel = currentStatus.simples.status === 'optante'
    ? 'Optante pelo Simples Nacional'
    : currentStatus.simples.status === 'nao_optante'
      ? 'NÃO optante pelo Simples Nacional'
      : '';
  const simeiLabel = currentStatus.simei.status === 'enquadrado'
    ? 'Enquadrado no SIMEI'
    : currentStatus.simei.status === 'nao_enquadrado'
      ? 'NÃO enquadrado no SIMEI'
      : '';

  if (simpleLabel) {
    const period = formatPeriod(currentStatus.simples);
    lines.push(`Situação no Simples Nacional: ${simpleLabel}${period ? ` — ${period}` : ''}`);
  }
  if (simeiLabel) {
    const period = formatPeriod(currentStatus.simei);
    lines.push(`Situação no SIMEI: ${simeiLabel}${period ? ` — ${period}` : ''}`);
  }
  return lines;
}
