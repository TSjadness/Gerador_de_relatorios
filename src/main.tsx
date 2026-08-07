import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
// @ts-ignore: CSS imports are resolved by the bundler at build time
import 'primereact/resources/themes/lara-light-blue/theme.css';
// @ts-ignore: CSS imports are resolved by the bundler at build time
import 'primereact/resources/primereact.min.css';
// @ts-ignore: CSS imports are resolved by the bundler at build time
import 'primeicons/primeicons.css';
import App from './App';
import { AppThemeProvider } from './contexts/ThemeContext';
import { primeReactConfig } from './themes/primePreset';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={primeReactConfig}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </PrimeReactProvider>
  </StrictMode>
);
