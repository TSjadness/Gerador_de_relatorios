import { Button } from 'primereact/button';
import styled from 'styled-components';

export const Dock = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  padding: 12px 0 max(12px, env(safe-area-inset-bottom));
  background: linear-gradient(to top, ${({ theme }) => theme.colors.background} 72%, transparent);
  pointer-events: none;
`;

export const DockInner = styled.div`
  width: min(1540px, 100%);
  margin: 0 auto;
  padding: 0 clamp(18px, 2.6vw, 34px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
  gap: clamp(18px, 2vw, 28px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 680px) {
    padding-inline: 14px;
  }
`;

export const Buttons = styled.div`
  grid-column: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  pointer-events: auto;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const GenerateButton = styled(Button)`
  && {
    min-height: 54px;
    border: 1px solid ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentText};
    /* box-shadow: 7px 7px 0 color-mix(in srgb, ${({ theme }) => theme.colors.cyan} 78%, transparent); */
    font-size: 14px;
    font-weight: 800;
  }

  &&:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    border-color: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

export const PreviewButton = styled(Button)`
  && {
    min-height: 54px;
    border: 1px solid ${({ theme }) => theme.colors.headerPreview};
    background: ${({ theme }) => theme.colors.headerPreview};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: 0 10px 28px color-mix(in srgb, ${({ theme }) => theme.colors.header} 22%, transparent);
    font-size: 14px;
  }

  &&:hover {
    background: ${({ theme }) => theme.colors.headerPreview};
    border-color: ${({ theme }) => theme.colors.headerPreview};
    transform: translateY(-1px);
  }
`;
