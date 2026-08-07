import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PENDING_ISSUES } from '../../constants/diagnostic';
import type { DiagnosticState } from '../../types/diagnostic';
import { PendingIssueCard } from '../PendingIssueCard';
import { SectionCard } from '../SectionCard';
import {
  AddCustomRow,
  CustomCard,
  CustomCopy,
  CustomRemove,
  List,
  NativeCheck
} from './styles';

type PendingIssuesSectionProps = {
  state: DiagnosticState;
  onToggle: (id: string, checked: boolean) => void;
  onAddCustom: (label: string) => boolean;
  onRemoveCustom: (id: string) => void;
  onAddYear: (id: string, value: string) => boolean;
  onRemoveYear: (id: string, year: number) => void;
  onAddDasCompetency: (month: string, year: string) => boolean;
  onRemoveDasCompetency: (value: string) => void;
};

export function PendingIssuesSection({
  state,
  onToggle,
  onAddCustom,
  onRemoveCustom,
  onAddYear,
  onRemoveYear,
  onAddDasCompetency,
  onRemoveDasCompetency
}: PendingIssuesSectionProps) {
  const [customLabel, setCustomLabel] = useState('');

  const addCustom = () => {
    if (onAddCustom(customLabel)) setCustomLabel('');
  };

  return (
    <SectionCard
      icon="02"
      title="Pendências"
      subtitle="Selecione os itens encontrados e, quando necessário, informe anos ou competências."
      badge={`${state.pendingIssueIds.length} ${state.pendingIssueIds.length === 1 ? 'selecionada' : 'selecionadas'}`}
    >
      <List>
        {PENDING_ISSUES.map((item) => (
          <PendingIssueCard
            key={item.id}
            item={item}
            selected={state.pendingIssueIds.includes(item.id)}
            years={state.pendingYears[item.id] ?? []}
            competencies={item.id === 'das' ? state.dasCompetencies : []}
            onToggle={(checked) => onToggle(item.id, checked)}
            onAddYear={(value) => onAddYear(item.id, value)}
            onRemoveYear={(year) => onRemoveYear(item.id, year)}
            onAddCompetency={onAddDasCompetency}
            onRemoveCompetency={onRemoveDasCompetency}
          />
        ))}
        {state.customPendingIssues.map((item) => (
          <CustomCard key={item.id} $selected={state.pendingIssueIds.includes(item.id)}>
            <label>
              <NativeCheck
                type="checkbox"
                checked={state.pendingIssueIds.includes(item.id)}
                onChange={(event) => onToggle(item.id, event.target.checked)}
              />
              <CustomCopy>
                <strong>{item.label}</strong>
                <span>Pendência adicionada manualmente.</span>
              </CustomCopy>
            </label>
            <CustomRemove type="button" icon="pi pi-times" aria-label={`Remover ${item.label}`} onClick={() => onRemoveCustom(item.id)} />
          </CustomCard>
        ))}
      </List>
      <AddCustomRow>
        <InputText
          value={customLabel}
          onChange={(event) => setCustomLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder="Descrever outra pendência…"
          aria-label="Descrever outra pendência"
        />
        <Button type="button" icon="pi pi-plus" label="Adicionar pendência" onClick={addCustom} />
      </AddCustomRow>
    </SectionCard>
  );
}
