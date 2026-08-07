import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 160;
  display: grid;
  place-items: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
`;

export const ModalCard = styled.div`
  width: min(1220px, 100%);
  max-height: min(880px, calc(100vh - 40px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.raised};
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
  }

  p {
    margin: 5px 0 0;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 12.5px;
    line-height: 1.5;
  }
`;

export const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textSoft};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Body = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 22px;
`;

export const StageIntro = styled.div`
  margin-bottom: 12px;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
  }

  p {
    margin: 5px 0 0;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const AnalysisTextarea = styled.textarea`
  width: 100%;
  min-height: 290px;
  resize: vertical;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.text};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.6;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: 0;
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
  }
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;

  @media (max-width: 620px) {
    align-items: stretch;
    flex-direction: column-reverse;
  }
`;

const ActionButton = styled.button`
  min-height: 42px;
  padding: 9px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const BackButton = styled(ActionButton)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const PrimaryButton = styled(ActionButton)`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};

  &:not(:disabled):hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const ResultBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 15px;
  margin-bottom: 16px;
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.success} 32%, ${({ theme }) => theme.colors.border});
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.successSoft};
  color: ${({ theme }) => theme.colors.success};

  strong {
    display: block;
    font-size: 13px;
  }

  > span {
    font-size: 11px;
    font-weight: 800;
  }

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ResultMeta = styled.span`
  display: block;
  margin-top: 3px;
  font-size: 11.5px;
  font-weight: 600;
`;

export const ImportModeGroup = styled.div`
  margin-bottom: 14px;

  > strong {
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 11.5px;
  }

  > div {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
`;

export const ImportMode = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;

  input {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PreviewScroll = styled.div`
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
`;

export const PreviewTable = styled.table`
  width: 100%;
  min-width: 1080px;
  border-collapse: collapse;
  font-size: 11px;

  th,
  td {
    padding: 9px 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${({ theme }) => theme.colors.surfaceStrong};
    color: ${({ theme }) => theme.colors.textSoft};
    font-weight: 800;
  }

  td {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const WarningNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 13px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.infoSoft};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11.5px;
  line-height: 1.5;

  i {
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.info};
  }
`;

export const EmptyResult = styled.div`
  padding: 20px;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 14px;
  color: ${({ theme }) => theme.colors.textSoft};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  font-size: 12px;
  text-align: center;
`;
