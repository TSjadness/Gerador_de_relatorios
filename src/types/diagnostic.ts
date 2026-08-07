export type DiagnosticStatus = 'regular' | 'atencao' | 'pendencias' | 'critico';

export type PeriodType = 'none' | 'date' | 'month' | 'year';

export type CurrentStatusGroup = {
  status: string;
  periodType: PeriodType;
  date: string;
  month: string;
  year: string;
};

export type CurrentCnpjStatus = {
  simples: CurrentStatusGroup;
  simei: CurrentStatusGroup;
};

export type PendingIssueDefinition = {
  id: string;
  label: string;
  description: string;
  allowYears: boolean;
  serviceIds: string[];
};

export type CustomPendingIssue = {
  id: string;
  label: string;
};

export type ServiceDefinition = {
  id: string;
  label: string;
  pdfLabel?: string;
  description: string;
  badge: string;
  featured?: boolean;
};

export type ReportTemplate = {
  status: DiagnosticStatus;
  pendingIssueIds: string[];
  recommendationIds: string[];
  specialistNotes: string;
};

export type CertificateItem = {
  id: string;
  file: File;
};

export type CustomerForm = {
  name: string;
  cnpj: string;
  companyName: string;
  consultationDate: string;
};

export type DiagnosticState = {
  status: DiagnosticStatus;
  currentStatus: CurrentCnpjStatus;
  pendingIssueIds: string[];
  customPendingIssues: CustomPendingIssue[];
  pendingYears: Record<string, number[]>;
  dasCompetencies: string[];
  activeRecommendationIds: string[];
  recommendationSnapshots: Record<string, string>;
  selectedServiceIds: string[];
  certificates: CertificateItem[];
  recommendations: string;
  specialistNotes: string;
};

export type DiagnosticPdfData = {
  customer: CustomerForm;
  status: DiagnosticStatus;
  currentStatusLines: string[];
  pendingLabels: string[];
  serviceLabels: string[];
  recommendations: string;
  specialistNotes: string;
};

export type ReportHistoryEntry = {
  id: string;
  schemaVersion: 1;
  createdAt: string;
  customer: CustomerForm;
  status: DiagnosticStatus;
  currentStatus: CurrentCnpjStatus;
  pendingIssueIds: string[];
  customPendingIssues: CustomPendingIssue[];
  pendingYears: Record<string, number[]>;
  dasCompetencies: string[];
  activeRecommendationIds: string[];
  selectedServiceIds: string[];
  recommendations: string;
  specialistNotes: string;
};

export type NotificationTone = 'success' | 'info' | 'warning' | 'error';
