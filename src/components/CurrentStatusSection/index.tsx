import { InputText } from 'primereact/inputtext';
import type { CurrentCnpjStatus, PeriodType } from '../../types/diagnostic';
import { FormField } from '../FormField';
import { SectionCard } from '../SectionCard';
import { Grid, Panel, PanelTitle, Preview, Select } from './styles';

type CurrentStatusSectionProps = {
  value: CurrentCnpjStatus;
  onChange: (
    group: keyof CurrentCnpjStatus,
    field: 'status' | 'periodType' | 'date' | 'month' | 'year',
    value: string
  ) => void;
};

const periodOptions: { value: PeriodType; label: string }[] = [
  { value: 'none', label: 'Sem data informada' },
  { value: 'date', label: 'Data completa' },
  { value: 'month', label: 'Mês e ano' },
  { value: 'year', label: 'Somente ano' }
];

function formatPreview(group: 'simples' | 'simei', value: CurrentCnpjStatus['simples']) {
  if (!value.status) return 'Situação não informada.';
  const status = group === 'simples'
    ? value.status === 'optante' ? 'Optante pelo Simples Nacional' : 'NÃO optante pelo Simples Nacional'
    : value.status === 'enquadrado' ? 'Enquadrado no SIMEI' : 'NÃO enquadrado no SIMEI';
  let period = '';
  if (value.periodType === 'date' && value.date) period = value.date.split('-').reverse().join('/');
  if (value.periodType === 'month' && value.month) period = value.month.split('-').reverse().join('/');
  if (value.periodType === 'year' && value.year) period = value.year;
  return `${status}${period ? ` · ${period}` : ''}`;
}

export function CurrentStatusSection({ value, onChange }: CurrentStatusSectionProps) {
  const renderPanel = (group: keyof CurrentCnpjStatus, title: string) => {
    const current = value[group];
    const statusOptions = group === 'simples'
      ? [
          { value: '', label: 'Não informado' },
          { value: 'optante', label: 'Optante pelo Simples Nacional' },
          { value: 'nao_optante', label: 'NÃO optante pelo Simples Nacional' }
        ]
      : [
          { value: '', label: 'Não informado' },
          { value: 'enquadrado', label: 'Enquadrado no SIMEI' },
          { value: 'nao_enquadrado', label: 'NÃO enquadrado no SIMEI' }
        ];

    return (
      <Panel key={group}>
        <PanelTitle>{title}</PanelTitle>
        <FormField label={`Situação no ${title}`}>
          <Select value={current.status} onChange={(event) => onChange(group, 'status', event.target.value)}>
            {statusOptions.map((option) => <option key={option.value || 'empty'} value={option.value}>{option.label}</option>)}
          </Select>
        </FormField>
        <FormField label="Formato do período">
          <Select
            value={current.periodType}
            disabled={!current.status}
            onChange={(event) => onChange(group, 'periodType', event.target.value)}
          >
            {periodOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </Select>
        </FormField>
        {current.periodType === 'date' ? (
          <FormField label="Data">
            <InputText type="date" value={current.date} onChange={(event) => onChange(group, 'date', event.target.value)} />
          </FormField>
        ) : null}
        {current.periodType === 'month' ? (
          <FormField label="Mês e ano">
            <InputText type="month" value={current.month} onChange={(event) => onChange(group, 'month', event.target.value)} />
          </FormField>
        ) : null}
        {current.periodType === 'year' ? (
          <FormField label="Ano">
            <InputText
              type="number"
              min={1900}
              max={2100}
              value={current.year}
              onChange={(event) => onChange(group, 'year', event.target.value)}
              placeholder="Ex.: 2026"
            />
          </FormField>
        ) : null}
        <Preview $filled={Boolean(current.status)}>{formatPreview(group, current)}</Preview>
      </Panel>
    );
  };

  return (
    <SectionCard icon="AT" title="Situação Atual do CNPJ" subtitle="Informe o enquadramento no Simples Nacional e no SIMEI, com período opcional." badge="Informação opcional">
      <Grid>
        {renderPanel('simples', 'Simples Nacional')}
        {renderPanel('simei', 'SIMEI')}
      </Grid>
    </SectionCard>
  );
}
