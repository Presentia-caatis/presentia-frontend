import React, { createContext, useContext, useState } from 'react';

interface UserContextProps {
    username: string | null;
    token: string | null;
    setUser: (username: string) => void;
    setToken: (token: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUser] = useState<string | null>(localStorage.getItem('username'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const setUserAndToken = (username: string, token: string) => {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        setUser(username);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
