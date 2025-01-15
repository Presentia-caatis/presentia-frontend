import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authService';

interface User {
    id: number;
    school_id: number | null;
    email: string;
    username: string;
    fullname: string;
    google_id: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthContextProps {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    );
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const setAuth = (user: User, token: string) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
    };

    const logout = async () => {
        try {
            await authServices.logout();
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.clear();
            setUser(null);
            setToken(null);
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
