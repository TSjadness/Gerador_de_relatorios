import { Button } from 'primereact/button';
import styled from 'styled-components';

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px 12px;
  flex-wrap: wrap;

  > .p-button {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryText};
    box-shadow: 0 7px 18px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
  }

  > .p-button:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const LimitNote = styled.span`
  flex: 1 1 260px;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11px;
  line-height: 1.4;
`;

export const FileList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  &:empty {
    display: none;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FileCard = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.primary} 28%, ${({ theme }) => theme.colors.border});
  border-radius: 13px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surfaceSoft}, ${({ theme }) => theme.colors.surface});
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 22px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 10%, transparent);
  }
`;

export const FileOrder = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.header};
  color: ${({ theme }) => theme.colors.cyan};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
`;

export const FileIcon = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.cyan} 40%, ${({ theme }) => theme.colors.border});
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.cyanSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
`;

export const FileCopy = styled.span`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text};
    font-size: 12.5px;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 11px;
  }
`;

export const FileActions = styled.div`
  display: flex;
  align-items: center;
`;

export const RemoveButton = styled(Button)`
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

export const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 11px;
  line-height: 1.45;

  i {
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
