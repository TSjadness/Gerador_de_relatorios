import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { PDF_LINKS, STATUS_LABELS } from '../constants/diagnostic';
import { brandColors, lightColors, neutralColors, statusColors } from '../config/theme';
import type { CertificateItem, DiagnosticPdfData, DiagnosticStatus } from '../types/diagnostic';
import type { DasPdfData } from '../types/das';
import { calculateDasTotals, formatCurrency, groupDasRowsByYear, parseMoney } from '../domain/das';
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
  blueLight: hexToRgb(brandColors.blue100),
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
    doc.rect(0, 0, pageWidth, 25.5, 'F');
    doc.addImage(logoDataUrl, 'PNG', marginX, 1, 25, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.4);
    doc.setTextColor(...PDF_COLORS.white);
    doc.text('Diagnóstico Técnico de CNPJ', marginX + 25, 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(...PDF_COLORS.textFaint);
    doc.text('Análise e orientação para o Microempreendedor Individual', marginX + 25, 18.2);
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


function buildDasReportPdf(data: DasPdfData, logoDataUrl: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const footerTop = 274;
  const contentBottom = 268;
  const rows = data.rows;
  const totals = calculateDasTotals(rows);
  const yearGroups = groupDasRowsByYear(rows);
  let y = 0;

  const drawHeader = (continuation = false) => {
    doc.setFillColor(...PDF_COLORS.navy);
    doc.rect(0, 0, pageWidth, continuation ? 16 : 30, 'F');
    doc.addImage(logoDataUrl, 'PNG', marginX, continuation ? 3 : 1, continuation ? 9 : 25, continuation ? 9 : 25);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.white);
    doc.setFontSize(continuation ? 9.2 : 11.4);
    doc.text('Relatório de Pendências DAS', marginX + (continuation ? 13 : 25), continuation ? 9 : 12.5);
    if (!continuation) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(...PDF_COLORS.textFaint);
      doc.text('Competências organizadas por ano e resumo dos valores informados', marginX + 25, 18.2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(...PDF_COLORS.cyan);
      doc.text(`Data: ${formatDateBr(data.analysisDate)}`, pageWidth - marginX, 11.5, { align: 'right' });
      doc.setTextColor(...PDF_COLORS.white);
      doc.text(`Ref.: ${data.customer.cnpj || '-'}`, pageWidth - marginX, 18.1, { align: 'right' });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...PDF_COLORS.textFaint);
      doc.text(data.customer.cnpj || '-', pageWidth - marginX, 9, { align: 'right' });
    }
    y = continuation ? 24 : 42;
  };

  const drawFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFillColor(...PDF_COLORS.navy);
      doc.rect(0, footerTop, pageWidth, pageHeight - footerTop, 'F');
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
      doc.text(`Página ${page} de ${pageCount}`, pageWidth / 2, 293, { align: 'center' });
    }
  };

  const addPage = () => {
    doc.addPage('a4', 'portrait');
    drawHeader(true);
  };

  const checkBreak = (needed: number) => {
    if (y + needed > contentBottom) addPage();
  };

  const sectionTitle = (title: string) => {
    checkBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.6);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text(title, marginX, y);
    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, y + 2.6, pageWidth - marginX, y + 2.6);
    y += 9;
  };

  const writeWrappedText = (text: string, width = pageWidth - marginX * 2) => {
    const blocks = text.trim().split(/\n\s*\n/).filter(Boolean);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(...PDF_COLORS.text);
    blocks.forEach((block, blockIndex) => {
      const lines = doc.splitTextToSize(block.replace(/\n+/g, ' '), width) as string[];
      lines.forEach((line) => {
        checkBreak(6);
        doc.text(line, marginX, y);
        y += 4.9;
      });
      if (blockIndex < blocks.length - 1) y += 1.8;
    });
  };

  const drawSummaryCards = () => {
    const summaries = [
      ['Principal', formatCurrency(totals.principal)],
      ['Multas', formatCurrency(totals.fine)],
      ['Juros', formatCurrency(totals.interest)],
      ['Total geral', formatCurrency(totals.total)]
    ];
    const gap = 3.5;
    const width = (pageWidth - marginX * 2 - gap * 3) / 4;
    checkBreak(20);
    summaries.forEach(([label, value], index) => {
      const x = marginX + index * (width + gap);
      const featured = index === summaries.length - 1;
      doc.setFillColor(...PDF_COLORS.blueSoft);
      doc.setDrawColor(...(featured ? PDF_COLORS.blue : PDF_COLORS.border));
      doc.setLineWidth(featured ? 0.25 : 0.25);
      doc.roundedRect(x, y, width, 15, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...PDF_COLORS.textFaint);
      doc.text(label, x + 2.5, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.4);
      doc.setTextColor(...(featured ? PDF_COLORS.blue : PDF_COLORS.text));
      doc.text(value, x + width - 2.5, y + 10.7, { align: 'right', maxWidth: width - 5 });
    });
    y += 21;
  };

  const annualColumnWidths = [25, 31, 41, 41, 40];
  const annualHeaders = ['Ano', 'Competências', 'Principal', 'Encargos', 'Total'];
  const annualRowHeight = 8;

  const drawAnnualHeader = () => {
    let x = marginX;
    doc.setFillColor(...PDF_COLORS.navySoft);
    doc.rect(marginX, y, 178, annualRowHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...PDF_COLORS.white);
    annualHeaders.forEach((header, index) => {
      const align = index >= 2 ? 'right' : index === 1 ? 'center' : 'left';
      const offset = align === 'right' ? annualColumnWidths[index] - 2 : align === 'center' ? annualColumnWidths[index] / 2 : 2;
      doc.text(header, x + offset, y + 5.1, { align });
      x += annualColumnWidths[index];
    });
    y += annualRowHeight;
  };

  const drawAnnualRow = (group: (typeof yearGroups)[number], index: number) => {
    if (y + annualRowHeight > contentBottom) {
      addPage();
      drawAnnualHeader();
    }
    if (index % 2 === 1) {
      doc.setFillColor(...PDF_COLORS.blueSoft);
      doc.rect(marginX, y, 178, annualRowHeight, 'F');
    }
    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(marginX, y + annualRowHeight, pageWidth - marginX, y + annualRowHeight);
    const values = [
      group.year === null ? 'Sem ano' : String(group.year),
      String(group.recordCount),
      formatCurrency(group.totals.principal),
      formatCurrency(group.totals.fine + group.totals.interest),
      formatCurrency(group.totals.total)
    ];
    let x = marginX;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...PDF_COLORS.text);
    values.forEach((value, columnIndex) => {
      const align = columnIndex >= 2 ? 'right' : columnIndex === 1 ? 'center' : 'left';
      const cellWidth = annualColumnWidths[columnIndex];
      const offset = align === 'right' ? cellWidth - 2 : align === 'center' ? cellWidth / 2 : 2;
      doc.text(value, x + offset, y + 5.15, { align, maxWidth: cellWidth - 4 });
      x += cellWidth;
    });
    y += annualRowHeight;
  };

  const tableColumnWidths = [31, 28, 30, 29, 29, 31];
  const tableHeaders = ['Competência', 'Situação', 'Vencimento', 'Principal', 'Encargos', 'Total'];
  const rowHeight = 8;

  const drawGroupLabel = (label: string, total: number, count: number, continuation = false) => {
    checkBreak(15);
    doc.setFillColor(...PDF_COLORS.blueLight);
    doc.setDrawColor(...PDF_COLORS.cyan);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, y, 178, 11, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(...PDF_COLORS.text);
    doc.text(`${label}${continuation ? ' - continuação' : ''}`, marginX + 3, y + 6.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(...PDF_COLORS.textSoft);
    doc.text(`${count} ${count === 1 ? 'competência' : 'competências'}`, pageWidth - marginX - 46, y + 6.8, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...PDF_COLORS.blue);
    doc.text(formatCurrency(total), pageWidth - marginX - 3, y + 6.8, { align: 'right' });
    y += 14;
  };

  const drawTableHeader = () => {
    let x = marginX;
    doc.setFillColor(...PDF_COLORS.navySoft);
    doc.rect(marginX, y, 178, rowHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.1);
    doc.setTextColor(...PDF_COLORS.white);
    tableHeaders.forEach((header, index) => {
      const align = index >= 3 ? 'right' : index === 2 ? 'center' : 'left';
      const cellWidth = tableColumnWidths[index];
      const offset = align === 'right' ? cellWidth - 2 : align === 'center' ? cellWidth / 2 : 2;
      doc.text(header, x + offset, y + 5.1, { align, maxWidth: cellWidth - 4 });
      x += cellWidth;
    });
    y += rowHeight;
  };

  const drawTableRow = (group: (typeof yearGroups)[number], row: (typeof rows)[number], index: number) => {
    if (y + rowHeight > contentBottom) {
      addPage();
      drawGroupLabel(group.year === null ? 'DAS sem ano informado' : `DAS - ${group.year}`, group.totals.total, group.recordCount, true);
      drawTableHeader();
    }
    if (index % 2 === 1) {
      doc.setFillColor(...PDF_COLORS.blueSoft);
      doc.rect(marginX, y, 178, rowHeight, 'F');
    }
    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.2);
    doc.line(marginX, y + rowHeight, pageWidth - marginX, y + rowHeight);
    const values = [
      row.period || '-',
      row.situation || '-',
      row.dueDate || '-',
      row.principal ? formatCurrency(parseMoney(row.principal)) : '-',
      (row.fine || row.interest) ? formatCurrency(parseMoney(row.fine) + parseMoney(row.interest)) : '-',
      row.total ? formatCurrency(parseMoney(row.total)) : '-'
    ];
    let x = marginX;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...PDF_COLORS.text);
    values.forEach((value, columnIndex) => {
      const align = columnIndex >= 3 ? 'right' : columnIndex === 2 ? 'center' : 'left';
      const cellWidth = tableColumnWidths[columnIndex];
      const offset = align === 'right' ? cellWidth - 2 : align === 'center' ? cellWidth / 2 : 2;
      doc.text(value, x + offset, y + 5.15, { align, maxWidth: cellWidth - 4 });
      x += cellWidth;
    });
    y += rowHeight;
  };

  const drawYearTotals = (group: (typeof yearGroups)[number]) => {
    if (y + 24 > contentBottom) {
      addPage();
      drawGroupLabel(group.year === null ? 'DAS sem ano informado' : `DAS - ${group.year}`, group.totals.total, group.recordCount, true);
    }
    const gap = 3;
    const width = (178 - gap * 3) / 4;
    const items = [
      ['Principal', group.totals.principal],
      ['Multa', group.totals.fine],
      ['Juros', group.totals.interest],
      [group.year === null ? 'Total' : `Total ${group.year}`, group.totals.total]
    ] as const;
    y += 3;
    items.forEach(([label, value], index) => {
      const x = marginX + index * (width + gap);
      const featured = index === items.length - 1;
      doc.setFillColor(...PDF_COLORS.blueSoft);
      doc.setDrawColor(...(featured ? PDF_COLORS.blue : PDF_COLORS.border));
      doc.setLineWidth(featured ? 0.4 : 0.2);
      doc.roundedRect(x, y, width, 13, 1.8, 1.8, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...PDF_COLORS.textFaint);
      doc.text(label, x + 2.3, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(...(featured ? PDF_COLORS.blue : PDF_COLORS.text));
      doc.text(formatCurrency(value), x + width - 2.3, y + 9.6, { align: 'right', maxWidth: width - 4.6 });
    });
    y += 19;
  };

  drawHeader(false);

  sectionTitle('Identificação');
  const drawInfoLine = (label: string, value: string, maxWidth = 145) => {
    checkBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.7);
    doc.setTextColor(...PDF_COLORS.textSoft);
    doc.text(`${label}:`, marginX, y);
    doc.setTextColor(...PDF_COLORS.text);
    const labelWidth = Math.max(22, doc.getTextWidth(`${label}:`) + 5);
    const valueLines = doc.splitTextToSize(value || '-', maxWidth) as string[];
    doc.text(valueLines, marginX + labelWidth, y);
    y += Math.max(6.2, valueLines.length * 4.8);
  };
  drawInfoLine('Cliente', data.customer.name, 145);
  drawInfoLine('CNPJ', data.customer.cnpj, 145);
  drawInfoLine('Origem', data.source, 145);
  y += 10;

  sectionTitle('Resumo financeiro geral');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...PDF_COLORS.textSoft);
  doc.text(`${rows.length} ${rows.length === 1 ? 'competência registrada' : 'competências registradas'} em ${yearGroups.filter((group) => group.year !== null).length} ${yearGroups.filter((group) => group.year !== null).length === 1 ? 'ano' : 'anos'}.`, marginX, y);
  y += 5;
  drawSummaryCards();

  if (yearGroups.length) {
    y += 8;
    sectionTitle('Resumo por ano');
    drawAnnualHeader();
    yearGroups.forEach(drawAnnualRow);
    y += 12;

    sectionTitle('Detalhamento das competências');
    yearGroups.forEach((group) => {
      checkBreak(34);
      drawGroupLabel(group.year === null ? 'DAS sem ano informado' : `DAS - ${group.year}`, group.totals.total, group.recordCount);
      drawTableHeader();
      group.rows.forEach((row, index) => drawTableRow(group, row, index));
      drawYearTotals(group);
      y += 12;
    });
  }

  if (data.orientation.trim()) {
    y += 2;
    sectionTitle('Orientação ao Cliente');
    writeWrappedText(data.orientation);
    y += 4;
  }

  if (data.notes.trim()) {
    sectionTitle('Observações');
    writeWrappedText(data.notes);
  }

  drawFooter();
  const filename = `Pendencias_DAS_${sanitizeFilename(data.customer.name || 'Cliente')}_${data.analysisDate}.pdf`;
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


