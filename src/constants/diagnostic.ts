import type { DiagnosticStatus, PendingIssueDefinition, ReportTemplate, ServiceDefinition } from '../types/diagnostic';

export const STATUS_LABELS: Record<DiagnosticStatus, string> = {
  regular: 'Regular',
  atencao: 'Atenção',
  pendencias: 'Pendências',
  critico: 'Crítico'
};

export const PENDING_ISSUES: PendingIssueDefinition[] = [
  {
    id: 'das',
    label: 'DAS em atraso',
    description: 'Guias mensais pendentes de pagamento.',
    allowYears: true,
    serviceIds: ['regularizacao_das', 'parcelamento_mei', 'plano_gestao']
  },
  {
    id: 'dasn',
    label: 'DASN não entregue',
    description: 'Declaração anual ainda não transmitida.',
    allowYears: true,
    serviceIds: ['declaracao_anual', 'plano_gestao']
  },
  {
    id: 'multas',
    label: 'Multas em aberto',
    description: 'Multas vinculadas ao CNPJ que precisam de análise.',
    allowYears: true,
    serviceIds: ['regularizacao_das', 'parcelamento_mei']
  },
  {
    id: 'parcelamento',
    label: 'Necessidade de parcelamento',
    description: 'Débitos que podem exigir negociação ou parcelamento.',
    allowYears: true,
    serviceIds: ['parcelamento_mei', 'plano_gestao']
  },
  {
    id: 'divida_ativa',
    label: 'Dívida Ativa',
    description: 'Débitos inscritos em dívida ativa que exigem consulta e regularização.',
    allowYears: true,
    serviceIds: ['parcelamento_divida_ativa', 'plano_gestao']
  },
  {
    id: 'alteracao',
    label: 'Alteração cadastral pendente',
    description: 'Dados empresariais que precisam ser atualizados.',
    allowYears: false,
    serviceIds: ['alteracao_mei', 'plano_gestao']
  },
  {
    id: 'necessidade',
    label: 'Necessidade de apoio contábil',
    description: 'Orientação para procurar um contador de confiança.',
    allowYears: false,
    serviceIds: ['plano_gestao']
  },
  {
    id: 'outro',
    label: 'Outro',
    description: 'Outra situação identificada na consulta.',
    allowYears: false,
    serviceIds: ['plano_gestao']
  }
];

export const RECOMMENDATION_LIBRARY = [
  { id: 'regular', label: 'Situação Regular' },
  { id: 'das', label: 'DAS atrasada' },
  { id: 'dasn', label: 'DASN' },
  { id: 'multas', label: 'Multas' },
  { id: 'parcelamento', label: 'Parcelamento' },
  { id: 'divida_ativa', label: 'Dívida Ativa' },
  { id: 'alteracao', label: 'Alteração Cadastral' },
  { id: 'preventiva', label: 'Consulta preventiva' },
  { id: 'necessidade', label: 'Contador de confiança' }
] as const;

export const REPORT_TEMPLATES: Record<string, ReportTemplate> = {
  cliente_regular: {
    status: 'regular',
    pendingIssueIds: [],
    recommendationIds: ['regular'],
    specialistNotes: ''
  },
  das_atrasada: {
    status: 'pendencias',
    pendingIssueIds: ['das'],
    recommendationIds: ['das'],
    specialistNotes: ''
  },
  dasn_atrasada: {
    status: 'pendencias',
    pendingIssueIds: ['dasn'],
    recommendationIds: ['dasn'],
    specialistNotes: ''
  },
  varias_pendencias: {
    status: 'critico',
    pendingIssueIds: ['das', 'dasn', 'multas'],
    recommendationIds: ['das', 'dasn', 'multas', 'necessidade'],
    specialistNotes: 'Recomenda-se atenção prioritária devido à quantidade de pendências acumuladas.'
  },
  parcelamento: {
    status: 'atencao',
    pendingIssueIds: ['parcelamento'],
    recommendationIds: ['parcelamento'],
    specialistNotes: ''
  },
  alteracao_cadastral: {
    status: 'atencao',
    pendingIssueIds: ['alteracao'],
    recommendationIds: ['alteracao'],
    specialistNotes: ''
  },
  consulta_preventiva: {
    status: 'regular',
    pendingIssueIds: [],
    recommendationIds: ['preventiva'],
    specialistNotes: ''
  }
};

