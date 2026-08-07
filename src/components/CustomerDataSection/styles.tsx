import { Button } from 'primereact/button';
import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px 16px;

  > *:nth-child(3) {
    grid-column: 1 / -1;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;

    > *:nth-child(3) {
      grid-column: auto;
    }
  }
`;

export const RestoreButton = styled(Button)`
  && {
    padding: 3px 8px;
    min-height: 28px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10.5px;
  }
`;
