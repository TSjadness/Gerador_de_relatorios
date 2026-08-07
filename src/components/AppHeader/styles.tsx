import { Button } from 'primereact/button';
import styled from 'styled-components';

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 70;
  color: ${({ theme }) => theme.colors.textInverse};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.header} 0%, ${({ theme }) => theme.colors.headerSoft} 100%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.headerBorder};
  box-shadow: 0 12px 30px color-mix(in srgb, ${({ theme }) => theme.colors.header} 24%, transparent);
`;

export const HeaderInner = styled.div`
  width: min(1540px, 100%);
  min-height: 76px;
  margin: 0 auto;
  padding: 14px clamp(18px, 3vw, 34px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px 24px;

  @media (max-width: 980px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const BrandLogo = styled.img`
  width: 48px;
  height: 48px;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
`;

export const BrandCopy = styled.div`
  min-width: 0;
  padding-left: 14px;
  border-left: 1px solid ${({ theme }) => theme.colors.translucentBorder};

  @media (max-width: 520px) {
    border-left: 0;
    padding-left: 0;
  }
`;

export const BrandTitle = styled.span`
  display: block;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const BrandSubtitle = styled.span`
  display: block;
  margin-top: 3px;
  color: ${({ theme }) => theme.colors.headerMuted};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }

  @media (max-width: 620px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

export const ModelSelect = styled.select`
  min-width: 230px;
  min-height: 42px;
  padding: 9px 38px 9px 13px;
  border: 1px solid ${({ theme }) => theme.colors.translucentBorder};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textInverse};
  background: ${({ theme }) => theme.colors.headerControl};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.cyan};
  }

  option {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: 620px) {
    width: 100%;
    min-width: 0;
  }
`;

export const ResetButton = styled(Button)`
  && {
    min-height: 42px;
    border: 1px solid ${({ theme }) => theme.colors.translucentBorder};
    background: transparent;
    color: ${({ theme }) => theme.colors.textInverse};
  }

  &&:hover {
    border-color: ${({ theme }) => theme.colors.translucentBorderStrong};
    background: ${({ theme }) => theme.colors.translucentSurface};
  }
`;
