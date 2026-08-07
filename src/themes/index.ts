import type { DefaultTheme } from 'styled-components';
import { darkColors, lightColors } from '../config/theme';

const shared = {
  radius: {
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '22px'
  },
  shadow: {
    soft: '0 12px 32px rgba(15, 22, 51, 0.07)',
    raised: '0 18px 44px rgba(15, 22, 51, 0.14)'
  }
};

export const lightTheme: DefaultTheme = {
  ...shared,
  mode: 'light',
  colors: lightColors
};

export const darkTheme: DefaultTheme = {
  ...shared,
  mode: 'dark',
  colors: darkColors
};
