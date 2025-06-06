/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import authServices from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../layout/ToastContext';
import { resetSchool } from '../utils/schoolUtils';
import { setAuthUserGetter } from '../utils/authHelper';

export interface User {
    id: number;
    school_id: number | null;
    email: string;
    username: string;
    fullname: string;
    google_id: string | null;
    email_verified_at: string | null;
    profile_image_path: string;
    permissions: string[];
    roles: string[];
    created_at: string;
    updated_at: string;
}

interface AuthContextProps {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    updateUser: (updatedUser: Partial<User>) => void;
    checkAuth: () => Promise<{ success: boolean; user?: User }>;
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

    const updateUser = (updatedFields: Partial<User>) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };



    const setAuth = (user: User, token: string) => {
        try {
            const previousUser = JSON.parse(localStorage.getItem('user') || '{}');

            if (user.roles.includes('super_admin') && previousUser.school_id) {
                user.school_id = previousUser.school_id;
            }

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);
        } catch (error) {
            console.error('Error saving auth data to localStorage:', error);
        }
    };


    const checkAuth = async (): Promise<{ success: boolean; user?: User }> => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const response = await authServices.getProfile();
                console.log(response.status);
                if (response.data && response.status === "success") {
                    const user = response.data;
                    setAuth(user, storedToken);
                    return { success: true, user };
                }
            } catch (error) {
                console.error("Authentication failed:", error);
                logout();
                return { success: false };
            }
        } else {
            localStorage.clear();
            return { success: false };
        }

        return { success: false };
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

    useEffect(() => {
        setAuthUserGetter(() => {
            if (!user) return null;
            return {
                school_id: user.school_id,
                roles: user.roles,
            };
        });
    }, [user]);



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
