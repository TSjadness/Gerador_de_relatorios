import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
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
