import { useCallback, useMemo, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  MAX_CERTIFICATES,
  MAX_CERTIFICATE_SIZE_BYTES,
  MAX_CERTIFICATES_TOTAL_BYTES,
  MAX_HISTORY_ITEMS,
  RECOMMENDATION_LIBRARY,
  REPORT_TEMPLATES,
  SERVICE_CATALOG
} from '../../constants/diagnostic';
import { buildPendingLabel, createEmptyCurrentStatus, getCurrentStatusLines, getSuggestedServiceIds } from '../../domain/diagnostic';
import {
  formatCompetency,
  getDasCompetencies,
  getRecommendationText,
  getYears,
  normalizeCompetency,
  recommendationConflictsWithPendingIssues
} from '../../domain/recommendations';
import { loadReportHistory, saveReportHistory } from '../../storage';
import type {
  CertificateItem,
  CurrentCnpjStatus,
  DiagnosticPdfData,
  DiagnosticState,
  DiagnosticStatus,
  NotificationTone,
  PeriodType,
  ReportHistoryEntry
} from '../../types/diagnostic';
import { buildAutomaticCompanyName, isValidCnpj, maskCnpj } from '../../utils/cnpj';
import { todayIso } from '../../utils/date';
import { createId, normalizeTextarea } from '../../utils/format';

type Notification = {
  id: number;
  tone: NotificationTone;
  message: string;
};

type CustomerErrors = {
  name?: string;
  cnpj?: string;
};

function createInitialState(): DiagnosticState {
  return {
    status: 'regular',
    currentStatus: createEmptyCurrentStatus(),
    pendingIssueIds: [],
    customPendingIssues: [],
    pendingYears: {},
    dasCompetencies: [],
    activeRecommendationIds: [],
    recommendationSnapshots: {},
    selectedServiceIds: [],
    certificates: [],
    recommendations: '',
    specialistNotes: ''
  };
}

function removeTextBlock(value: string, block: string): string {
  if (!block) return normalizeTextarea(value);
  let next = value;
  let index = next.indexOf(block);
  while (index >= 0) {
    next = `${next.slice(0, index)}${next.slice(index + block.length)}`;
    index = next.indexOf(block);
  }
  return normalizeTextarea(next);
}

function appendTextBlock(value: string, block: string): string {
  const current = normalizeTextarea(value);
  if (!block || current.includes(block)) return current;
  return current ? `${current}\n\n${block}` : block;
}

function removeRecommendation(state: DiagnosticState, id: string): DiagnosticState {
  const snapshot = state.recommendationSnapshots[id] ?? getRecommendationText(state, id);
  const snapshots = { ...state.recommendationSnapshots };
  delete snapshots[id];
  return {
    ...state,
    recommendations: removeTextBlock(state.recommendations, snapshot),
    activeRecommendationIds: state.activeRecommendationIds.filter((item) => item !== id),
    recommendationSnapshots: snapshots
  };
}

function activateRecommendation(state: DiagnosticState, id: string): DiagnosticState {
  if (recommendationConflictsWithPendingIssues(state, id)) return removeRecommendation(state, id);
  if (state.activeRecommendationIds.includes(id)) return state;
  const text = getRecommendationText(state, id);
  if (!text) return state;
  return {
    ...state,
    recommendations: appendTextBlock(state.recommendations, text),
    activeRecommendationIds: [...state.activeRecommendationIds, id],
    recommendationSnapshots: { ...state.recommendationSnapshots, [id]: text }
  };
}

function refreshRecommendation(state: DiagnosticState, id: string): DiagnosticState {
  if (!state.activeRecommendationIds.includes(id)) return state;
  const previous = state.recommendationSnapshots[id] ?? getRecommendationText(state, id);
  const withoutPrevious = removeTextBlock(state.recommendations, previous);
  const nextText = getRecommendationText(state, id);
  return {
    ...state,
    recommendations: appendTextBlock(withoutPrevious, nextText),
    recommendationSnapshots: { ...state.recommendationSnapshots, [id]: nextText }
  };
}

function enforceConsistency(state: DiagnosticState): DiagnosticState {
  let next = state;
  if (next.pendingIssueIds.length > 0) {
    next = removeRecommendation(next, 'regular');
    next = removeRecommendation(next, 'preventiva');
    if (next.status === 'regular') next = { ...next, status: 'pendencias' };
  } else if (next.status === 'pendencias') {
    next = { ...next, status: 'regular' };
  }
  return next;
}

