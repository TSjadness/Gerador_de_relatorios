import { Button } from 'primereact/button';
import styled from 'styled-components';

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const AddCustomRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 9px;
  margin-top: 14px;

  .p-button {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryText};
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const CustomCard = styled.article<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 14px;
  background: ${({ theme, $selected }) => $selected ? theme.colors.primarySoft : theme.colors.surface};

  label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    cursor: pointer;
  }
`;

export const NativeCheck = styled.input`
  width: 18px;
  height: 18px;
  margin: 1px 0 0;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const CustomCopy = styled.span`
  min-width: 0;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13.5px;
  }

  span {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 11.5px;
  }
`;

export const CustomRemove = styled(Button)`
  && {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &&:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.danger};
  }
`;
