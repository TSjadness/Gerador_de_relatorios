import styled from 'styled-components';

export const DasLayout = styled.main`
  width: min(1540px, 100%);
  margin: 0 auto;
  padding: 18px clamp(18px, 2.6vw, 34px) clamp(18px, 2.6vw, 34px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
  gap: clamp(18px, 2vw, 28px);
  align-items: start;

  > div:first-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 680px) {
    padding-inline: 14px;
    gap: 14px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px 16px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldSelect = styled.select`
  width: 100%;
  min-height: 42px;
  padding: 9px 34px 9px 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: 0;
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
  }
`;

export const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  min-height: 39px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 11px;
  font-size: 11.5px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const SecondaryButton = styled(ToolbarButton)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.primary};

  &:not(:disabled):hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;

export const AnalysisButton = styled(ToolbarButton)`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};

  &:not(:disabled):hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const ToolbarHint = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 10.8px;
`;


export const YearGroupSection = styled.section<{ $unknown?: boolean }>`
  margin-top: 16px;
  padding: 14px;
  border: 1px solid ${({ theme, $unknown }) => $unknown ? `color-mix(in srgb, ${theme.colors.warning} 42%, ${theme.colors.border})` : theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surfaceSoft};

  &:first-of-type {
    margin-top: 4px;
  }
`;

export const YearGroupHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 11px;

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const YearGroupTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  line-height: 1.2;
`;

export const YearGroupMeta = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 10.5px;
  line-height: 1.45;
`;

export const YearGroupTotal = styled.div`
  min-width: 150px;
  padding: 8px 11px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.primarySoft};
  text-align: right;

  span {
    display: block;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 9.7px;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 620px) {
    width: 100%;
    text-align: left;
  }
`;

export const YearFinancialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;

export const YearFinancialItem = styled.div<{ $featured?: boolean }>`
  padding: 8px 10px;
  border: 1px solid ${({ theme, $featured }) => $featured ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background: ${({ theme, $featured }) => $featured ? theme.colors.primarySoft : theme.colors.surface};

  span {
    display: block;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 9.5px;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: ${({ theme, $featured }) => $featured ? theme.colors.primary : theme.colors.text};
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
`;

export const EmptyTableCard = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const Table = styled.table`
  width: 100%;
  min-width: 1340px;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    border-right: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.border} 65%, transparent);
    vertical-align: middle;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  th {
    padding: 10px 8px;
    background: ${({ theme }) => theme.colors.surfaceStrong};
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 10.5px;
    font-weight: 800;
    line-height: 1.35;
    text-align: left;
  }

  td {
    padding: 5px;
    background: ${({ theme }) => theme.colors.surface};
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover td {
    background: color-mix(in srgb, ${({ theme }) => theme.colors.primarySoft} 34%, ${({ theme }) => theme.colors.surface});
  }

  th:nth-child(1) { width: 142px; }
  th:nth-child(2) { width: 88px; }
  th:nth-child(3) { width: 92px; }
  th:nth-child(4) { width: 125px; }
  th:nth-child(5), th:nth-child(6), th:nth-child(7), th:nth-child(8) { width: 105px; }
  th:nth-child(9), th:nth-child(10) { width: 132px; }
  th:nth-child(11) { width: 86px; }

  .center {
    text-align: center;
  }
`;

export const FieldInput = styled.input`
  width: 100%;
  min-height: 36px;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 11.5px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceSoft};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceSoft};
    outline: 0;
    box-shadow: 0 0 0 2px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 14%, transparent);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

export const MoneyInput = styled(FieldInput)`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const CheckboxInput = styled.input`
  width: 17px;
  height: 17px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const ActionsCell = styled.td`
  white-space: nowrap;
`;

export const IconButton = styled.button<{ $danger?: boolean }>`
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  margin: 0 2px;
  border: 1px solid ${({ theme, $danger }) => $danger ? `color-mix(in srgb, ${theme.colors.danger} 28%, ${theme.colors.border})` : theme.colors.border};
  border-radius: 9px;
  background: ${({ theme, $danger }) => $danger ? theme.colors.dangerSoft : theme.colors.surfaceSoft};
  color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.primary};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.primary};
  }
`;

export const EmptyTable = styled.div`
  min-height: 138px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textFaint};
  text-align: center;

  i {
    margin-bottom: 2px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 22px;
  }

  strong {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
  }

  span {
    max-width: 520px;
    font-size: 10.5px;
    line-height: 1.5;
  }
`;

export const TotalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;

export const TotalCard = styled.div<{ $featured?: boolean }>`
  padding: 11px 12px;
  border: 1px solid ${({ theme, $featured }) => $featured ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  background: ${({ theme, $featured }) => $featured ? theme.colors.primarySoft : theme.colors.surfaceSoft};
`;

export const TotalLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 10px;
  font-weight: 700;
`;

export const TotalValue = styled.strong`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-variant-numeric: tabular-nums;
`;

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  textarea {
    width: 100%;
    resize: vertical;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px;
    line-height: 1.55;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: 0;
      box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.primary} 18%, transparent);
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterCard = styled.section`
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.soft};

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const FooterCheck = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  cursor: pointer;

  input {
    width: 17px;
    height: 17px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.primary};
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 11.5px;
  }

  small {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 10.5px;
    line-height: 1.4;
  }
`;

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 620px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

export const SideColumn = styled.aside`
  min-width: 0;
  position: sticky;
  top: 104px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 1120px) {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SideCard = styled.section`
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.soft};

  h3 {
    margin: 0 0 14px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
  }

  > p {
    margin: 13px 0 0;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 10.8px;
    line-height: 1.5;
  }
`;

export const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 10.5px;
  font-weight: 700;
`;

export const SummaryAmount = styled.strong`
  display: block;
  margin: 5px 0 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 27px;
  line-height: 1;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
`;

export const SummaryRows = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;

  &:last-child {
    border-bottom: 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-variant-numeric: tabular-nums;
  }
`;


export const YearSummaryDivider = styled.div`
  margin: 14px 0 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const YearSummaryList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 7px;
`;

export const YearSummaryItem = styled.div<{ $unknown?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme, $unknown }) => $unknown ? theme.colors.warning : theme.colors.textSoft};
  font-size: 11px;

  &:last-child {
    border-bottom: 0;
  }

  span {
    font-weight: 800;
  }

  small {
    margin-left: 5px;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 9.5px;
    font-weight: 600;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-variant-numeric: tabular-nums;
  }
`;

export const InfoFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

export const InfoFlowItem = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 9px;

  > span {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    font-weight: 900;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 11.5px;
  }

  p {
    margin: 3px 0 0;
    color: ${({ theme }) => theme.colors.textFaint};
    font-size: 10.5px;
    line-height: 1.45;
  }
`;
