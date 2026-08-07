import styled, { css } from 'styled-components';
import type { DiagnosticStatus } from '../../types/diagnostic';

const statusPalette = (status: DiagnosticStatus) => {
  if (status === 'regular') return css`
    color: ${({ theme }) => theme.colors.success};
    background: ${({ theme }) => theme.colors.successSoft};
    border-color: ${({ theme }) => theme.colors.success};
  `;
  if (status === 'atencao') return css`
    color: ${({ theme }) => theme.colors.warning};
    background: ${({ theme }) => theme.colors.warningSoft};
    border-color: ${({ theme }) => theme.colors.warning};
  `;
  return css`
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
    border-color: ${({ theme }) => theme.colors.danger};
  `;
};

export const StatusTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const StatusPill = styled.span<{ $status: DiagnosticStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  ${({ $status }) => statusPalette($status)}
`;

export const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;

export const StatusOption = styled.label<{ $active: boolean }>`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 12px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  background: ${({ theme, $active }) => $active ? theme.colors.primarySoft : theme.colors.surfaceSoft};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSoft};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, color 140ms ease, box-shadow 140ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $active }) => $active && css`
    box-shadow: 0 0 0 2px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 8%, transparent);
  `}
`;

export const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  margin: 0;
  display: grid;
  place-content: center;
  border: 1.7px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(0);
    transition: transform 120ms ease;
  }

  &:checked {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 12%, transparent);
  }

  &:checked::before {
    transform: scale(1);
  }
`;
