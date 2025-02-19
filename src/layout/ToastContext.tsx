/* eslint-disable @typescript-eslint/no-explicit-any */
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import ReactDOM from "react-dom";
import { Toast } from "primereact/toast";
import { createContext, useContext, useRef } from "react";

interface ToastContextProps {
    showToast: (options: any, position?: ToastPosition) => void;
    clearToast: () => void;
}

type ToastPosition = "top-right" | "top-left" | "top-center" | "center" | "bottom-left" | "bottom-center" | "bottom-right";

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
    const toastRefs = {
        "top-right": useRef<Toast | null>(null),
        "top-left": useRef<Toast | null>(null),
        "top-center": useRef<Toast | null>(null),
        "center": useRef<Toast | null>(null),
        "bottom-left": useRef<Toast | null>(null),
        "bottom-center": useRef<Toast | null>(null),
        "bottom-right": useRef<Toast | null>(null),
    } as const;

    const showToast = (options: any, position: ToastPosition = "top-right") => {
        toastRefs[position]?.current?.show(options);
    };

    const clearToast = () => {
        Object.values(toastRefs).forEach(ref => ref.current?.clear());
    };

    return (
        <ToastContext.Provider value={{ showToast, clearToast }}>
            {ReactDOM.createPortal(
                <>
                    <Toast ref={toastRefs["top-left"]} position="top-left" />
                    <Toast ref={toastRefs["top-center"]} position="top-center" />
                    <Toast ref={toastRefs["top-right"]} position="top-right" />
                    <Toast ref={toastRefs["center"]} position="center" />
                    <Toast ref={toastRefs["bottom-left"]} position="bottom-left" />
                    <Toast ref={toastRefs["bottom-center"]} position="bottom-center" />
                    <Toast ref={toastRefs["bottom-right"]} position="bottom-right" />
                </>,
                document.body
            )}
            <div>{children}</div>
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToastContext must be used within ToastContextProvider");
    }

    return context;
};
