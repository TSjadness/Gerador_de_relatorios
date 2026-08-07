import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { PDF_LINKS, STATUS_LABELS } from '../constants/diagnostic';
import { brandColors, lightColors, neutralColors, statusColors } from '../config/theme';
import type { CertificateItem, DiagnosticPdfData, DiagnosticStatus } from '../types/diagnostic';
import { imageUrlToDataUrl } from '../utils/assets';
import { formatDateBr } from '../utils/date';
import { sanitizeFilename } from '../utils/format';

type Rgb = [number, number, number];

function hexToRgb(value: string): Rgb {
  const hex = value.replace('#', '');
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16)
  ];
}

const PDF_COLORS = {
  navy: hexToRgb(brandColors.navy900),
  navySoft: hexToRgb(brandColors.navy800),
  blue: hexToRgb(brandColors.blue600),
  blueSoft: hexToRgb(brandColors.blue100),
  cyan: hexToRgb(brandColors.cyan500),
  cyanSoft: hexToRgb(lightColors.cyanSoft),
  lime: hexToRgb(brandColors.lime500),
  white: hexToRgb(brandColors.white),
  text: hexToRgb(brandColors.navy900),
  textSoft: hexToRgb(neutralColors.gray600),
  textFaint: hexToRgb(neutralColors.gray500),
  border: hexToRgb(neutralColors.gray200)
};

const STATUS_COLORS: Record<DiagnosticStatus, Rgb> = {
  regular: hexToRgb(statusColors.success),
  atencao: hexToRgb(statusColors.warning),
  pendencias: hexToRgb(statusColors.danger),
  critico: hexToRgb(statusColors.danger)
};

const STATUS_CARD_COLORS: Record<DiagnosticStatus, { background: Rgb; border: Rgb; text: Rgb }> = {
  regular: { background: hexToRgb(statusColors.successSoft), border: hexToRgb(statusColors.success), text: hexToRgb(statusColors.success) },
  atencao: { background: hexToRgb(statusColors.warningSoft), border: hexToRgb(statusColors.warning), text: hexToRgb(statusColors.warning) },
  pendencias: { background: hexToRgb(statusColors.dangerSoft), border: hexToRgb(statusColors.danger), text: hexToRgb(statusColors.danger) },
  critico: { background: hexToRgb(statusColors.dangerSoft), border: hexToRgb(statusColors.danger), text: hexToRgb(statusColors.danger) }
};

