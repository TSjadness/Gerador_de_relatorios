# Gerador de Diagnóstico MEI

Reestruturação do Gerador de Diagnóstico MEI em React, TypeScript, PrimeReact e styled-components, preservando o fluxo operacional do sistema original e separando interface, regras de negócio, armazenamento, configuração visual e geração de PDF.

## Stack

- React 19.2.8
- TypeScript 6.0.3
- Vite 8.1.5
- PrimeReact 10.9.8
- PrimeIcons 8.0.0
- styled-components 6.4.4
- jsPDF 4.2.1
- pdf-lib 1.17.1
- Inter via Google Fonts

O projeto utiliza a linha `v10-stable` do PrimeReact e o tema base `lara-light-blue`, com personalização visual centralizada pelo styled-components.

## Requisitos

- Node.js 22.12 ou superior
- npm compatível com a versão instalada do Node.js

## Instalação

```bash
npm install
npm run dev
```

A aplicação ficará disponível por padrão em `http://localhost:5173`.

## Validação e produção

```bash
npm run typecheck
npm run build
npm run preview
```

Para executar a validação de tipos e a build em sequência:

```bash
npm run check
```

## Estrutura

```text
src/
  assets/
    images/
  components/
    AppHeader/
      index.tsx
      styles.tsx
    AppNotification/
      index.tsx
      styles.tsx
    CertificatesSection/
      index.tsx
      styles.tsx
    CurrentStatusSection/
      index.tsx
      styles.tsx
    CustomerDataSection/
      index.tsx
      styles.tsx
    FormField/
      index.tsx
      styles.tsx
    PdfActionDock/
      index.tsx
      styles.tsx
    PendingIssueCard/
      index.tsx
      styles.tsx
    PendingIssuesSection/
      index.tsx
      styles.tsx
    RecommendationSection/
      index.tsx
      styles.tsx
    ReportHistory/
      index.tsx
      styles.tsx
    SectionCard/
      index.tsx
      styles.tsx
    ServicesSection/
      index.tsx
      styles.tsx
    SpecialistNotesSection/
      index.tsx
      styles.tsx
    StatusSelector/
      index.tsx
      styles.tsx
    ThemeToggle/
      index.tsx
      styles.tsx
  config/
    theme/
      colors.ts
      typography.ts
      index.ts
  constants/
  contexts/
  domain/
  hooks/
  pages/
  pdf/
  storage/
  themes/
  types/
  utils/
```

Todos os componentes visuais são isolados em pastas próprias com `index.tsx` e `styles.tsx`.

## Identidade visual

A paleta segue a identidade visual definida para o Portal do MEI Brasil:

- Navy principal: `#0F1633`
- Azul principal: `#0064C7`
- Ciano: `#24BFEA`
- Verde-limão de destaque: `#D7FF00`
- Branco: `#FFFFFF`

As cores não ficam espalhadas pelos componentes. A fonte de verdade está em:

```text
src/config/theme/colors.ts
```

Os temas claro e escuro consomem esses tokens em `src/themes/index.ts`.

Também existem classes utilitárias globais como:

```text
.text-primary
.text-secondary
.text-muted
.text-blue
.text-cyan
.text-lime
.text-success
.text-warning
.text-danger
.bg-primary
.bg-accent
.bg-surface
```

Alterar o token correspondente no arquivo de configuração atualiza os componentes que utilizam aquele valor.

## Tipografia

A interface utiliza Inter nos pesos 400, 500, 600, 700 e 800. A família padrão e os pesos estão centralizados em:

```text
src/config/theme/typography.ts
```

## CNPJ numérico e alfanumérico

A aplicação aceita simultaneamente:

```text
48.716.520/0001-21
12.ABC.345/01DE-35
```

O CNPJ continua com 14 posições. As 12 primeiras aceitam letras maiúsculas e números e os dois dígitos verificadores permanecem numéricos. A rotina mantém compatibilidade com CNPJs exclusivamente numéricos e utiliza o cálculo de dígito verificador pelo módulo 11 com conversão ASCII - 48 para caracteres alfanuméricos.

A implementação fica centralizada em:

```text
src/utils/cnpj.ts
```

## Funcionalidades preservadas e modernizadas

- Classificação do CNPJ em Regular, Atenção, Pendências ou Crítico
- Controle de seleção de situação padronizado em azul
- Consistência automática entre situação e pendências
- Dados do cliente e razão social automática editável
- Validação de CNPJ numérico e alfanumérico
- Situação no Simples Nacional e SIMEI
- Pendências padrão e personalizadas
- Períodos anuais e competências específicas para DAS
- Biblioteca de recomendações dinâmicas
- Recomendação visual de serviços baseada nas pendências
- Seleção manual dos serviços que irão para o diagnóstico
- Upload e validação de certificados PDF
- Numeração visual dos certificados conforme a ordem de anexação
- Renumeração automática após remoção de certificado
- Limites de segurança para anexos
- Geração e visualização do PDF
- União do diagnóstico com certificados PDF na ordem exibida na interface
- Histórico local versionado com limite de 30 relatórios
- Duplicação de relatórios sem persistir certificados
- Tema claro e tema escuro com persistência da preferência
- Layout responsivo
- Fonte Inter
- Paleta navy, azul, ciano e verde-limão centralizada
- Identidade visual baseada na logo fornecida para o projeto

## Limites de certificados

- Até 8 certificados por relatório
- Até 12 MB por arquivo
- Até 40 MB acumulados
- PDFs inválidos, corrompidos ou protegidos por senha são rejeitados antes da geração final

## Persistência

O histórico utiliza `localStorage` e possui `schemaVersion: 1`. Certificados não são salvos no histórico e precisam ser anexados novamente ao duplicar um relatório.

A camada de armazenamento está isolada para permitir substituição futura por API e banco de dados sem acoplar essa alteração aos componentes da interface.

## Temas

O botão no cabeçalho alterna entre Light e Dark. A preferência é persistida no navegador. Os componentes styled-components e as personalizações globais do PrimeReact consomem os mesmos tokens semânticos de tema.