export const SERVICE_CATALOG: ServiceDefinition[] = [
  {
    id: 'abertura_mei',
    label: 'Abertura MEI',
    description: 'Assessoria para formalização e abertura do CNPJ MEI.',
    badge: 'Serviço'
  },
  {
    id: 'baixa_mei',
    label: 'Baixa do MEI',
    description: 'Apoio para encerramento regular das atividades do MEI.',
    badge: 'Serviço'
  },
  {
    id: 'alteracao_mei',
    label: 'Alteração do MEI',
    description: 'Atualização de atividades, endereço e outros dados cadastrais.',
    badge: 'Serviço'
  },
  {
    id: 'parcelamento_mei',
    label: 'Parcelamento do MEI',
    description: 'Organização e solicitação de parcelamento dos débitos do MEI.',
    badge: 'Serviço'
  },
  {
    id: 'parcelamento_divida_ativa',
    label: 'Parcelamento da Dívida Ativa',
    description: 'Apoio para consultar e negociar débitos já inscritos em Dívida Ativa.',
    badge: 'Serviço'
  },
  {
    id: 'regularizacao_das',
    label: 'Regularização do DAS',
    description: 'Regularização de guias mensais vencidas e competências pendentes.',
    badge: 'Serviço'
  },
  {
    id: 'plano_gestao',
    label: 'Plano Gestão — Intermediário',
    pdfLabel: 'Plano Gestão — Intermediário (Mais escolhido)',
    description: 'Acompanhamento intermediário das obrigações e da rotina do CNPJ.',
    badge: 'Mais escolhido',
    featured: true
  },
  {
    id: 'plano_essencial',
    label: 'Plano Essencial — Base',
    description: 'Cobertura básica para acompanhamento das principais obrigações.',
    badge: 'Plano'
  },
  {
    id: 'plano_crescer',
    label: 'Plano Crescer — Premium',
    description: 'Acompanhamento premium para quem deseja mais suporte e crescimento.',
    badge: 'Plano'
  },
  {
    id: 'declaracao_anual',
    label: 'Declaração Anual',
    description: 'Assessoria para elaboração e transmissão da DASN-SIMEI.',
    badge: 'Serviço'
  }
];

export const TEMPLATE_OPTIONS = [
  { value: '', label: 'Aplicar modelo…' },
  { value: 'cliente_regular', label: 'Cliente Regular' },
  { value: 'das_atrasada', label: 'DAS atrasada' },
  { value: 'dasn_atrasada', label: 'DASN atrasada' },
  { value: 'varias_pendencias', label: 'CNPJ com várias pendências' },
  { value: 'parcelamento', label: 'Parcelamento' },
  { value: 'alteracao_cadastral', label: 'Alteração Cadastral' },
  { value: 'consulta_preventiva', label: 'Consulta preventiva' }
];

export const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
];

export const PDF_LINKS = {
  specialist: 'https://wa.me/5547996929584?text=Ol%C3%A1%2C%20gostaria%20de%20dar%20continuidade%20Diagnostico%20MEI',
  plans: 'https://empreendamei.com.br/planos',
  terms: 'https://portaldomeibrasil.com.br/termos-de-uso/'
};

export const STORAGE_KEY = 'mei_diagnostic_reports_v1';
export const THEME_STORAGE_KEY = 'mei_diagnostic_theme';
export const MAX_HISTORY_ITEMS = 30;
export const MAX_CERTIFICATES = 8;
export const MAX_CERTIFICATE_SIZE_BYTES = 12 * 1024 * 1024;
export const MAX_CERTIFICATES_TOTAL_BYTES = 40 * 1024 * 1024;
