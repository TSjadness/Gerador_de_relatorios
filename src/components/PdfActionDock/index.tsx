import { GenerateButton, PreviewButton, Dock, DockInner, Buttons } from './styles';

type PdfActionDockProps = {
  busy: 'preview' | 'download' | null;
  onPreview: () => void;
  onDownload: () => void;
  generateLabel?: string;
  previewLabel?: string;
  ariaLabel?: string;
};

export function PdfActionDock({
  busy,
  onPreview,
  onDownload,
  generateLabel = 'Gerar PDF do Diagnóstico',
  previewLabel = 'Visualizar PDF',
  ariaLabel = 'Ações do diagnóstico'
}: PdfActionDockProps) {
  return (
    <Dock aria-label={ariaLabel}>
      <DockInner>
        <Buttons>
          <GenerateButton
            type="button"
            icon={busy === 'download' ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
            label={busy === 'download' ? 'Gerando PDF…' : generateLabel}
            disabled={busy !== null}
            onClick={onDownload}
          />
          <PreviewButton
            type="button"
            icon={busy === 'preview' ? 'pi pi-spin pi-spinner' : 'pi pi-eye'}
            label={busy === 'preview' ? 'Preparando visualização…' : previewLabel}
            disabled={busy !== null}
            onClick={onPreview}
          />
        </Buttons>
      </DockInner>
    </Dock>
  );
}
