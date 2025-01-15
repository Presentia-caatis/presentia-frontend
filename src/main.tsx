import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { LayoutConfigProvider } from './context/LayoutConfigContext'
import './style/index.scss';
import AppRoutes from './routes';
import { ToastContextProvider } from './layout/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';

createRoot(document.getElementById('root')!).render(
  <ToastContextProvider>
    <PrimeReactProvider>
      <LayoutConfigProvider>
        <AuthProvider>
          <SchoolProvider>
            <AppRoutes />
        </SchoolProvider>
        </AuthProvider>
      </LayoutConfigProvider>
    </PrimeReactProvider>
  </ToastContextProvider>
);
