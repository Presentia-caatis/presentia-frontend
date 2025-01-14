import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface LayoutConfigProps {
    children: ReactNode;
}

type LayoutConfig = {
    darkMode: boolean;
    scale: number;
    menuMode: string;
    ripple: boolean;
    setDarkMode: (value: boolean) => void;
    setScale: (value: number) => void;
    setMenuMode: (value: string) => void;
    setRipple: (value: boolean) => void;
};

const LayoutConfigContext = createContext<LayoutConfig | null>(null);

export const LayoutConfigProvider: React.FC<LayoutConfigProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem('darkmode') === 'true');
    const [scale, setScale] = useState<number>(parseInt(localStorage.getItem('scale') || '14'));
    const [menuMode, setMenuMode] = useState<string>(localStorage.getItem('menuMode') || 'static');
    const [ripple, setRipple] = useState<boolean>(localStorage.getItem('ripple') === 'true');

    // Update localStorage on changes
    useEffect(() => {
        localStorage.setItem('darkmode', String(darkMode));
        localStorage.setItem('scale', String(scale));
        localStorage.setItem('menuMode', menuMode);
        localStorage.setItem('ripple', String(ripple));
    }, [darkMode, scale, menuMode, ripple]);

    return (
        <LayoutConfigContext.Provider value={{ darkMode, setDarkMode, scale, setScale, menuMode, setMenuMode, ripple, setRipple }}>
            {children}
        </LayoutConfigContext.Provider>
    );
};

export const useLayoutConfig = (): LayoutConfig => {
    const context = useContext(LayoutConfigContext);
    if (context === null) {
        throw new Error("useLayoutConfig must be used within a LayoutConfigProvider");
    }
    return context;
};