export async function buildDasPdf(
  data: DasPdfData,
  logoUrl: string
): Promise<{ blob: Blob; filename: string }> {
  const logoDataUrl = await imageUrlToDataUrl(logoUrl);
  const report = buildDasReportPdf(data, logoDataUrl);
  return { blob: new Blob([report.arrayBuffer], { type: 'application/pdf' }), filename: report.filename };
}

async function appendPdfBuffer(target: PDFDocument, sourceBuffer: ArrayBuffer): Promise<void> {
  const source = await PDFDocument.load(sourceBuffer);
  const pages = await target.copyPages(source, source.getPageIndices());
  pages.forEach((page) => target.addPage(page));
}

export async function buildCombinedPdf(
  diagnosticData: DiagnosticPdfData,
  certificates: CertificateItem[],
  logoUrl: string,
  dasData?: DasPdfData
): Promise<{ blob: Blob; filename: string }> {
  const logoDataUrl = await imageUrlToDataUrl(logoUrl);
  const diagnosticReport = buildReportPdf(diagnosticData, logoDataUrl);
  const combined = await PDFDocument.create();
  await appendPdfBuffer(combined, diagnosticReport.arrayBuffer);

  if (dasData?.rows.length) {
    const dasReport = buildDasReportPdf(dasData, logoDataUrl);
    await appendPdfBuffer(combined, dasReport.arrayBuffer);
  }

  for (const certificate of certificates) {
    const bytes = await certificate.file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const pages = await combined.copyPages(source, source.getPageIndices());
    pages.forEach((page) => combined.addPage(page));
  }

  const finalBytes = await combined.save();
  const outputBuffer = finalBytes.buffer.slice(
    finalBytes.byteOffset,
    finalBytes.byteOffset + finalBytes.byteLength
  ) as ArrayBuffer;
  const filename = `Diagnostico_Completo_${sanitizeFilename(diagnosticData.customer.name || 'Cliente')}_${diagnosticData.customer.consultationDate}.pdf`;
  return { blob: new Blob([outputBuffer], { type: 'application/pdf' }), filename };
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
