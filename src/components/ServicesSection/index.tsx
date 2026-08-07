import { SERVICE_CATALOG } from '../../constants/diagnostic';
import type { DiagnosticState } from '../../types/diagnostic';
import { SectionCard } from '../SectionCard';
import { Badge, Check, Copy, List, ServiceCard, SuggestedLabel } from './styles';

type ServicesSectionProps = {
  state: DiagnosticState;
  suggestedServiceIds: string[];
  onToggle: (id: string, checked: boolean) => void;
};

export function ServicesSection({ state, suggestedServiceIds, onToggle }: ServicesSectionProps) {
  return (
    <SectionCard
      icon="05"
      title="Serviços recomendados"
      subtitle="Selecione um ou mais serviços para apresentar no diagnóstico."
      badge={`${state.selectedServiceIds.length} ${state.selectedServiceIds.length === 1 ? 'selecionado' : 'selecionados'}`}
    >
      <List aria-label="Serviços recomendados para o cliente">
        {SERVICE_CATALOG.map((service) => {
          const selected = state.selectedServiceIds.includes(service.id);
          const suggested = suggestedServiceIds.includes(service.id);
          return (
            <ServiceCard key={service.id} $selected={selected} $featured={Boolean(service.featured)} $suggested={suggested}>
              <Check
                type="checkbox"
                checked={selected}
                onChange={(event) => onToggle(service.id, event.target.checked)}
              />
              <Copy>
                <strong>{service.label}</strong>
                <span>{service.description}</span>
                {suggested ? <SuggestedLabel><i className="pi pi-star" /> Sugerido pelo diagnóstico</SuggestedLabel> : null}
              </Copy>
              <Badge $featured={Boolean(service.featured)}>{service.badge}</Badge>
            </ServiceCard>
          );
        })}
      </List>
    </SectionCard>
  );
}
