import { Button } from 'primereact/button';
import styled from 'styled-components';
import type { DiagnosticStatus } from '../../types/diagnostic';

export const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 12.5px;
`;

export const HistoryItem = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 11px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: 0;
  }
`;

export const StatusDot = styled.span<{ $status: DiagnosticStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $status }) => $status === 'regular' ? theme.colors.success : $status === 'atencao' ? theme.colors.warning : theme.colors.danger};
`;

export const Info = styled.div`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    overflow: hidden;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 5px;
`;

export const MiniButton = styled(Button)<{ $danger?: boolean }>`
  && {
    width: 31px;
    height: 31px;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.textSoft};
  }

  &&:hover {
    border-color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.primary};
    background: ${({ theme, $danger }) => $danger ? theme.colors.dangerSoft : theme.colors.primarySoft};
  }
`;
