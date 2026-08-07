import { useState } from 'react';
import { brandColors } from '../../config/theme';
import logo from '../../assets/images/logo.png';
import { AppHeader } from '../../components/AppHeader';
import { AppNotification } from '../../components/AppNotification';
import { CertificatesSection } from '../../components/CertificatesSection';
import { CurrentStatusSection } from '../../components/CurrentStatusSection';
import { CustomerDataSection } from '../../components/CustomerDataSection';
import { PdfActionDock } from '../../components/PdfActionDock';
import { PendingIssuesSection } from '../../components/PendingIssuesSection';
import { RecommendationSection } from '../../components/RecommendationSection';
import { ReportHistory } from '../../components/ReportHistory';
import { ServicesSection } from '../../components/ServicesSection';
import { SpecialistNotesSection } from '../../components/SpecialistNotesSection';
import { StatusSelector } from '../../components/StatusSelector';
import { useDiagnostic } from '../../hooks/useDiagnostic';
import { buildFinalPdf, downloadPdfBlob } from '../../pdf';
import { AppShell, MainColumn, MainLayout, Sidebar, SkipLink } from './styles';

type BusyAction = 'preview' | 'download' | null;

export function DiagnosticPage() {
  const diagnostic = useDiagnostic();
  const [busy, setBusy] = useState<BusyAction>(null);

  const previewPdf = async () => {
    if (!diagnostic.validate()) return;
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      diagnostic.notify('O navegador bloqueou a nova aba. Permita pop-ups para visualizar o PDF.', 'warning');
      return;
    }
    try {
      previewWindow.opener = null;
      previewWindow.document.title = 'Preparando PDF…';
      previewWindow.document.body.innerHTML = `<p style="font-family:Inter,Arial,sans-serif;padding:24px;color:${brandColors.navy900};">Preparando visualização do PDF…</p>`;
    } catch {
      previewWindow.focus();
    }

    setBusy('preview');
    try {
      const result = await buildFinalPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo);
      const url = URL.createObjectURL(result.blob);
      previewWindow.location.replace(url);
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      diagnostic.notify(diagnostic.state.certificates.length ? 'PDF com certificado(s) aberto em uma nova aba.' : 'PDF aberto em uma nova aba para visualização.', 'success');
    } catch {
      previewWindow.close();
      diagnostic.notify('Não foi possível visualizar o PDF. Revise os anexos e tente novamente.', 'error');
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    if (!diagnostic.validate()) return;
    setBusy('download');
    try {
      const result = await buildFinalPdf(diagnostic.getPdfData(), diagnostic.state.certificates, logo);
      downloadPdfBlob(result.blob, result.filename);
      diagnostic.saveGeneratedReport();
      diagnostic.notify(diagnostic.state.certificates.length ? 'PDF gerado com certificado(s) e baixado com sucesso.' : 'PDF gerado e baixado com sucesso.', 'success');
    } catch {
      diagnostic.notify('Não foi possível gerar o PDF. Revise os anexos e tente novamente.', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <AppShell>
      <SkipLink href="#diagnostic-content">Pular para o conteúdo principal</SkipLink>
      <AppHeader onApplyTemplate={diagnostic.applyTemplate} onReset={() => void diagnostic.resetReport(true)} />

      <MainLayout id="diagnostic-content">
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

      <PdfActionDock busy={busy} onPreview={() => void previewPdf()} onDownload={() => void downloadPdf()} />
      {diagnostic.notification ? <AppNotification {...diagnostic.notification} /> : null}
    </AppShell>
  );
}
