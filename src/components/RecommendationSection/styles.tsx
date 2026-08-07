import styled from 'styled-components';

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 13px;
`;

export const Chip = styled.button<{ $active: boolean }>`
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.borderStrong};
  border-radius: 999px;
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.surfaceSoft};
  color: ${({ theme, $active }) => $active ? theme.colors.primaryText : theme.colors.textSoft};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 460px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const EditorNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11.5px;
  line-height: 1.45;

  i {
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
