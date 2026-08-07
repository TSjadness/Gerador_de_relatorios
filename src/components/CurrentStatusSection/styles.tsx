import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceSoft};
`;

export const PanelTitle = styled.h3`
  margin: 0 0 1px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 800;
`;

export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 10px 36px 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 16%, transparent);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Preview = styled.div<{ $filled: boolean }>`
  margin-top: auto;
  padding: 10px 12px;
  border: 1px solid ${({ theme, $filled }) => $filled ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background: ${({ theme, $filled }) => $filled ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme, $filled }) => $filled ? theme.colors.primary : theme.colors.textFaint};
  font-size: 12px;
  font-weight: ${({ $filled }) => $filled ? 700 : 500};
  line-height: 1.45;
`;
