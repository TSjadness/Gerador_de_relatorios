import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: {
      background: string;
      backgroundElevated: string;
      surface: string;
      surfaceSoft: string;
      surfaceStrong: string;
      header: string;
      headerPreview: string;
      headerSoft: string;
      primary: string;
      primaryHover: string;
      primarySoft: string;
      primaryText: string;
      accent: string;
      accentHover: string;
      accentText: string;
      cyan: string;
      cyanSoft: string;
      text: string;
      textSoft: string;
      textFaint: string;
      textInverse: string;
      border: string;
      borderStrong: string;
      success: string;
      successSoft: string;
      warning: string;
      warningSoft: string;
      danger: string;
      dangerSoft: string;
      info: string;
      infoSoft: string;
      overlay: string;
      headerBorder: string;
      headerControl: string;
      headerControlHover: string;
      headerMuted: string;
      translucentSurface: string;
      translucentSurfaceHover: string;
      translucentBorder: string;
      translucentBorderStrong: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadow: {
      soft: string;
      raised: string;
    };
  }
}
