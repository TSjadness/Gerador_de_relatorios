import { useState } from 'react';
import type { PendingIssueDefinition } from '../../types/diagnostic';
import { formatCompetency } from '../../domain/recommendations';
import {
  AddButton,
  Card,
  CardCopy,
  CardHead,
  CardLabel,
  CardText,
  CheckInput,
  DetailBox,
  DetailGrid,
  DetailHelp,
  DetailPanel,
  DetailTitle,
  EditorRow,
  MonthSelect,
  PeriodButton,
  Tag,
  Tags,
  YearInput
} from './styles';

type PendingIssueCardProps = {
  item: PendingIssueDefinition;
  selected: boolean;
  years: number[];
  competencies: string[];
  onToggle: (checked: boolean) => void;
  onAddYear: (value: string) => boolean;
  onRemoveYear: (year: number) => void;
  onAddCompetency: (month: string, year: string) => boolean;
  onRemoveCompetency: (value: string) => void;
};

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function PendingIssueCard({
  item,
  selected,
  years,
  competencies,
  onToggle,
  onAddYear,
  onRemoveYear,
  onAddCompetency,
  onRemoveCompetency
}: PendingIssueCardProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [competencyYear, setCompetencyYear] = useState('');

  const addYear = () => {
    if (onAddYear(year)) setYear('');
  };

  const addCompetency = () => {
    if (onAddCompetency(month, competencyYear)) setCompetencyYear('');
  };

  return (
    <Card $selected={selected}>
      <CardHead>
        <CardLabel>
          <CheckInput type="checkbox" checked={selected} onChange={(event) => onToggle(event.target.checked)} />
          <CardCopy>
            <strong>{item.label}</strong>
            <CardText>{item.description}</CardText>
          </CardCopy>
        </CardLabel>
        {selected && item.allowYears ? (
          <PeriodButton
            type="button"
            label={editorOpen ? 'Fechar' : item.id === 'das' ? 'Informar períodos' : 'Informar ano'}
            icon={editorOpen ? 'pi pi-chevron-up' : 'pi pi-calendar'}
            onClick={() => setEditorOpen((current) => !current)}
          />
        ) : null}
      </CardHead>

      {selected && item.allowYears && (editorOpen || years.length > 0 || competencies.length > 0) ? (
        <DetailPanel>
          {item.id === 'das' ? (
            <DetailGrid>
              <DetailBox>
                <DetailTitle>Ano completo</DetailTitle>
                <DetailHelp>Use quando o atraso deve ser informado pelo ano, sem detalhar os meses.</DetailHelp>
                <Tags>
                  {years.map((value) => (
                    <Tag key={value}>
                      Ano {value}
                      <button type="button" onClick={() => onRemoveYear(value)} aria-label={`Remover o ano ${value}`}>×</button>
                    </Tag>
                  ))}
                </Tags>
                {editorOpen ? (
                  <EditorRow>
                    <YearInput
                      type="number"
                      min={2000}
                      max={2100}
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addYear();
                        }
                      }}
                      placeholder="Ex.: 2026"
                      aria-label="Ano completo das guias DAS em atraso"
                    />
                    <AddButton type="button" label="Adicionar ano" icon="pi pi-plus" onClick={addYear} />
                  </EditorRow>
                ) : null}
              </DetailBox>
              <DetailBox>
                <DetailTitle>Mês e ano específicos</DetailTitle>
                <DetailHelp>Use quando for necessário identificar a competência mensal exata.</DetailHelp>
                <Tags>
                  {competencies.map((value) => (
                    <Tag key={value}>
                      {formatCompetency(value)}
                      <button type="button" onClick={() => onRemoveCompetency(value)} aria-label={`Remover a competência ${formatCompetency(value)}`}>×</button>
                    </Tag>
                  ))}
                </Tags>
                {editorOpen ? (
                  <EditorRow>
                    <MonthSelect value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Mês da guia DAS">
                      {months.map((label, index) => <option key={label} value={String(index + 1)}>{label}</option>)}
                    </MonthSelect>
                    <YearInput
                      type="number"
                      min={2000}
                      max={2100}
                      value={competencyYear}
                      onChange={(event) => setCompetencyYear(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addCompetency();
                        }
                      }}
                      placeholder="Ex.: 2026"
                      aria-label="Ano da competência"
                    />
                    <AddButton type="button" label="Adicionar mês" icon="pi pi-plus" onClick={addCompetency} />
                  </EditorRow>
                ) : null}
              </DetailBox>
            </DetailGrid>
          ) : (
            <DetailBox>
              <Tags>
                {years.map((value) => (
                  <Tag key={value}>
                    {value}
                    <button type="button" onClick={() => onRemoveYear(value)} aria-label={`Remover o ano ${value}`}>×</button>
                  </Tag>
                ))}
              </Tags>
              {editorOpen ? (
                <EditorRow>
                  <YearInput
                    type="number"
                    min={2000}
                    max={2100}
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addYear();
                      }
                    }}
                    placeholder="Ex.: 2026"
                    aria-label={`Ano da pendência ${item.label}`}
                  />
                  <AddButton type="button" label="Adicionar ano" icon="pi pi-plus" onClick={addYear} />
                </EditorRow>
              ) : null}
              <DetailHelp>Você pode incluir mais de um ano. Anos repetidos serão ignorados.</DetailHelp>
            </DetailBox>
          )}
        </DetailPanel>
      ) : null}
    </Card>
  );
}
