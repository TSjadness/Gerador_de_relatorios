import { useCallback, useMemo, useState } from 'react';
import { analyzeDasText, calculateDasTotals, createEmptyDasRow, formatMoneyInput, getFilledDasRows, parseMoney } from '../../domain/das';
import type { DasAnalysisResult, DasRow } from '../../types/das';
import { todayIso } from '../../utils/date';

const DEFAULT_ORIENTATION = 'Foram identificadas competências do DAS que exigem atenção. Recomenda-se conferir os valores, vencimentos e a situação de cada período antes da emissão ou regularização das guias.';
const DEFAULT_NOTES = 'Os valores devem ser confirmados no momento da emissão, pois juros e encargos podem ser atualizados.';

export function useDas() {
  const [rows, setRows] = useState<DasRow[]>([]);
  const [analysisDate, setAnalysisDate] = useState(todayIso);
  const [source, setSource] = useState('Consulta PGMEI / DAS');
  const [orientation, setOrientation] = useState(DEFAULT_ORIENTATION);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [includeInCombined, setIncludeInCombined] = useState(true);

  const filledRows = useMemo(() => getFilledDasRows(rows), [rows]);
  const totals = useMemo(() => calculateDasTotals(filledRows), [filledRows]);

  const addRow = useCallback(() => {
    setRows((current) => [...current, createEmptyDasRow()]);
  }, []);

  const updateRow = useCallback((id: string, field: keyof DasRow, value: string | boolean) => {
    setRows((current) => current.map((row) => {
      if (row.id !== id) return row;
      const next = { ...row, [field]: value } as DasRow;
      if (field === 'principal' || field === 'fine' || field === 'interest') {
        const total = parseMoney(next.principal) + parseMoney(next.fine) + parseMoney(next.interest);
        const hasComponentValue = Boolean(next.principal.trim() || next.fine.trim() || next.interest.trim());
        next.total = hasComponentValue ? formatMoneyInput(total) : '';
      }
      return next;
    }));
  }, []);

  const normalizeMoneyField = useCallback((id: string, field: 'principal' | 'fine' | 'interest' | 'total') => {
    setRows((current) => current.map((row) => {
      if (row.id !== id || !row[field].trim()) return row;
      return { ...row, [field]: formatMoneyInput(parseMoney(row[field])) };
    }));
  }, []);

  const duplicateRow = useCallback((id: string) => {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      if (index < 0) return current;
      const copy = { ...current[index], id: createEmptyDasRow().id };
      const next = [...current];
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  }, []);

  const analyzeText = useCallback((text: string): DasAnalysisResult => analyzeDasText(text), []);

  const applyAnalysis = useCallback((result: DasAnalysisResult, mode: 'append' | 'replace') => {
    setRows((current) => mode === 'replace' ? result.rows : [...getFilledDasRows(current), ...result.rows]);
  }, []);

  const reset = useCallback(() => {
    setRows([]);
    setAnalysisDate(todayIso());
    setSource('Consulta PGMEI / DAS');
    setOrientation(DEFAULT_ORIENTATION);
    setNotes(DEFAULT_NOTES);
    setIncludeInCombined(true);
  }, []);

  return {
    rows,
    filledRows,
    totals,
    analysisDate,
    source,
    orientation,
    notes,
    includeInCombined,
    setAnalysisDate,
    setSource,
    setOrientation,
    setNotes,
    setIncludeInCombined,
    addRow,
    updateRow,
    normalizeMoneyField,
    duplicateRow,
    removeRow,
    analyzeText,
    applyAnalysis,
    reset
  };
}
