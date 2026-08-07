import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import styled from 'styled-components';

export const Card = styled.article<{ $selected: boolean }>`
  overflow: hidden;
  border: 1px solid ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 14px;
  background: ${({ theme, $selected }) => $selected ? theme.colors.primarySoft : theme.colors.surface};
  box-shadow: ${({ theme, $selected }) => $selected ? `0 0 0 2px color-mix(in srgb, ${theme.colors.primary} 8%, transparent)` : 'none'};
  transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;

  &:hover {
    border-color: ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.borderStrong};
  }
`;

export const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const CardLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  flex: 1;
  cursor: pointer;
`;

export const CheckInput = styled.input`
  width: 18px;
  height: 18px;
  margin: 1px 0 0;
  flex: 0 0 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const CardCopy = styled.span`
  min-width: 0;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13.5px;
    line-height: 1.3;
  }
`;

export const CardText = styled.span`
  display: block;
  margin-top: 3px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11.5px;
  line-height: 1.4;
`;

export const PeriodButton = styled(Button)`
  && {
    min-height: 34px;
    padding: 7px 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 11px;
    box-shadow: none;
  }
`;

export const DetailPanel = styled.div`
  padding: 12px 14px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceSoft};
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailBox = styled.div`
  min-width: 0;
  padding: 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const DetailTitle = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 800;
`;

export const DetailHelp = styled.p`
  margin: 3px 0 9px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11px;
  line-height: 1.4;
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 9px;

  &:empty {
    display: none;
  }
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.text};
  font-size: 11px;
  font-weight: 700;

  button {
    width: 21px;
    height: 21px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surfaceStrong};
    color: ${({ theme }) => theme.colors.textSoft};
    cursor: pointer;
  }

  button:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const EditorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const YearInput = styled(InputText)`
  && {
    width: 132px;
    min-height: 38px;
  }

  @media (max-width: 520px) {
    && {
      width: 100%;
    }
  }
`;

export const MonthSelect = styled.select`
  min-width: 150px;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const AddButton = styled(Button)`
  && {
    min-height: 38px;
    padding: 8px 11px;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryText};
    font-size: 11px;
  }

  @media (max-width: 520px) {
    && {
      width: 100%;
    }
  }
`;
