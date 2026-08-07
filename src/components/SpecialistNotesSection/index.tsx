import { InputTextarea } from 'primereact/inputtextarea';
import { SectionCard } from '../SectionCard';

type SpecialistNotesSectionProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SpecialistNotesSection({ value, onChange }: SpecialistNotesSectionProps) {
  return (
    <SectionCard icon="04" title="Observações do Especialista" subtitle="Opcional. Aparece no PDF apenas se preenchido.">
      <InputTextarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        maxLength={3000}
        placeholder="Observações relevantes para o diagnóstico…"
        aria-label="Observações do especialista"
      />
    </SectionCard>
  );
}
