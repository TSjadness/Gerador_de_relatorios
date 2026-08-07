import styled, { keyframes } from 'styled-components';
import type { NotificationTone } from '../../types/diagnostic';

const lifecycle = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  8% { opacity: 1; transform: translateY(0); }
  88% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(8px); pointer-events: none; }
`;


export const NotificationBox = styled.div<{ $tone: NotificationTone }>`
  position: fixed;
  right: 22px;
  bottom: 96px;
  z-index: 150;
  width: min(390px, calc(100vw - 32px));
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 15px;
  border: 1px solid ${({ theme, $tone }) => $tone === 'success' ? theme.colors.success : $tone === 'warning' ? theme.colors.warning : $tone === 'error' ? theme.colors.danger : theme.colors.info};
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadow.raised};
  font-size: 13px;
  line-height: 1.45;
  animation: ${lifecycle} 3.4s ease forwards;

  i {
    margin-top: 2px;
    color: ${({ theme, $tone }) => $tone === 'success' ? theme.colors.success : $tone === 'warning' ? theme.colors.warning : $tone === 'error' ? theme.colors.danger : theme.colors.info};
  }

  @media (max-width: 600px) {
    right: 16px;
    bottom: 128px;
  }
`;
