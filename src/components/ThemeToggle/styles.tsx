import { Button } from 'primereact/button';
import styled from 'styled-components';

export const ToggleButton = styled(Button)`
  && {
    min-height: 42px;
    border: 1px solid ${({ theme }) => theme.colors.translucentBorder};
    background: ${({ theme }) => theme.colors.translucentSurface};
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: none;
  }

  &&:hover {
    border-color: ${({ theme }) => theme.colors.translucentBorderStrong};
    background: ${({ theme }) => theme.colors.translucentSurfaceHover};
  }
`;
