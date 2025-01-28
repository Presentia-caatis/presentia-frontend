import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { LayoutConfigProvider } from "./context/LayoutConfigContext";
import "./style/index.scss";
import AppRoutes from "./routes";
import { ToastContextProvider } from "./layout/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { SchoolProvider } from "./context/SchoolContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <ToastContextProvider>
    <PrimeReactProvider>
      <LayoutConfigProvider>
        <BrowserRouter>
          <AuthProvider>
            <SchoolProvider>
              <AppRoutes />
            </SchoolProvider>
          </AuthProvider>
        </BrowserRouter>
      </LayoutConfigProvider>
    </PrimeReactProvider>
  </ToastContextProvider>
);
