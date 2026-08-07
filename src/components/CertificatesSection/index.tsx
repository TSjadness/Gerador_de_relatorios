import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { MAX_CERTIFICATE_SIZE_BYTES, MAX_CERTIFICATES, MAX_CERTIFICATES_TOTAL_BYTES } from '../../constants/diagnostic';
import type { CertificateItem } from '../../types/diagnostic';
import { formatFileSize } from '../../utils/format';
import { SectionCard } from '../SectionCard';
import {
  FileActions,
  FileCard,
  FileCopy,
  FileIcon,
  FileInput,
  FileList,
  FileOrder,
  LimitNote,
  RemoveButton,
  SecurityNote,
  UploadRow
} from './styles';

type CertificatesSectionProps = {
  certificates: CertificateItem[];
  onAdd: (files: FileList | File[]) => Promise<void>;
  onRemove: (id: string) => void;
};

export function CertificatesSection({ certificates, onAdd, onRemove }: CertificatesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      await onAdd(files);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <SectionCard
      icon="06"
      title="Certificado do CNPJ"
      subtitle="Adicione um ou mais certificados em PDF. A numeração abaixo define a ordem em que os anexos serão incluídos no diagnóstico."
      badge={`${certificates.length} ${certificates.length === 1 ? 'adicionado' : 'adicionados'}`}
    >
      <UploadRow>
        <FileInput
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <Button
          type="button"
          icon={busy ? 'pi pi-spin pi-spinner' : 'pi pi-file-plus'}
          label={busy ? 'Validando PDFs…' : 'Adicionar certificado'}
          disabled={busy || certificates.length >= MAX_CERTIFICATES}
          onClick={() => inputRef.current?.click()}
        />
        <LimitNote>
          Até {MAX_CERTIFICATES} arquivos · {formatFileSize(MAX_CERTIFICATE_SIZE_BYTES)} por arquivo · {formatFileSize(MAX_CERTIFICATES_TOTAL_BYTES)} no total
        </LimitNote>
      </UploadRow>

      <FileList>
        {certificates.map((item, index) => (
          <FileCard key={item.id}>
            <FileOrder aria-label={`Ordem ${index + 1}`}>{String(index + 1).padStart(2, '0')}</FileOrder>
            <FileIcon aria-hidden="true"><i className="pi pi-file-pdf" /></FileIcon>
            <FileCopy>
              <strong title={item.file.name}>{item.file.name}</strong>
              <span>{formatFileSize(item.file.size)} · PDF validado</span>
            </FileCopy>
            <FileActions>
              <RemoveButton type="button" icon="pi pi-times" aria-label={`Remover certificado ${item.file.name}`} onClick={() => onRemove(item.id)} />
            </FileActions>
          </FileCard>
        ))}
      </FileList>

      <SecurityNote>
        <i className="pi pi-shield" aria-hidden="true" />
        <span>Os certificados ficam somente na memória da aba atual e não são armazenados no histórico. Ao iniciar ou duplicar um relatório, será necessário adicioná-los novamente.</span>
      </SecurityNote>
    </SectionCard>
  );
}
