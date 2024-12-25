// src/index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { LayoutConfigProvider } from './context/LayoutConfigContext'
import './style/index.scss';
import AppRoutes from './routes';
import { ToastContextProvider } from './context/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContextProvider>
      <PrimeReactProvider>
        <LayoutConfigProvider>
          <AppRoutes />
        </LayoutConfigProvider>
      </PrimeReactProvider>
    </ToastContextProvider>
  </StrictMode>
);
