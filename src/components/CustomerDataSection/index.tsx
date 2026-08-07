import { InputText } from 'primereact/inputtext';
import { FormField } from '../FormField';
import { SectionCard } from '../SectionCard';
import { Grid, RestoreButton } from './styles';

type CustomerDataSectionProps = {
  customer: {
    name: string;
    cnpj: string;
    companyName: string;
    consultationDate: string;
  };
  errors: { name?: string; cnpj?: string };
  companyNameAuto: boolean;
  onNameChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onRestoreCompanyName: () => void;
  onDateChange: (value: string) => void;
};

export function CustomerDataSection({
  customer,
  errors,
  companyNameAuto,
  onNameChange,
  onCnpjChange,
  onCompanyNameChange,
  onRestoreCompanyName,
  onDateChange
}: CustomerDataSectionProps) {
  return (
    <SectionCard icon="01" title="Dados do Cliente" subtitle="Preencha com base na consulta ao CNPJ." badge="Nome e CNPJ obrigatórios">
      <Grid>
        <FormField label="Nome" htmlFor="customer-name" error={errors.name}>
          <InputText
            id="customer-name"
            value={customer.name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Nome do cliente"
            autoComplete="name"
            className={errors.name ? 'p-invalid' : undefined}
          />
        </FormField>
        <FormField
          label="CNPJ"
          htmlFor="customer-cnpj"
          error={errors.cnpj}
          help="Aceita o formato numérico atual e o novo CNPJ alfanumérico. As 12 primeiras posições podem conter letras e números; os 2 dígitos verificadores permanecem numéricos."
        >
          <InputText
            id="customer-cnpj"
            value={customer.cnpj}
            onChange={(event) => onCnpjChange(event.target.value)}
            placeholder="00.000.000/0000-00 ou 12.ABC.345/01DE-35"
            inputMode="text"
            autoCapitalize="characters"
            maxLength={18}
            className={errors.cnpj ? 'p-invalid' : undefined}
          />
        </FormField>
        <FormField
          label="Razão Social"
          htmlFor="company-name"
          help={companyNameAuto ? 'Preenchimento automático pela raiz do CNPJ e nome completo. O campo continua editável.' : 'Conteúdo personalizado manualmente.'}
          action={!companyNameAuto ? <RestoreButton type="button" label="Usar automático" onClick={onRestoreCompanyName} /> : null}
        >
          <InputText
            id="company-name"
            value={customer.companyName}
            onChange={(event) => onCompanyNameChange(event.target.value)}
            placeholder="Gerada automaticamente com o CNPJ e o nome"
          />
        </FormField>
        <FormField label="Data da consulta" htmlFor="consultation-date">
          <InputText
            id="consultation-date"
            type="date"
            value={customer.consultationDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </FormField>
      </Grid>
    </SectionCard>
  );
}
