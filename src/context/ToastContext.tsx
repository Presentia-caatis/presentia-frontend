/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { Toast } from "primereact/toast";
import { createContext, useContext, useRef } from "react";

// create context
const ToastContext = createContext(undefined);

export const ToastContextProvider = ({ children }) => {
    const toastRef = useRef(null);

    const showToast = (options: any) => {
        if (!toastRef.current) return;
        toastRef.current.show(options);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast ref={toastRef} />
            <div>{children}</div>
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToastContext have to be used within ToastContextProvider"
        );
    }

    return context;
};