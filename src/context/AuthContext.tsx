import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authService';
import { useNavigate } from 'react-router-dom';

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
    checkAuth: () => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const navigate = useNavigate();

    const setAuth = (user: User, token: string) => {
        try {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);
        } catch (error) {
            console.error('Error saving auth data to localStorage:', error);
        }
    };

    const checkAuth = async (): Promise<boolean> => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            console.log("Stored token: " + storedToken);
            try {
                const response = await authServices.getProfile();
                console.log(response.status);
                if (response.data && response.status === "success") {
                    console.log("Stored token: " + storedToken);
                    const user = response.data;
                    setAuth(user, storedToken);
                    return true;
                }
            } catch (error) {
                console.error("Authentication failed:", error);
                logout();
                return false;
            }
        } else {
            logout();
            return false;
        }
        return false;
    };

    const logout = async () => {
        try {
            await authServices.logout();
        } catch (error) {
            localStorage.clear();
            console.error("Error during logout:", error);
        } finally {
            localStorage.clear();
            setUser(null);
            setToken(null);
            if (window.location.pathname !== '/') {
                navigate('/login');
            }
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, setAuth, checkAuth, logout }}>
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
