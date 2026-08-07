import { useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { formatCurrency, groupDasRowsByYear } from '../../domain/das';
import type { CustomerForm, NotificationTone } from '../../types/diagnostic';
import type { DasAnalysisResult, DasRow, DasTotals } from '../../types/das';
import { FormField } from '../FormField';
import { SectionCard } from '../SectionCard';
import { DasAnalysisModal } from '../DasAnalysisModal';
import {
  ActionsCell,
  AnalysisButton,
  CheckboxInput,
  DasLayout,
  EmptyTable,
  EmptyTableCard,
  FieldInput,
  FieldSelect,
  FooterActions,
  FooterCard,
  FooterCheck,
  Grid,
  IconButton,
  InfoFlow,
  InfoFlowItem,
  MoneyInput,
  NotesGrid,
  SecondaryButton,
  SideCard,
  SideColumn,
  SummaryAmount,
  SummaryLabel,
  SummaryRow,
  SummaryRows,
  Table,
  TableScroll,
  TableToolbar,
  ToolbarActions,
  ToolbarHint,
  TotalsGrid,
  TotalCard,
  TotalLabel,
  TotalValue,
  YearFinancialGrid,
  YearFinancialItem,
  YearGroupHeader,
  YearGroupMeta,
  YearGroupSection,
  YearGroupTitle,
  YearGroupTotal,
  YearSummaryDivider,
  YearSummaryItem,
  YearSummaryList
} from './styles';

type BusyAction = 'preview' | 'download' | null;

type DasModuleProps = {
  customer: CustomerForm;
  errors: { name?: string; cnpj?: string };
  rows: DasRow[];
  filledRows: DasRow[];
  totals: DasTotals;
  analysisDate: string;
  source: string;
  orientation: string;
  notes: string;
  includeInCombined: boolean;
  busy: BusyAction;
  onNameChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
  onAnalysisDateChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onOrientationChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onIncludeInCombinedChange: (value: boolean) => void;
  onAddRow: () => void;
  onUpdateRow: (id: string, field: keyof DasRow, value: string | boolean) => void;
  onNormalizeMoney: (id: string, field: 'principal' | 'fine' | 'interest' | 'total') => void;
  onDuplicateRow: (id: string) => void;
  onRemoveRow: (id: string) => void;
  onAnalyzeText: (text: string) => DasAnalysisResult;
  onApplyAnalysis: (result: DasAnalysisResult, mode: 'append' | 'replace') => void;
  onPreviewDas: () => void;
  onDownloadDas: () => void;
  notify: (message: string, tone?: NotificationTone) => void;
};

const SITUATIONS = ['', 'Liquidado', 'A Vencer', 'Vencido', 'Em Aberto', 'Parcelado', 'Suspenso'];

export function DasModule({
  customer,
  errors,
  rows,
  filledRows,
  totals,
  analysisDate,
  source,
  orientation,
  notes,
  includeInCombined,
  busy,
  onNameChange,
  onCnpjChange,
  onAnalysisDateChange,
  onSourceChange,
  onOrientationChange,
  onNotesChange,
  onIncludeInCombinedChange,
  onAddRow,
  onUpdateRow,
  onNormalizeMoney,
  onDuplicateRow,
  onRemoveRow,
  onAnalyzeText,
  onApplyAnalysis,
  onPreviewDas,
  onDownloadDas,
  notify
}: DasModuleProps) {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const yearGroups = useMemo(() => groupDasRowsByYear(rows), [rows]);
  const filledYearGroups = useMemo(() => groupDasRowsByYear(filledRows), [filledRows]);

  const duplicateRow = (id: string) => {
    onDuplicateRow(id);
    notify('Linha duplicada. Ajuste os campos que forem diferentes.', 'success');
  };

  const removeRow = (id: string) => {
    if (!window.confirm('Excluir este registro de DAS?')) return;
    onRemoveRow(id);
    notify('Registro de DAS removido.', 'info');
  };

  const applyAnalysis = (result: DasAnalysisResult, mode: 'append' | 'replace') => {
    onApplyAnalysis(result, mode);
    notify(`${result.rows.length} ${result.rows.length === 1 ? 'registro importado' : 'registros importados'} para a tabela DAS.`, 'success');
  };

  const renderRow = (row: DasRow) => (
    <tr key={row.id}>
      <td><FieldInput value={row.period} placeholder="Janeiro/2026" onChange={(event) => onUpdateRow(row.id, 'period', event.target.value)} /></td>
      <td>
        <FieldSelect value={row.assessed} aria-label={`Apurado ${row.period || 'DAS'}`} onChange={(event) => onUpdateRow(row.id, 'assessed', event.target.value)}>
          <option value="">—</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </FieldSelect>
      </td>
      <td className="center">
        <CheckboxInput type="checkbox" checked={row.inssBenefit} aria-label={`Benefício INSS ${row.period || 'DAS'}`} onChange={(event) => onUpdateRow(row.id, 'inssBenefit', event.target.checked)} />
      </td>
      <td>
        <FieldSelect value={row.situation} aria-label={`Situação ${row.period || 'DAS'}`} onChange={(event) => onUpdateRow(row.id, 'situation', event.target.value)}>
          {SITUATIONS.map((situation) => <option key={situation || 'empty'} value={situation}>{situation || '—'}</option>)}
        </FieldSelect>
      </td>
      <td><MoneyInput value={row.principal} placeholder="0,00" onChange={(event) => onUpdateRow(row.id, 'principal', event.target.value)} onBlur={() => onNormalizeMoney(row.id, 'principal')} /></td>
      <td><MoneyInput value={row.fine} placeholder="0,00" onChange={(event) => onUpdateRow(row.id, 'fine', event.target.value)} onBlur={() => onNormalizeMoney(row.id, 'fine')} /></td>
      <td><MoneyInput value={row.interest} placeholder="0,00" onChange={(event) => onUpdateRow(row.id, 'interest', event.target.value)} onBlur={() => onNormalizeMoney(row.id, 'interest')} /></td>
      <td><MoneyInput value={row.total} placeholder="0,00" onChange={(event) => onUpdateRow(row.id, 'total', event.target.value)} onBlur={() => onNormalizeMoney(row.id, 'total')} /></td>
      <td><FieldInput value={row.dueDate} placeholder="20/08/2026" onChange={(event) => onUpdateRow(row.id, 'dueDate', event.target.value)} /></td>
      <td><FieldInput value={row.acceptanceDate} placeholder="20/08/2026" onChange={(event) => onUpdateRow(row.id, 'acceptanceDate', event.target.value)} /></td>
      <ActionsCell className="center">
        <IconButton type="button" title="Duplicar DAS" aria-label="Duplicar DAS" onClick={() => duplicateRow(row.id)}>
          <i className="pi pi-copy" aria-hidden="true" />
        </IconButton>
        <IconButton $danger type="button" title="Excluir DAS" aria-label="Excluir DAS" onClick={() => removeRow(row.id)}>
          <i className="pi pi-trash" aria-hidden="true" />
        </IconButton>
      </ActionsCell>
    </tr>
  );

  return (
    <>
      <DasLayout>
        <div>
          <SectionCard icon="01" title="Identificação do cliente" subtitle="Os dados são compartilhados com o Diagnóstico CNPJ para evitar digitação repetida." badge="Sincronizado">
            <Grid>
              <FormField label="Nome" htmlFor="das-customer-name" error={errors.name}>
                <InputText id="das-customer-name" value={customer.name} onChange={(event) => onNameChange(event.target.value)} placeholder="Nome do cliente" className={errors.name ? 'p-invalid' : undefined} />
              </FormField>
              <FormField label="CNPJ" htmlFor="das-customer-cnpj" error={errors.cnpj}>
                <InputText id="das-customer-cnpj" value={customer.cnpj} onChange={(event) => onCnpjChange(event.target.value)} placeholder="00.000.000/0000-00 ou 12.ABC.345/01DE-35" maxLength={18} className={errors.cnpj ? 'p-invalid' : undefined} />
              </FormField>
              <FormField label="Data da análise" htmlFor="das-analysis-date">
                <InputText id="das-analysis-date" type="date" value={analysisDate} onChange={(event) => onAnalysisDateChange(event.target.value)} />
              </FormField>
              <FormField label="Origem dos dados" htmlFor="das-source">
                <FieldSelect id="das-source" value={source} onChange={(event) => onSourceChange(event.target.value)}>
                  <option>Consulta PGMEI / DAS</option>
                  <option>Dados informados pelo cliente</option>
                  <option>Consulta interna</option>
                  <option>Outro</option>
                </FieldSelect>
              </FormField>
            </Grid>
          </SectionCard>

          <SectionCard icon="02" title="Detalhamento dos DAS" subtitle="As competências são separadas automaticamente por ano. Edite na tabela, adicione linhas ou importe uma consulta usando Análise." badge={`${filledRows.length} ${filledRows.length === 1 ? 'registro' : 'registros'}`}>
            <TableToolbar>
              <ToolbarActions>
                <SecondaryButton type="button" onClick={onAddRow}>
                  <i className="pi pi-plus" aria-hidden="true" />
                  Adicionar DAS
                </SecondaryButton>
                <AnalysisButton type="button" onClick={() => setAnalysisOpen(true)}>
                  <i className="pi pi-sparkles" aria-hidden="true" />
                  Análise
                </AnalysisButton>
              </ToolbarActions>
              <ToolbarHint>O ano é identificado pelo Período de Apuração e os subtotais são recalculados automaticamente.</ToolbarHint>
            </TableToolbar>

            {yearGroups.length ? yearGroups.map((group) => (
              <YearGroupSection key={group.key} $unknown={group.year === null}>
                <YearGroupHeader>
                  <div>
                    <YearGroupTitle>{group.year === null ? 'Sem ano informado' : `DAS - ${group.year}`}</YearGroupTitle>
                    <YearGroupMeta>
                      {group.year === null
                        ? 'Informe o período para que o registro seja movido automaticamente para o ano correto.'
                        : `${group.recordCount} ${group.recordCount === 1 ? 'competência' : 'competências'} neste ano`}
                    </YearGroupMeta>
                  </div>
                  <YearGroupTotal>
                    <span>{group.year === null ? 'Total provisório' : `Total de ${group.year}`}</span>
                    <strong>{formatCurrency(group.totals.total)}</strong>
                  </YearGroupTotal>
                </YearGroupHeader>

                <TableScroll>
                  <Table>
                    <thead>
                      <tr>
                        <th>Período de Apuração</th>
                        <th>Apurado</th>
                        <th className="center">Benefício INSS</th>
                        <th>Situação</th>
                        <th>Principal</th>
                        <th>Multa</th>
                        <th>Juros</th>
                        <th>Total</th>
                        <th>Data de Vencimento</th>
                        <th>Data de Acolhimento</th>
                        <th className="center actions">Ações</th>
                      </tr>
                    </thead>
                    <tbody>{group.rows.map(renderRow)}</tbody>
                  </Table>
                </TableScroll>

                <YearFinancialGrid>
                  <YearFinancialItem><span>Principal</span><strong>{formatCurrency(group.totals.principal)}</strong></YearFinancialItem>
                  <YearFinancialItem><span>Multa</span><strong>{formatCurrency(group.totals.fine)}</strong></YearFinancialItem>
                  <YearFinancialItem><span>Juros</span><strong>{formatCurrency(group.totals.interest)}</strong></YearFinancialItem>
                  <YearFinancialItem $featured><span>{group.year === null ? 'Total' : `Total ${group.year}`}</span><strong>{formatCurrency(group.totals.total)}</strong></YearFinancialItem>
                </YearFinancialGrid>
              </YearGroupSection>
            )) : (
              <EmptyTableCard>
                <EmptyTable>
                  <i className="pi pi-list" aria-hidden="true" />
                  <strong>Nenhum DAS adicionado</strong>
                  <span>Use “Adicionar DAS” para digitar manualmente ou “Análise” para importar o texto de uma consulta.</span>
                </EmptyTable>
              </EmptyTableCard>
            )}

            <TotalsGrid>
              <TotalCard><TotalLabel>Principal geral</TotalLabel><TotalValue>{formatCurrency(totals.principal)}</TotalValue></TotalCard>
              <TotalCard><TotalLabel>Multas gerais</TotalLabel><TotalValue>{formatCurrency(totals.fine)}</TotalValue></TotalCard>
              <TotalCard><TotalLabel>Juros gerais</TotalLabel><TotalValue>{formatCurrency(totals.interest)}</TotalValue></TotalCard>
              <TotalCard $featured><TotalLabel>Total geral dos anos</TotalLabel><TotalValue>{formatCurrency(totals.total)}</TotalValue></TotalCard>
            </TotalsGrid>
          </SectionCard>

          <SectionCard icon="03" title="Orientação e observações" subtitle="Informações complementares que poderão aparecer no PDF específico de DAS." badge="Editável">
            <NotesGrid>
              <FormField label="Orientação ao cliente" htmlFor="das-orientation">
                <textarea id="das-orientation" value={orientation} onChange={(event) => onOrientationChange(event.target.value)} rows={5} />
              </FormField>
              <FormField label="Observação adicional" htmlFor="das-notes">
                <textarea id="das-notes" value={notes} onChange={(event) => onNotesChange(event.target.value)} rows={5} />
              </FormField>
            </NotesGrid>
          </SectionCard>

          <FooterCard>
            <FooterCheck>
              <input type="checkbox" checked={includeInCombined} onChange={(event) => onIncludeInCombinedChange(event.target.checked)} />
              <span>
                <strong>Incluir Pendências DAS no documento completo</strong>
                <small>Ao gerar o documento completo, esta seção será adicionada depois do diagnóstico e antes dos certificados.</small>
              </span>
            </FooterCheck>
            <FooterActions>
              <SecondaryButton type="button" disabled={busy !== null} onClick={onPreviewDas}>
                <i className={busy === 'preview' ? 'pi pi-spin pi-spinner' : 'pi pi-eye'} aria-hidden="true" />
                {busy === 'preview' ? 'Preparando…' : 'Visualizar PDF DAS'}
              </SecondaryButton>
              <AnalysisButton type="button" disabled={busy !== null} onClick={onDownloadDas}>
                <i className={busy === 'download' ? 'pi pi-spin pi-spinner' : 'pi pi-download'} aria-hidden="true" />
                {busy === 'download' ? 'Gerando…' : 'Gerar PDF DAS'}
              </AnalysisButton>
            </FooterActions>
          </FooterCard>
        </div>

        <SideColumn>
          <SideCard>
            <SummaryLabel>Total geral analisado</SummaryLabel>
            <SummaryAmount>{formatCurrency(totals.total)}</SummaryAmount>
            <SummaryRows>
              <SummaryRow><span>Registros</span><strong>{filledRows.length}</strong></SummaryRow>
              <SummaryRow><span>Principal</span><strong>{formatCurrency(totals.principal)}</strong></SummaryRow>
              <SummaryRow><span>Multa</span><strong>{formatCurrency(totals.fine)}</strong></SummaryRow>
              <SummaryRow><span>Juros</span><strong>{formatCurrency(totals.interest)}</strong></SummaryRow>
            </SummaryRows>

            {filledYearGroups.length > 0 && (
              <>
                <YearSummaryDivider />
                <SummaryLabel>Totais por ano</SummaryLabel>
                <YearSummaryList>
                  {filledYearGroups.map((group) => (
                    <YearSummaryItem key={group.key} $unknown={group.year === null}>
                      <span>{group.year === null ? 'Sem ano' : String(group.year)} <small>{group.recordCount} DAS</small></span>
                      <strong>{formatCurrency(group.totals.total)}</strong>
                    </YearSummaryItem>
                  ))}
                </YearSummaryList>
              </>
            )}

            <p>Os registros são reagrupados por ano e os valores são recalculados imediatamente após qualquer alteração.</p>
          </SideCard>

          <SideCard>
            <h3>Fluxo da Análise</h3>
            <InfoFlow>
              <InfoFlowItem><span>1</span><div><strong>Cole o texto bruto</strong><p>Pode ser o conteúdo copiado da consulta, inclusive com tabulações.</p></div></InfoFlowItem>
              <InfoFlowItem><span>2</span><div><strong>Analisar</strong><p>O sistema extrai período, apuração, valores e datas sem inventar campos ausentes.</p></div></InfoFlowItem>
              <InfoFlowItem><span>3</span><div><strong>Conferir e concluir</strong><p>A tabela só é alterada depois da sua confirmação e cada competência entra automaticamente no ano correto.</p></div></InfoFlowItem>
            </InfoFlow>
          </SideCard>
        </SideColumn>
      </DasLayout>

      <DasAnalysisModal
        open={analysisOpen}
        existingCount={filledRows.length}
        onClose={() => setAnalysisOpen(false)}
        onAnalyze={onAnalyzeText}
        onApply={applyAnalysis}
      />
    </>
  );
}
