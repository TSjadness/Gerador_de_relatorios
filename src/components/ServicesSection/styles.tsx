import styled from 'styled-components';

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.label<{ $selected: boolean; $featured: boolean; $suggested: boolean }>`
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: flex-start;
  gap: 10px;
  padding: 13px;
  border: 1px solid ${({ theme, $selected, $suggested }) => $selected || $suggested ? theme.colors.primary : theme.colors.border};
  border-radius: 13px;
  background: ${({ theme, $selected, $featured }) => $selected ? theme.colors.primarySoft : $featured ? theme.colors.surfaceStrong : theme.colors.surfaceSoft};
  cursor: pointer;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Check = styled.input`
  width: 18px;
  height: 18px;
  margin: 2px 0 0;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const Copy = styled.span`
  min-width: 0;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
  }

  > span {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 11px;
    line-height: 1.4;
  }
`;

export const SuggestedLabel = styled.em`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10.5px;
  font-style: normal;
  font-weight: 800;
`;

export const Badge = styled.span<{ $featured: boolean }>`
  padding: 4px 7px;
  border: 1px solid ${({ theme, $featured }) => $featured ? theme.colors.accent : theme.colors.border};
  border-radius: 999px;
  background: ${({ theme, $featured }) => $featured ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $featured }) => $featured ? theme.colors.accentText : theme.colors.textSoft};
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
`;