function buildReportPdf(data: DiagnosticPdfData, logoDataUrl: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const marginX = 16;
  const contentBottom = 270;
  let y = 0;

  const drawInitialHeader = () => {
    doc.setFillColor(...PDF_COLORS.navy);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.addImage(logoDataUrl, 'PNG', marginX, 5.5, 15, 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.4);
    doc.setTextColor(...PDF_COLORS.white);
    doc.text('Diagnóstico Técnico de CNPJ', marginX + 20, 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(...PDF_COLORS.textFaint);
    doc.text('Análise e orientação para o Microempreendedor Individual', marginX + 20, 18.2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(...PDF_COLORS.cyan);
    doc.text(`Data: ${formatDateBr(data.customer.consultationDate)}`, pageWidth - marginX, 11.5, { align: 'right' });
    doc.setTextColor(...PDF_COLORS.white);
    doc.text(`Ref.: ${data.customer.cnpj || '-'}`, pageWidth - marginX, 18.1, { align: 'right' });
    y = 42;
  };

  const drawContinuationHeader = () => {
    doc.setFillColor(...PDF_COLORS.navy);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.addImage(logoDataUrl, 'PNG', marginX, 3, 9, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(...PDF_COLORS.white);
    doc.text('Diagnóstico Técnico de CNPJ', marginX + 13, 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.textFaint);
    doc.text(data.customer.cnpj, pageWidth - marginX, 9, { align: 'right' });
    y = 24;
  };

  const addPage = () => {
    doc.addPage();
    drawContinuationHeader();
  };

  const checkBreak = (needed: number) => {
    if (y + needed > contentBottom) addPage();
  };

  const sectionTitle = (title: string) => {
    checkBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.8);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text(title, marginX, y);
    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, y + 2.6, pageWidth - marginX, y + 2.6);
    y += 9;
  };

  const writeParagraphs = (text: string) => {
    const paragraphs = text.trim().split(/\n\s*\n/).filter(Boolean);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.7);
    doc.setTextColor(...PDF_COLORS.text);
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const lines = doc.splitTextToSize(paragraph.replace(/\n+/g, ' '), pageWidth - marginX * 2) as string[];
      lines.forEach((line) => {
        checkBreak(6.4);
        doc.text(line, marginX, y);
        y += 5.1;
      });
      if (paragraphIndex < paragraphs.length - 1) y += 2.2;
    });
  };

  const writePendingCards = (labels: string[]) => {
    const columns = 3;
    const gap = 4;
    const usableWidth = pageWidth - marginX * 2;
    const cardWidth = (usableWidth - gap * (columns - 1)) / columns;
    const palette = STATUS_CARD_COLORS[data.status];

    for (let index = 0; index < labels.length; index += columns) {
      const row = labels.slice(index, index + columns);
      const cards = row.map((label) => {
        const lines = doc.splitTextToSize(label, cardWidth - 12) as string[];
        return { lines, height: Math.max(17, 8 + lines.length * 4.6) };
      });
      const rowHeight = Math.max(...cards.map((card) => card.height));
      checkBreak(rowHeight + 5);
      cards.forEach((card, columnIndex) => {
        const x = marginX + columnIndex * (cardWidth + gap);
        doc.setFillColor(...palette.background);
        doc.setDrawColor(...palette.border);
        doc.setLineWidth(0.35);
        doc.roundedRect(x, y, cardWidth, rowHeight, 2.3, 2.3, 'FD');
        doc.setFillColor(...palette.border);
        doc.circle(x + 5, y + 6.2, 1.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.4);
        doc.setTextColor(...palette.text);
        doc.text(card.lines, x + 9, y + 7.3);
      });
      y += rowHeight + 5;
    }
  };

  const writeServiceChips = (services: string[]) => {
    const usableWidth = pageWidth - marginX * 2;
    const chipHeight = 8.5;
    const gapX = 3;
    const gapY = 3;
    let x = marginX;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);

    services.forEach((service) => {
      const width = Math.min(usableWidth, Math.max(27, doc.getTextWidth(service) + 10));
      if (x + width > pageWidth - marginX) {
        y += chipHeight + gapY;
        checkBreak(chipHeight + gapY);
        x = marginX;
      }
      doc.setFillColor(...PDF_COLORS.blueSoft);
      doc.setDrawColor(...PDF_COLORS.cyan);
      doc.roundedRect(x, y, width, chipHeight, 4.2, 4.2, 'FD');
      doc.setTextColor(...PDF_COLORS.blue);
      doc.text(service, x + width / 2, y + 5.5, { align: 'center' });
      x += width + gapX;
    });
    y += chipHeight + 5;
  };

  const drawLinkButton = (x: number, top: number, width: number, label: string, url: string, accent: boolean) => {
    doc.setFillColor(...(accent ? PDF_COLORS.lime : PDF_COLORS.navy));
    doc.roundedRect(x, top, width, 10, 2.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(...(accent ? PDF_COLORS.navy : PDF_COLORS.white));
    doc.text(label, x + width / 2, top + 6.4, { align: 'center' });
    doc.link(x, top, width, 10, { url });
  };

  drawInitialHeader();
  sectionTitle('Dados do Cliente');
  doc.setFontSize(9.8);
  const customerRows = [
    ['Nome', data.customer.name],
    ['CNPJ', data.customer.cnpj],
    ['Razão Social', data.customer.companyName]
  ];
  customerRows.forEach(([label, value]) => {
    if (!value) return;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.textSoft);
    doc.text(`${label}:`, marginX, y);
    doc.setTextColor(...PDF_COLORS.text);
    const lines = doc.splitTextToSize(value, pageWidth - marginX * 2 - 34) as string[];
    doc.text(lines, marginX + 34, y);
    y += Math.max(6.2, lines.length * 5.2);
  });

  y += 4;
  const statusColor = STATUS_COLORS[data.status];
  doc.setFillColor(...statusColor);
  doc.roundedRect(marginX, y - 5.5, 52, 8.5, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_COLORS.white);
  doc.text(`Situação: ${STATUS_LABELS[data.status]}`, marginX + 4, y);
  y += 13;

  if (data.currentStatusLines.length) {
    sectionTitle('Situação Atual');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.6);
    doc.setTextColor(...PDF_COLORS.text);
    data.currentStatusLines.forEach((line) => {
      const lines = doc.splitTextToSize(line, pageWidth - marginX * 2) as string[];
      lines.forEach((textLine) => {
        checkBreak(6.3);
        doc.text(textLine, marginX, y);
        y += 5.2;
      });
      y += 1.8;
    });
    y += 1;
  }

  sectionTitle('Pendências Identificadas');
  if (!data.pendingLabels.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.7);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text('Nenhuma pendência identificada no momento da consulta.', marginX, y);
    y += 10;
  } else {
    writePendingCards(data.pendingLabels);
  }

  if (data.recommendations) {
    y += 2;
    sectionTitle('Recomendações');
    writeParagraphs(data.recommendations);
    y += 3;
  }

  if (data.specialistNotes) {
    sectionTitle('Observações do Especialista');
    writeParagraphs(data.specialistNotes);
    y += 3;
  }

  if (data.serviceLabels.length) {
    sectionTitle('Serviços recomendados');
    writeServiceChips(data.serviceLabels);
  }

  checkBreak(48);
  y += 3;
  doc.setDrawColor(...PDF_COLORS.border);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.blue);
  doc.text('Próximos passos sugeridos', marginX, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.3);
  doc.setTextColor(...PDF_COLORS.textSoft);
  const nextSteps = doc.splitTextToSize('Caso deseje, nossa equipe pode auxiliar na regularização das pendências identificadas, no acompanhamento das obrigações do MEI e na gestão do seu CNPJ.', pageWidth - marginX * 2) as string[];
  nextSteps.forEach((line) => {
    checkBreak(6.5);
    doc.text(line, marginX, y);
    y += 5;
  });
  y += 4;
  checkBreak(14);
  const gap = 5;
  const buttonWidth = (pageWidth - marginX * 2 - gap) / 2;
  drawLinkButton(marginX, y, buttonWidth, 'Falar com o especialista', PDF_LINKS.specialist, true);
  drawLinkButton(marginX + buttonWidth + gap, y, buttonWidth, 'Conhecer Planos', PDF_LINKS.plans, false);

  const reportPageCount = doc.internal.getNumberOfPages();
  for (let page = 1; page <= reportPageCount; page += 1) {
    doc.setPage(page);
    doc.setFillColor(...PDF_COLORS.navy);
    doc.rect(0, 274, pageWidth, 23, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.textFaint);
    doc.text('Portal do MEI Brasil é uma plataforma privada de assessoria, sem vínculo com órgãos governamentais. CNPJ 48.716.520/0001-21', pageWidth / 2, 280.6, { align: 'center' });
    doc.setFillColor(...PDF_COLORS.navySoft);
    doc.roundedRect((pageWidth - 27) / 2, 283.4, 27, 5.6, 2.4, 2.4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.1);
    doc.setTextColor(...PDF_COLORS.cyan);
    doc.text('Termos de Uso', pageWidth / 2, 287.2, { align: 'center' });
    doc.link((pageWidth - 27) / 2, 283.4, 27, 5.6, { url: PDF_LINKS.terms });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...PDF_COLORS.textFaint);
    doc.text(`Página ${page} de ${reportPageCount}`, pageWidth / 2, 293, { align: 'center' });
  }

  const filename = `Diagnostico_${sanitizeFilename(data.customer.name)}_${data.customer.consultationDate}.pdf`;
  return { arrayBuffer: doc.output('arraybuffer'), filename };
}

export async function buildFinalPdf(
  data: DiagnosticPdfData,
  certificates: CertificateItem[],
  logoUrl: string
): Promise<{ blob: Blob; filename: string }> {
  const logoDataUrl = await imageUrlToDataUrl(logoUrl);
  const report = buildReportPdf(data, logoDataUrl);
  if (!certificates.length) {
    return { blob: new Blob([report.arrayBuffer], { type: 'application/pdf' }), filename: report.filename };
  }

  const finalDocument = await PDFDocument.load(report.arrayBuffer);
  for (const certificate of certificates) {
    const bytes = await certificate.file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const pages = await finalDocument.copyPages(source, source.getPageIndices());
    pages.forEach((page) => finalDocument.addPage(page));
  }
  const finalBytes = await finalDocument.save();
  const outputBuffer = finalBytes.buffer.slice(
    finalBytes.byteOffset,
    finalBytes.byteOffset + finalBytes.byteLength
  ) as ArrayBuffer;
  return { blob: new Blob([outputBuffer], { type: 'application/pdf' }), filename: report.filename };
}

export function downloadPdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
