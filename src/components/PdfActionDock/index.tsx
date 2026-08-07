import { GenerateButton, PreviewButton, Dock, DockInner, Buttons } from './styles';

type PdfActionDockProps = {
  busy: 'preview' | 'download' | null;
  onPreview: () => void;
  onDownload: () => void;
};

export function PdfActionDock({ busy, onPreview, onDownload }: PdfActionDockProps) {
  return (
    <Dock aria-label="Ações do diagnóstico">
      <DockInner>
        <Buttons>
          <GenerateButton
            type="button"
            icon={busy === 'download' ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
            label={busy === 'download' ? 'Gerando PDF…' : 'Gerar PDF do Diagnóstico'}
            disabled={busy !== null}
            onClick={onDownload}
          />
          <PreviewButton
            type="button"
            icon={busy === 'preview' ? 'pi pi-spin pi-spinner' : 'pi pi-eye'}
            label={busy === 'preview' ? 'Preparando visualização…' : 'Visualizar PDF'}
            disabled={busy !== null}
            onClick={onPreview}
          />
        </Buttons>
      </DockInner>
    </Dock>
  );
}
