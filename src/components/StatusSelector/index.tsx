import { STATUS_LABELS } from '../../constants/diagnostic';
import type { DiagnosticStatus } from '../../types/diagnostic';
import { SectionCard } from '../SectionCard';
import { Options, RadioInput, StatusOption, StatusPill, StatusTop } from './styles';

type StatusSelectorProps = {
  value: DiagnosticStatus;
  onChange: (status: DiagnosticStatus) => void;
};

const options = Object.keys(STATUS_LABELS) as DiagnosticStatus[];

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <SectionCard icon="ST" title="Situação do CNPJ" subtitle="Classifique o cenário encontrado durante a consulta.">
      <StatusTop>
        <StatusPill $status={value}>Situação: {STATUS_LABELS[value]}</StatusPill>
      </StatusTop>
      <Options role="radiogroup" aria-label="Situação do CNPJ">
        {options.map((status) => (
          <StatusOption key={status} $active={value === status}>
            <RadioInput
              type="radio"
              name="diagnostic-status"
              value={status}
              checked={value === status}
              onChange={() => onChange(status)}
            />
            <span>{STATUS_LABELS[status]}</span>
          </StatusOption>
        ))}
      </Options>
    </SectionCard>
  );
}
