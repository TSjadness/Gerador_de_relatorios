import { useEffect, useState } from 'react';
import type { DasAnalysisResult } from '../../types/das';
import { formatCurrency, parseMoney } from '../../domain/das';
import {
  ActionRow,
  AnalysisTextarea,
  BackButton,
  Body,
  CloseButton,
  EmptyResult,
  Header,
  ImportMode,
  ImportModeGroup,
  ModalCard,
  ModalOverlay,
  PreviewScroll,
  PreviewTable,
  PrimaryButton,
  ResultBanner,
  ResultMeta,
  StageIntro,
  WarningNote
} from './styles';

type DasAnalysisModalProps = {
  open: boolean;
  existingCount: number;
  onClose: () => void;
  onAnalyze: (text: string) => DasAnalysisResult;
  onApply: (result: DasAnalysisResult, mode: 'append' | 'replace') => void;
};

export function DasAnalysisModal({ open, existingCount, onClose, onAnalyze, onApply }: DasAnalysisModalProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DasAnalysisResult | null>(null);
  const [mode, setMode] = useState<'append' | 'replace'>('append');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setResult(null);
      setMode(existingCount ? 'append' : 'replace');
    }
  }, [existingCount, open]);

  if (!open) return null;

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setResult(onAnalyze(text));
  };

  const handleApply = () => {
    if (!result?.rows.length) return;
    onApply(result, existingCount ? mode : 'replace');
    setText('');
    setResult(null);
    onClose();
  };

  return (
    <ModalOverlay role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby="das-analysis-title">
        <Header>
          <div>
            <h2 id="das-analysis-title">Análise de dados DAS</h2>
            <p>Cole o conteúdo bruto da consulta. O resultado será exibido para conferência antes de alterar a tabela.</p>
          </div>
          <CloseButton type="button" aria-label="Fechar análise" title="Fechar" onClick={onClose}>
            <i className="pi pi-times" aria-hidden="true" />
          </CloseButton>
        </Header>

        <Body>
          {!result ? (
            <>
              <StageIntro>
                <strong>Texto para análise</strong>
                <p>O analisador utiliza somente os campos disponíveis na tabela. Se uma informação não estiver presente no texto, o respectivo campo permanecerá vazio para edição manual.</p>
              </StageIntro>
              <AnalysisTextarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={'Exemplo:\nJunho/2023\tSim\t\tR$ 71,00\tR$ 14,20\tR$ 26,72\tR$ 111,92\t20/07/2023\t07/08/2026'}
                autoFocus
              />
              <ActionRow>
                <BackButton type="button" onClick={onClose}>Cancelar</BackButton>
                <PrimaryButton type="button" disabled={!text.trim()} onClick={handleAnalyze}>
                  <i className="pi pi-sparkles" aria-hidden="true" />
                  Analisar dados
                </PrimaryButton>
              </ActionRow>
            </>
          ) : (
            <>
              <ResultBanner>
                <div>
                  <strong>{result.rows.length ? 'Análise concluída' : 'Nenhum registro identificado'}</strong>
                  <ResultMeta>
                    {result.rows.length} {result.rows.length === 1 ? 'registro identificado' : 'registros identificados'}
                    {result.rejectedLines ? ` · ${result.rejectedLines} linha(s) ignorada(s)` : ''}
                  </ResultMeta>
                </div>
                <span>Confira antes de concluir</span>
              </ResultBanner>

              {existingCount > 0 && result.rows.length > 0 ? (
                <ImportModeGroup>
                  <strong>Já existem dados na tabela. Como deseja aplicar a análise?</strong>
                  <div>
                    <ImportMode>
                      <input type="radio" name="das-import-mode" value="append" checked={mode === 'append'} onChange={() => setMode('append')} />
                      Adicionar aos registros existentes
                    </ImportMode>
                    <ImportMode>
                      <input type="radio" name="das-import-mode" value="replace" checked={mode === 'replace'} onChange={() => setMode('replace')} />
                      Substituir a tabela atual
                    </ImportMode>
                  </div>
                </ImportModeGroup>
              ) : null}

              {result.rows.length ? (
                <PreviewScroll>
                  <PreviewTable>
                    <thead>
                      <tr>
                        <th>Período</th>
                        <th>Apurado</th>
                        <th>Benefício INSS</th>
                        <th>Situação</th>
                        <th>Principal</th>
                        <th>Multa</th>
                        <th>Juros</th>
                        <th>Total</th>
                        <th>Vencimento</th>
                        <th>Acolhimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.period || '—'}</td>
                          <td>{row.assessed || '—'}</td>
                          <td>{row.inssBenefit ? 'Sim' : '—'}</td>
                          <td>{row.situation || '—'}</td>
                          <td>{row.principal ? formatCurrency(parseMoney(row.principal)) : '—'}</td>
                          <td>{row.fine ? formatCurrency(parseMoney(row.fine)) : '—'}</td>
                          <td>{row.interest ? formatCurrency(parseMoney(row.interest)) : '—'}</td>
                          <td>{row.total ? formatCurrency(parseMoney(row.total)) : '—'}</td>
                          <td>{row.dueDate || '—'}</td>
                          <td>{row.acceptanceDate || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </PreviewTable>
                </PreviewScroll>
              ) : (
                <EmptyResult>Não foi possível reconhecer linhas com período de apuração. Volte e confira o conteúdo colado.</EmptyResult>
              )}

              <WarningNote>
                <i className="pi pi-info-circle" aria-hidden="true" />
                O sistema não inventa a situação do DAS. Se o texto não informar explicitamente “Liquidado”, “A Vencer”, “Vencido” ou outra situação reconhecível, o campo será importado vazio.
              </WarningNote>

              <ActionRow>
                <BackButton type="button" onClick={() => setResult(null)}>
                  <i className="pi pi-arrow-left" aria-hidden="true" />
                  Voltar e editar
                </BackButton>
                <PrimaryButton type="button" disabled={!result.rows.length} onClick={handleApply}>
                  <i className="pi pi-check" aria-hidden="true" />
                  Concluir e atualizar tabela
                </PrimaryButton>
              </ActionRow>
            </>
          )}
        </Body>
      </ModalCard>
    </ModalOverlay>
  );
}
