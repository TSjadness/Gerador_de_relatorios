import { MONTH_NAMES } from '../constants/diagnostic';
import type { DiagnosticState } from '../types/diagnostic';
import { formatList } from '../utils/format';

const STATIC_TEXT = {
  regular: '✔ Nenhuma pendência relevante foi identificada.\n\nMesmo assim, é importante manter o acompanhamento periódico do MEI para evitar problemas futuros.',
  alteracao: 'Os dados cadastrais do CNPJ merecem revisão para garantir que o cadastro permaneça atualizado.',
  preventiva: 'Consulta realizada de forma preventiva, sem indicação prévia de pendências.\n\nNão foram identificadas pendências no momento da análise. Recomenda-se acompanhamento periódico do CNPJ para evitar problemas futuros.',
  necessidade: 'Diante da situação identificada, recomenda-se entrar em contato com o contador de sua confiança para realizar todo o processo de regularização e acompanhamento.'
};

export function normalizeCompetency(value: string): string {
  const normalized = value.trim();
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(normalized) ? normalized : '';
}

export function formatCompetency(value: string, long = false): string {
  const normalized = normalizeCompetency(value);
  if (!normalized) return '';
  const [year, month] = normalized.split('-');
  const monthName = MONTH_NAMES[Number(month) - 1];
  return long ? `${monthName} de ${year}` : `${monthName}/${year}`;
}

export function getYears(state: DiagnosticState, id: string): number[] {
  return [...(state.pendingYears[id] ?? [])].filter(Number.isFinite).sort((a, b) => a - b);
}

export function getDasCompetencies(state: DiagnosticState): string[] {
  return [...new Set(state.dasCompetencies.map(normalizeCompetency).filter(Boolean))].sort();
}

export function getRecommendationText(state: DiagnosticState, id: string): string {
  const years = getYears(state, id);
  const yearList = formatList(years.map(String));
  const competencies = getDasCompetencies(state);
  const competencyList = formatList(competencies.map((value) => formatCompetency(value, true)));

  if (id === 'regular') return STATIC_TEXT.regular;
  if (id === 'alteracao') return STATIC_TEXT.alteracao;
  if (id === 'preventiva') return STATIC_TEXT.preventiva;
  if (id === 'necessidade') return STATIC_TEXT.necessidade;

  if (id === 'das') {
    const statements: string[] = [];
    if (years.length === 1) statements.push(`Foram identificadas guias DAS em atraso referentes ao ano de ${yearList}.`);
    if (years.length > 1) statements.push(`Foram identificadas guias DAS em atraso referentes aos anos de ${yearList}.`);
    if (competencies.length === 1) statements.push(`${statements.length ? 'Também foi identificada' : 'Foi identificada'} guia DAS em atraso referente ao mês de ${competencyList}.`);
    if (competencies.length > 1) statements.push(`${statements.length ? 'Também foram identificadas' : 'Foram identificadas'} guias DAS em atraso referentes aos meses de ${competencyList}.`);
    const first = statements.length ? statements.join(' ') : 'Foram identificadas guias DAS em atraso.';
    return `${first}\n\nA regularização evita juros, multas e possíveis restrições ao CNPJ.`;
  }

  if (id === 'dasn') {
    const first = years.length === 0
      ? 'Foi identificada ausência da Declaração Anual do Simples Nacional (DASN-SIMEI).'
      : years.length === 1
        ? `Foi identificada ausência da Declaração Anual do Simples Nacional (DASN-SIMEI) referente ao ano de ${yearList}.`
        : `Foram identificadas declarações DASN-SIMEI não entregues referentes aos anos de ${yearList}.`;
    return `${first}\n\nEssa obrigação deve ser transmitida por todos os MEIs, mesmo quando não houve movimento no período.`;
  }

  if (id === 'multas') {
    const first = years.length === 0
      ? 'Foram identificadas multas em aberto vinculadas ao CNPJ.'
      : years.length === 1
        ? `Foram identificadas multas em aberto vinculadas ao CNPJ referentes ao ano de ${yearList}.`
        : `Foram identificadas multas em aberto vinculadas ao CNPJ referentes aos anos de ${yearList}.`;
    return `${first}\n\nO não pagamento pode gerar acúmulo de juros e dificultar a regularização da situação cadastral.`;
  }

  if (id === 'parcelamento') {
    const first = years.length === 0
      ? 'Foi identificada a necessidade de parcelamento de débitos em aberto.'
      : years.length === 1
        ? `Foi identificada a necessidade de parcelamento de débitos referentes ao ano de ${yearList}.`
        : `Foi identificada a necessidade de parcelamento de débitos referentes aos anos de ${yearList}.`;
    return `${first}\n\nO parcelamento permite regularizar pendências antigas de forma gradual, conforme as condições disponíveis.`;
  }

  if (id === 'divida_ativa') {
    const first = years.length === 0
      ? 'Foi identificada inscrição de débitos em Dívida Ativa.'
      : years.length === 1
        ? `Foi identificada inscrição de débitos em Dívida Ativa referente ao ano de ${yearList}.`
        : `Foram identificadas inscrições de débitos em Dívida Ativa referentes aos anos de ${yearList}.`;
    return `${first}\n\nRecomenda-se consultar o órgão responsável pela inscrição, verificar os valores atualizados e avaliar as opções disponíveis para pagamento, negociação ou parcelamento.`;
  }

  return '';
}

export function recommendationConflictsWithPendingIssues(state: DiagnosticState, id: string): boolean {
  return state.pendingIssueIds.length > 0 && (id === 'regular' || id === 'preventiva');
}
