import { useMemo, useState } from 'react';
import { brandColors } from '../../config/theme';
import logo from '../../assets/images/logo.png';
import { AppHeader } from '../../components/AppHeader';
import { AppNotification } from '../../components/AppNotification';
import { CertificatesSection } from '../../components/CertificatesSection';
import { CurrentStatusSection } from '../../components/CurrentStatusSection';
import { CustomerDataSection } from '../../components/CustomerDataSection';
import { DasModule } from '../../components/DasModule';
import { ModuleNavigation, type AppModule } from '../../components/ModuleNavigation';
import { PdfActionDock } from '../../components/PdfActionDock';
import { PendingIssuesSection } from '../../components/PendingIssuesSection';
import { RecommendationSection } from '../../components/RecommendationSection';
import { ReportHistory } from '../../components/ReportHistory';
import { ServicesSection } from '../../components/ServicesSection';
import { SpecialistNotesSection } from '../../components/SpecialistNotesSection';
import { StatusSelector } from '../../components/StatusSelector';
import { useDas } from '../../hooks/useDas';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { buildCombinedPdf, buildDasPdf, buildFinalPdf, downloadPdfBlob } from '../../pdf';
import type { DasPdfData } from '../../types/das';
import { AppShell, MainColumn, MainLayout, Sidebar, SkipLink, WorkspaceAnchor } from './styles';

type BusyAction = 'preview' | 'download' | null;

