import { InputTextarea } from 'primereact/inputtextarea';
import { RECOMMENDATION_LIBRARY } from '../../constants/diagnostic';
import { recommendationConflictsWithPendingIssues } from '../../domain/recommendations';
import type { DiagnosticState } from '../../types/diagnostic';
import { SectionCard } from '../SectionCard';
import { Chip, Chips, EditorNote } from './styles';

type RecommendationSectionProps = {
  state: DiagnosticState;
  onToggleRecommendation: (id: string) => void;
  onChange: (value: string) => void;
};

export function RecommendationSection({ state, onToggleRecommendation, onChange }: RecommendationSectionProps) {
  return (
    <SectionCard
      icon="03"
      title="Recomendações"
      subtitle="Ative textos prontos e mantenha liberdade para personalizar o diagnóstico."
      badge={`${state.activeRecommendationIds.length} ${state.activeRecommendationIds.length === 1 ? 'ativa' : 'ativas'}`}
    >
      <Chips aria-label="Biblioteca de recomendações">
        {RECOMMENDATION_LIBRARY.map((item) => {
          const active = state.activeRecommendationIds.includes(item.id);
          const blocked = recommendationConflictsWithPendingIssues(state, item.id);
          return (
            <Chip
              key={item.id}
              type="button"
              $active={active}
              disabled={blocked}
              aria-pressed={active}
              title={blocked ? 'Disponível somente quando não houver pendências selecionadas.' : undefined}
              onClick={() => onToggleRecommendation(item.id)}
            >
              <i className={active ? 'pi pi-check' : 'pi pi-plus'} />
              {item.label}
            </Chip>
          );
        })}
      </Chips>
      <EditorNote>
        <i className="pi pi-info-circle" aria-hidden="true" />
        <span>O conteúdo continua editável. Ao alterar manualmente um bloco automático, ele passa a ser tratado como texto personalizado.</span>
      </EditorNote>
      <InputTextarea
        value={state.recommendations}
        onChange={(event) => onChange(event.target.value)}
        rows={9}
        maxLength={6000}
        placeholder="Texto que aparecerá no PDF explicando a situação e as recomendações ao cliente…"
        aria-label="Texto das recomendações"
      />
    </SectionCard>
  );
}
