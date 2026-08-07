import type { ReportHistoryEntry } from '../../types/diagnostic';
import { formatDateBr } from '../../utils/date';
import { SectionCard } from '../SectionCard';
import { Actions, Empty, HistoryItem, Info, MiniButton, StatusDot } from './styles';

type ReportHistoryProps = {
  history: ReportHistoryEntry[];
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ReportHistory({ history, onDuplicate, onDelete }: ReportHistoryProps) {
  return (
    <SectionCard icon="↻" title="Histórico de relatórios" subtitle="Últimos relatórios gerados neste navegador.">
      {!history.length ? <Empty>Nenhum relatório gerado ainda.</Empty> : history.slice().reverse().map((report) => (
        <HistoryItem key={report.id}>
          <StatusDot $status={report.status} aria-hidden="true" />
          <Info>
            <strong>{report.customer.name || 'Sem nome'}</strong>
            <span>{report.customer.cnpj} · {formatDateBr(report.customer.consultationDate)}</span>
          </Info>
          <Actions>
            <MiniButton type="button" icon="pi pi-copy" aria-label={`Duplicar relatório de ${report.customer.name}`} onClick={() => onDuplicate(report.id)} />
            <MiniButton $danger type="button" icon="pi pi-trash" aria-label={`Excluir relatório de ${report.customer.name}`} onClick={() => onDelete(report.id)} />
          </Actions>
        </HistoryItem>
      ))}
    </SectionCard>
  );
}