export function useDiagnostic() {
  const [customer, setCustomer] = useState({
    name: '',
    cnpj: '',
    companyName: '',
    consultationDate: todayIso()
  });
  const [companyNameAuto, setCompanyNameAuto] = useState(true);
  const [state, setState] = useState<DiagnosticState>(createInitialState);
  const [history, setHistory] = useState<ReportHistoryEntry[]>(loadReportHistory);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = useCallback((message: string, tone: NotificationTone = 'info') => {
    setNotification({ id: Date.now(), tone, message });
  }, []);

  const updateCustomerName = useCallback((name: string) => {
    setCustomer((current) => {
      const next = { ...current, name };
      if (companyNameAuto) next.companyName = buildAutomaticCompanyName(current.cnpj, name);
      return next;
    });
    setErrors((current) => ({ ...current, name: undefined }));
  }, [companyNameAuto]);

  const updateCustomerCnpj = useCallback((value: string) => {
    const cnpj = maskCnpj(value);
    setCustomer((current) => {
      const next = { ...current, cnpj };
      if (companyNameAuto) next.companyName = buildAutomaticCompanyName(cnpj, current.name);
      return next;
    });
    setErrors((current) => ({ ...current, cnpj: undefined }));
  }, [companyNameAuto]);

  const updateCompanyName = useCallback((companyName: string) => {
    setCompanyNameAuto(false);
    setCustomer((current) => ({ ...current, companyName }));
  }, []);

  const restoreAutomaticCompanyName = useCallback(() => {
    setCompanyNameAuto(true);
    setCustomer((current) => ({
      ...current,
      companyName: buildAutomaticCompanyName(current.cnpj, current.name)
    }));
    notify('Razão social automática restaurada.', 'success');
  }, [notify]);

  const updateConsultationDate = useCallback((consultationDate: string) => {
    setCustomer((current) => ({ ...current, consultationDate }));
  }, []);

  const setStatus = useCallback((status: DiagnosticStatus) => {
    if (status === 'regular' && state.pendingIssueIds.length > 0) {
      notify('Não é possível classificar como Regular enquanto houver pendências selecionadas.', 'warning');
      return;
    }
    setState((current) => ({ ...current, status }));
  }, [notify, state.pendingIssueIds.length]);

  const updateCurrentStatus = useCallback((group: keyof CurrentCnpjStatus, field: 'status' | 'periodType' | 'date' | 'month' | 'year', value: string) => {
    setState((current) => {
      const groupValue = { ...current.currentStatus[group] };
      if (field === 'status') {
        groupValue.status = value;
        if (!value) {
          groupValue.periodType = 'none';
          groupValue.date = '';
          groupValue.month = '';
          groupValue.year = '';
        }
      } else if (field === 'periodType') {
        groupValue.periodType = value as PeriodType;
      } else {
        groupValue[field] = value;
      }
      return {
        ...current,
        currentStatus: { ...current.currentStatus, [group]: groupValue }
      };
    });
  }, []);

  const togglePendingIssue = useCallback((id: string, checked: boolean) => {
    setState((current) => {
      let next = current;
      if (checked) {
        if (!current.pendingIssueIds.includes(id)) {
          next = { ...current, pendingIssueIds: [...current.pendingIssueIds, id] };
        }
        if (RECOMMENDATION_LIBRARY.some((item) => item.id === id)) next = activateRecommendation(next, id);
      } else {
        next = {
          ...current,
          pendingIssueIds: current.pendingIssueIds.filter((item) => item !== id)
        };
        if (RECOMMENDATION_LIBRARY.some((item) => item.id === id)) next = removeRecommendation(next, id);
      }
      return enforceConsistency(next);
    });
  }, []);

  const addCustomPendingIssue = useCallback((label: string) => {
    const normalized = label.trim();
    if (!normalized) return false;
    const id = createId('custom');
    setState((current) => enforceConsistency({
      ...current,
      customPendingIssues: [...current.customPendingIssues, { id, label: normalized }],
      pendingIssueIds: [...current.pendingIssueIds, id]
    }));
    notify('Pendência adicionada.', 'success');
    return true;
  }, [notify]);

  const removeCustomPendingIssue = useCallback((id: string) => {
    setState((current) => enforceConsistency({
      ...current,
      customPendingIssues: current.customPendingIssues.filter((item) => item.id !== id),
      pendingIssueIds: current.pendingIssueIds.filter((item) => item !== id)
    }));
    notify('Pendência personalizada removida.', 'info');
  }, [notify]);

  const addYear = useCallback((id: string, value: string) => {
    const year = Number(value);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      notify('Informe um ano válido entre 2000 e 2100.', 'warning');
      return false;
    }
    if (getYears(state, id).includes(year)) {
      notify(`O ano ${year} já foi informado.`, 'warning');
      return false;
    }
    setState((current) => {
      const years = getYears(current, id);
      if (years.includes(year)) return current;
      const next = {
        ...current,
        pendingYears: { ...current.pendingYears, [id]: [...years, year].sort((a, b) => a - b) }
      };
      return refreshRecommendation(next, id);
    });
    notify(`Ano ${year} adicionado.`, 'success');
    return true;
  }, [notify, state]);

  const removeYear = useCallback((id: string, year: number) => {
    setState((current) => {
      const next = {
        ...current,
        pendingYears: { ...current.pendingYears, [id]: getYears(current, id).filter((item) => item !== year) }
      };
      return refreshRecommendation(next, id);
    });
    notify(`Ano ${year} removido.`, 'info');
  }, [notify]);

  const addDasCompetency = useCallback((month: string, yearValue: string) => {
    const monthNumber = Number(month);
    const year = Number(yearValue);
    if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      notify('Selecione um mês válido.', 'warning');
      return false;
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      notify('Informe um ano válido entre 2000 e 2100.', 'warning');
      return false;
    }
    const competency = `${year}-${String(monthNumber).padStart(2, '0')}`;
    const label = formatCompetency(competency);
    if (getDasCompetencies(state).includes(competency)) {
      notify(`A competência ${label} já foi informada.`, 'warning');
      return false;
    }
    setState((current) => {
      const currentCompetencies = getDasCompetencies(current);
      if (currentCompetencies.includes(competency)) return current;
      const next = { ...current, dasCompetencies: [...currentCompetencies, competency].sort() };
      return refreshRecommendation(next, 'das');
    });
    notify(`Competência ${label} adicionada.`, 'success');
    return true;
  }, [notify, state]);

  const removeDasCompetency = useCallback((value: string) => {
    const competency = normalizeCompetency(value);
    setState((current) => {
      const next = { ...current, dasCompetencies: getDasCompetencies(current).filter((item) => item !== competency) };
      return refreshRecommendation(next, 'das');
    });
    notify(`Competência ${formatCompetency(competency)} removida.`, 'info');
  }, [notify]);

  const toggleRecommendation = useCallback((id: string) => {
    if (recommendationConflictsWithPendingIssues(state, id)) {
      setState((current) => removeRecommendation(current, id));
      notify('Esta recomendação só pode ser usada quando não houver pendências selecionadas.', 'warning');
      return;
    }
    const active = state.activeRecommendationIds.includes(id);
    setState((current) => active ? removeRecommendation(current, id) : activateRecommendation(current, id));
    notify(active ? 'Recomendação removida do texto.' : 'Recomendação ativada.', active ? 'info' : 'success');
  }, [notify, state]);

  const updateRecommendations = useCallback((recommendations: string) => {
    setState((current) => {
      let next = { ...current, recommendations };
      const activeIds = current.activeRecommendationIds.filter((id) => {
        const snapshot = current.recommendationSnapshots[id] ?? getRecommendationText(current, id);
        return recommendations.includes(snapshot) && !recommendationConflictsWithPendingIssues(current, id);
      });
      const snapshots: Record<string, string> = {};
      activeIds.forEach((id) => {
        snapshots[id] = current.recommendationSnapshots[id] ?? getRecommendationText(current, id);
      });
      next = { ...next, activeRecommendationIds: activeIds, recommendationSnapshots: snapshots };
      RECOMMENDATION_LIBRARY.forEach((item) => {
        if (recommendationConflictsWithPendingIssues(next, item.id)) return;
        const text = getRecommendationText(next, item.id);
        if (text && recommendations.includes(text) && !next.activeRecommendationIds.includes(item.id)) {
          next = {
            ...next,
            activeRecommendationIds: [...next.activeRecommendationIds, item.id],
            recommendationSnapshots: { ...next.recommendationSnapshots, [item.id]: text }
          };
        }
      });
      return enforceConsistency(next);
    });
  }, []);

  const updateSpecialistNotes = useCallback((specialistNotes: string) => {
    setState((current) => ({ ...current, specialistNotes }));
  }, []);

  const toggleService = useCallback((id: string, checked: boolean) => {
    if (!SERVICE_CATALOG.some((service) => service.id === id)) return;
    setState((current) => ({
      ...current,
      selectedServiceIds: checked
        ? [...new Set([...current.selectedServiceIds, id])]
        : current.selectedServiceIds.filter((item) => item !== id)
    }));
  }, []);

  const addCertificates = useCallback(async (files: FileList | File[]) => {
    const incoming = Array.from(files);
    if (!incoming.length) return;
    const accepted: CertificateItem[] = [];
    let invalid = 0;
    let duplicated = 0;
    let oversized = 0;
    let encryptedOrCorrupted = 0;
    let limitExceeded = 0;

    const existingKeys = new Set(state.certificates.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`));
    let totalBytes = state.certificates.reduce((sum, item) => sum + item.file.size, 0);

    for (const file of incoming) {
      if (state.certificates.length + accepted.length >= MAX_CERTIFICATES) {
        limitExceeded += 1;
        continue;
      }
      if (!(file.type === 'application/pdf' || /\.pdf$/i.test(file.name))) {
        invalid += 1;
        continue;
      }
      if (file.size > MAX_CERTIFICATE_SIZE_BYTES || totalBytes + file.size > MAX_CERTIFICATES_TOTAL_BYTES) {
        oversized += 1;
        continue;
      }
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (existingKeys.has(key)) {
        duplicated += 1;
        continue;
      }
      try {
        await PDFDocument.load(await file.arrayBuffer());
      } catch {
        encryptedOrCorrupted += 1;
        continue;
      }
      existingKeys.add(key);
      totalBytes += file.size;
      accepted.push({ id: createId('certificate'), file });
    }

    if (accepted.length) setState((current) => ({ ...current, certificates: [...current.certificates, ...accepted] }));

    const ignored = invalid + duplicated + oversized + encryptedOrCorrupted + limitExceeded;
    if (accepted.length && ignored === 0) notify(`${accepted.length} ${accepted.length === 1 ? 'certificado adicionado' : 'certificados adicionados'}.`, 'success');
    else if (accepted.length) notify(`${accepted.length} arquivo(s) adicionado(s) e ${ignored} ignorado(s) por validação ou limite.`, 'warning');
    else if (limitExceeded || state.certificates.length >= MAX_CERTIFICATES) notify(`O limite é de ${MAX_CERTIFICATES} certificados por relatório.`, 'warning');
    else if (oversized) notify('Um ou mais PDFs excedem o limite individual ou o limite total de anexos.', 'warning');
    else if (encryptedOrCorrupted) notify('Um ou mais PDFs estão inválidos, corrompidos ou protegidos por senha.', 'error');
    else if (duplicated) notify('Os certificados selecionados já foram adicionados.', 'info');
    else notify('Selecione somente arquivos PDF válidos.', 'warning');
  }, [notify, state.certificates]);

  const removeCertificate = useCallback((id: string) => {
    setState((current) => ({ ...current, certificates: current.certificates.filter((item) => item.id !== id) }));
    notify('Certificado removido.', 'info');
  }, [notify]);

  const applyTemplate = useCallback((key: string) => {
    if (!key || !REPORT_TEMPLATES[key]) return false;
    const hasData = Boolean(customer.name || customer.cnpj || state.recommendations || state.specialistNotes || state.pendingIssueIds.length || state.selectedServiceIds.length);
    if (hasData && !window.confirm('Aplicar este modelo irá substituir situação, pendências, recomendações e serviços. Deseja continuar?')) return false;
    const template = REPORT_TEMPLATES[key];
    let next = createInitialState();
    next = {
      ...next,
      status: template.status,
      pendingIssueIds: [...template.pendingIssueIds],
      specialistNotes: template.specialistNotes
    };
    template.recommendationIds.forEach((id) => {
      next = activateRecommendation(next, id);
    });
    setState(enforceConsistency(next));
    notify('Modelo aplicado. Ajuste os detalhes se necessário.', 'success');
    return true;
  }, [customer.cnpj, customer.name, notify, state.pendingIssueIds.length, state.recommendations, state.selectedServiceIds.length, state.specialistNotes]);

  const resetReport = useCallback((confirmReset = true) => {
    if (confirmReset && !window.confirm('Iniciar um novo relatório? Os campos preenchidos serão apagados.')) return false;
    setCustomer({ name: '', cnpj: '', companyName: '', consultationDate: todayIso() });
    setCompanyNameAuto(true);
    setErrors({});
    setState(createInitialState());
    notify('Novo relatório iniciado.', 'success');
    return true;
  }, [notify]);

  const validate = useCallback(() => {
    const nextErrors: CustomerErrors = {};
    if (!customer.name.trim()) nextErrors.name = 'Informe o nome do cliente.';
    if (!customer.cnpj.trim()) nextErrors.cnpj = 'Informe o CNPJ.';
    else if (!isValidCnpj(customer.cnpj)) nextErrors.cnpj = 'Informe um CNPJ válido, numérico ou alfanumérico.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notify('Revise os campos obrigatórios antes de continuar.', 'warning');
      return false;
    }
    return true;
  }, [customer.cnpj, customer.name, notify]);

  const getPdfData = useCallback((): DiagnosticPdfData => ({
    customer: {
      ...customer,
      companyName: customer.companyName.trim() || buildAutomaticCompanyName(customer.cnpj, customer.name)
    },
    status: state.status,
    currentStatusLines: getCurrentStatusLines(state.currentStatus),
    pendingLabels: state.pendingIssueIds.map((id) => buildPendingLabel(state, id)),
    serviceLabels: state.selectedServiceIds
      .map((id) => SERVICE_CATALOG.find((service) => service.id === id))
      .filter((service) => Boolean(service))
      .map((service) => service?.pdfLabel ?? service?.label ?? ''),
    recommendations: normalizeTextarea(state.recommendations),
    specialistNotes: normalizeTextarea(state.specialistNotes)
  }), [customer, state]);

  const saveGeneratedReport = useCallback(() => {
    const entry: ReportHistoryEntry = {
      id: createId('report'),
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        companyName: customer.companyName.trim() || buildAutomaticCompanyName(customer.cnpj, customer.name)
      },
      status: state.status,
      currentStatus: structuredClone(state.currentStatus),
      pendingIssueIds: [...state.pendingIssueIds],
      customPendingIssues: structuredClone(state.customPendingIssues),
      pendingYears: structuredClone(state.pendingYears),
      dasCompetencies: [...state.dasCompetencies],
      activeRecommendationIds: [...state.activeRecommendationIds],
      selectedServiceIds: [...state.selectedServiceIds],
      recommendations: normalizeTextarea(state.recommendations),
      specialistNotes: normalizeTextarea(state.specialistNotes)
    };
    const next = [...history, entry].slice(-MAX_HISTORY_ITEMS);
    try {
      saveReportHistory(next);
    } catch {
      notify('O PDF foi gerado, mas não foi possível salvar o histórico neste navegador.', 'warning');
    }
    setHistory(next);
  }, [customer, history, notify, state]);

  const duplicateHistoryReport = useCallback((id: string) => {
    const report = history.find((item) => item.id === id);
    if (!report) return;
    const automaticName = buildAutomaticCompanyName(report.customer.cnpj, report.customer.name);
    setCustomer({ ...report.customer, consultationDate: todayIso() });
    setCompanyNameAuto(!report.customer.companyName || report.customer.companyName === automaticName);
    setErrors({});
    const nextState: DiagnosticState = {
      status: report.status,
      currentStatus: structuredClone(report.currentStatus),
      pendingIssueIds: [...report.pendingIssueIds],
      customPendingIssues: structuredClone(report.customPendingIssues),
      pendingYears: structuredClone(report.pendingYears),
      dasCompetencies: [...report.dasCompetencies],
      activeRecommendationIds: [...report.activeRecommendationIds],
      recommendationSnapshots: {},
      selectedServiceIds: [...report.selectedServiceIds],
      certificates: [],
      recommendations: report.recommendations,
      specialistNotes: report.specialistNotes
    };
    nextState.activeRecommendationIds.forEach((recommendationId) => {
      nextState.recommendationSnapshots[recommendationId] = getRecommendationText(nextState, recommendationId);
    });
    setState(enforceConsistency(nextState));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify('Relatório duplicado. Adicione novamente os certificados, se necessário.', 'success');
  }, [history, notify]);

  const deleteHistoryReport = useCallback((id: string) => {
    if (!window.confirm('Excluir este relatório do histórico?')) return;
    const next = history.filter((item) => item.id !== id);
    try {
      saveReportHistory(next);
    } catch {
      notify('Não foi possível atualizar o histórico neste navegador.', 'error');
    }
    setHistory(next);
  }, [history, notify]);

  const suggestedServiceIds = useMemo(() => getSuggestedServiceIds(state), [state]);

  return {
    customer,
    state,
    history,
    errors,
    notification,
    companyNameAuto,
    suggestedServiceIds,
    notify,
    updateCustomerName,
    updateCustomerCnpj,
    updateCompanyName,
    restoreAutomaticCompanyName,
    updateConsultationDate,
    setStatus,
    updateCurrentStatus,
    togglePendingIssue,
    addCustomPendingIssue,
    removeCustomPendingIssue,
    addYear,
    removeYear,
    addDasCompetency,
    removeDasCompetency,
    toggleRecommendation,
    updateRecommendations,
    updateSpecialistNotes,
    toggleService,
    addCertificates,
    removeCertificate,
    applyTemplate,
    resetReport,
    validate,
    getPdfData,
    saveGeneratedReport,
    duplicateHistoryReport,
    deleteHistoryReport
  };
}
