/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../layout/ToastContext';
import { resetSchool } from '../utils/schoolUtils';

interface User {
    id: number;
    school_id: number | null;
    email: string;
    username: string;
    fullname: string;
    google_id: string | null;
    email_verified_at: string | null;
    profile_image_path: string;
    created_at: string;
    updated_at: string;
}

interface AuthContextProps {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    updateUser: (updatedUser: User) => void;
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
    const { showToast } = useToastContext();
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const navigate = useNavigate();

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

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
            try {
                const response = await authServices.getProfile();
                console.log(response.status);
                if (response.data && response.status === "success") {
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
            localStorage.clear();
            return false;
        }
        return false;
    };

    const logout = async () => {
        try {
            await authServices.logout();
            callToast(showToast, 'success', 'Logout Sukses', 'Kamu berhasil logout');
        } catch (error) {
            localStorage.clear();
            callToast(showToast, 'error', 'Sesi habis', 'Silahkan login kembali');
            console.error("Error during logout:", error);
        } finally {
            localStorage.clear();
            setUser(null);
            setToken(null);
            resetSchool();
            if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
                navigate('/login');
            }
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, setAuth, updateUser, checkAuth, logout }}>
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