export function DiagnosticPage() {
  const diagnostic = useDiagnostic();
  const das = useDas();
  const [activeModule, setActiveModule] = useState<AppModule>('diagnostic');
  const [busy, setBusy] = useState<BusyAction>(null);
  const [dasBusy, setDasBusy] = useState<BusyAction>(null);

  const dasPdfData = useMemo<DasPdfData>(() => ({
    customer: {
      ...diagnostic.customer,
      companyName: diagnostic.customer.companyName
    },
    analysisDate: das.analysisDate,
    source: das.source,
    rows: das.filledRows,
    orientation: das.orientation,
    notes: das.notes
  }), [das.analysisDate, das.filledRows, das.notes, das.orientation, das.source, diagnostic.customer]);

  const hasDasInCombined = das.includeInCombined && das.filledRows.length > 0;

  const openPdfInNewTab = async (builder: () => Promise<{ blob: Blob; filename: string }>, successMessage: string) => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      diagnostic.notify('O navegador bloqueou a nova aba. Permita pop-ups para visualizar o PDF.', 'warning');
      return false;
    }
    try {
      previewWindow.opener = null;
      previewWindow.document.title = 'Preparando PDF…';
      previewWindow.document.body.innerHTML = `<p style="font-family:Inter,Arial,sans-serif;padding:24px;color:${brandColors.navy900};">Preparando visualização do PDF…</p>`;
    } catch {
      previewWindow.focus();
    }

    try {
      const result = await builder();
      const url = URL.createObjectURL(result.blob);
      previewWindow.location.replace(url);
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      diagnostic.notify(successMessage, 'success');
      return true;
    } catch {
      previewWindow.close();
      diagnostic.notify('Não foi possível visualizar o PDF. Revise os dados e os anexos e tente novamente.', 'error');
      return false;
    }
  };

  const previewCompletePdf = async () => {
    if (!diagnostic.validate()) return;
    setBusy('preview');
    try {
      await openPdfInNewTab(
        () => hasDasInCombined
          ? buildCombinedPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo, dasPdfData)
          : buildFinalPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo),
        hasDasInCombined ? 'Documento completo aberto em uma nova aba.' : 'PDF do diagnóstico aberto em uma nova aba.'
      );
    } finally {
      setBusy(null);
    }
  };

  const downloadCompletePdf = async () => {
    if (!diagnostic.validate()) return;
    setBusy('download');
    try {
      const result = hasDasInCombined
        ? await buildCombinedPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo, dasPdfData)
        : await buildFinalPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo);
      downloadPdfBlob(result.blob, result.filename);
      diagnostic.saveGeneratedReport();
      diagnostic.notify(hasDasInCombined ? 'Documento completo gerado e baixado com sucesso.' : 'PDF do diagnóstico gerado e baixado com sucesso.', 'success');
    } catch {
      diagnostic.notify('Não foi possível gerar o PDF. Revise os dados e os anexos e tente novamente.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const validateDas = () => {
    if (!diagnostic.validate()) return false;
    if (!das.filledRows.length) {
      diagnostic.notify('Adicione ou importe pelo menos um registro de DAS antes de gerar o PDF.', 'warning');
      return false;
    }
    return true;
  };

  const previewDasPdf = async () => {
    if (!validateDas()) return;
    setDasBusy('preview');
    try {
      await openPdfInNewTab(() => buildDasPdf(dasPdfData, logo), 'PDF de Pendências DAS aberto em uma nova aba.');
    } finally {
      setDasBusy(null);
    }
  };

  const downloadDasPdf = async () => {
    if (!validateDas()) return;
    setDasBusy('download');
    try {
      const result = await buildDasPdf(dasPdfData, logo);
      downloadPdfBlob(result.blob, result.filename);
      diagnostic.notify('PDF de Pendências DAS gerado e baixado com sucesso.', 'success');
    } catch {
      diagnostic.notify('Não foi possível gerar o PDF de Pendências DAS. Revise os dados e tente novamente.', 'error');
    } finally {
      setDasBusy(null);
    }
  };

  const resetAll = () => {
    if (!diagnostic.resetReport(true)) return;
    das.reset();
    setActiveModule('diagnostic');
  };

  const changeModule = (module: AppModule) => {
    setActiveModule(module);
    window.requestAnimationFrame(() => {
      document.getElementById('workspace-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <AppShell>
      <SkipLink href="#workspace-content">Pular para o conteúdo principal</SkipLink>
      <AppHeader
        showTemplates={activeModule === 'diagnostic'}
        onApplyTemplate={diagnostic.applyTemplate}
        onReset={resetAll}
      />

      <ModuleNavigation active={activeModule} dasCount={das.filledRows.length} onChange={changeModule} />

      <WorkspaceAnchor id="workspace-content">
        {activeModule === 'diagnostic' ? (
          <MainLayout>
            <MainColumn aria-label="Formulário do diagnóstico">
              <StatusSelector value={diagnostic.state.status} onChange={diagnostic.setStatus} />
              <CustomerDataSection
                customer={diagnostic.customer}
                errors={diagnostic.errors}
                companyNameAuto={diagnostic.companyNameAuto}
                onNameChange={diagnostic.updateCustomerName}
                onCnpjChange={diagnostic.updateCustomerCnpj}
                onCompanyNameChange={diagnostic.updateCompanyName}
                onRestoreCompanyName={diagnostic.restoreAutomaticCompanyName}
                onDateChange={diagnostic.updateConsultationDate}
              />
              <CurrentStatusSection value={diagnostic.state.currentStatus} onChange={diagnostic.updateCurrentStatus} />
              <PendingIssuesSection
                state={diagnostic.state}
                onToggle={diagnostic.togglePendingIssue}
                onAddCustom={diagnostic.addCustomPendingIssue}
                onRemoveCustom={diagnostic.removeCustomPendingIssue}
                onAddYear={diagnostic.addYear}
                onRemoveYear={diagnostic.removeYear}
                onAddDasCompetency={diagnostic.addDasCompetency}
                onRemoveDasCompetency={diagnostic.removeDasCompetency}
              />
              <RecommendationSection
                state={diagnostic.state}
                onToggleRecommendation={diagnostic.toggleRecommendation}
                onChange={diagnostic.updateRecommendations}
              />
              <SpecialistNotesSection value={diagnostic.state.specialistNotes} onChange={diagnostic.updateSpecialistNotes} />
              <ServicesSection
                state={diagnostic.state}
                suggestedServiceIds={diagnostic.suggestedServiceIds}
                onToggle={diagnostic.toggleService}
              />
              <CertificatesSection
                certificates={diagnostic.state.certificates}
                onAdd={diagnostic.addCertificates}
                onRemove={diagnostic.removeCertificate}
              />
            </MainColumn>

            <Sidebar aria-label="Informações complementares">
              <ReportHistory
                history={diagnostic.history}
                onDuplicate={diagnostic.duplicateHistoryReport}
                onDelete={diagnostic.deleteHistoryReport}
              />
            </Sidebar>
          </MainLayout>
        ) : (
          <DasModule
            customer={diagnostic.customer}
            errors={diagnostic.errors}
            rows={das.rows}
            filledRows={das.filledRows}
            totals={das.totals}
            analysisDate={das.analysisDate}
            source={das.source}
            orientation={das.orientation}
            notes={das.notes}
            includeInCombined={das.includeInCombined}
            busy={dasBusy}
            onNameChange={diagnostic.updateCustomerName}
            onCnpjChange={diagnostic.updateCustomerCnpj}
            onAnalysisDateChange={das.setAnalysisDate}
            onSourceChange={das.setSource}
            onOrientationChange={das.setOrientation}
            onNotesChange={das.setNotes}
            onIncludeInCombinedChange={das.setIncludeInCombined}
            onAddRow={das.addRow}
            onUpdateRow={das.updateRow}
            onNormalizeMoney={das.normalizeMoneyField}
            onDuplicateRow={das.duplicateRow}
            onRemoveRow={das.removeRow}
            onAnalyzeText={das.analyzeText}
            onApplyAnalysis={das.applyAnalysis}
            onPreviewDas={() => void previewDasPdf()}
            onDownloadDas={() => void downloadDasPdf()}
            notify={diagnostic.notify}
          />
        )}
      </WorkspaceAnchor>

      <PdfActionDock
        busy={busy}
        onPreview={() => void previewCompletePdf()}
        onDownload={() => void downloadCompletePdf()}
        generateLabel="Gerar PDF completo"
        previewLabel="Visualizar documento completo"
        ariaLabel="Ações do documento completo"
      />
      {diagnostic.notification ? <AppNotification {...diagnostic.notification} /> : null}
    </AppShell>
  );
}
