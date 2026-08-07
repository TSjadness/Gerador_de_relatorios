import { createGlobalStyle } from 'styled-components';
import { typography } from '../config/theme';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    min-height: 100%;
    scroll-behavior: smooth;
    background: ${({ theme }) => theme.colors.background};
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${typography.family.sans};
    font-weight: ${typography.weight.regular};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    transition: background-color 180ms ease, color 180ms ease;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  a {
    color: inherit;
  }

  #root {
    min-height: 100vh;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentText};
  }

  :focus-visible {
    outline: 3px solid color-mix(in srgb, ${({ theme }) => theme.colors.primary} 35%, transparent);
    outline-offset: 2px;
  }

  .text-primary {
    color: ${({ theme }) => theme.colors.text} !important;
  }

  .text-secondary {
    color: ${({ theme }) => theme.colors.textSoft} !important;
  }

  .text-muted {
    color: ${({ theme }) => theme.colors.textFaint} !important;
  }

  .text-blue {
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  .text-cyan {
    color: ${({ theme }) => theme.colors.cyan} !important;
  }

  .text-lime {
    color: ${({ theme }) => theme.colors.accent} !important;
  }

  .text-success {
    color: ${({ theme }) => theme.colors.success} !important;
  }

  .text-warning {
    color: ${({ theme }) => theme.colors.warning} !important;
  }

  .text-danger {
    color: ${({ theme }) => theme.colors.danger} !important;
  }

  .bg-primary {
    background: ${({ theme }) => theme.colors.primary} !important;
  }

  .bg-accent {
    background: ${({ theme }) => theme.colors.accent} !important;
  }

  .bg-surface {
    background: ${({ theme }) => theme.colors.surface} !important;
  }

  .p-component {
    font-family: ${typography.family.sans};
  }

  .p-inputtext,
  .p-inputtextarea,
  .p-dropdown,
  .p-multiselect,
  .p-calendar .p-inputtext {
    width: 100%;
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
    border-radius: 12px;
  }

  .p-inputtext:hover,
  .p-inputtextarea:hover,
  .p-dropdown:hover,
  .p-multiselect:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  .p-inputtext:enabled:focus,
  .p-inputtextarea:enabled:focus,
  .p-dropdown:not(.p-disabled).p-focus,
  .p-multiselect:not(.p-disabled).p-focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
  }

  .p-inputtext::placeholder,
  .p-inputtextarea::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  .p-button {
    border-radius: 12px;
    font-weight: ${typography.weight.bold};
  }

  .p-button:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 24%, transparent);
  }

  .p-tooltip .p-tooltip-text {
    background: ${({ theme }) => theme.colors.header};
    color: ${({ theme }) => theme.colors.textInverse};
    font-size: 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;
