import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { setAxiosAuthHeaders } from '../utils/axiosClient';

interface AuthContextProps {
    csrfToken: string | null;
    laravelSession: string | null;
}

const AuthContext = createContext<AuthContextProps>({
    csrfToken: null,
    laravelSession: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [laravelSession, setLaravelSession] = useState<string | null>(null);

    useEffect(() => {
        // Check for cookies directly
        const fetchTokens = async () => {
            try {
                // Fetch CSRF Token if needed or rely on the cookies
                const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie');

                // Retrieve CSRF Token from the cookies
                const csrf = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
                const session = document.cookie.split('; ').find(row => row.startsWith('laravel_session='));

                console.log(document.cookie)

                setAxiosAuthHeaders(csrf|| null, session || null);
            } catch (error) {
                console.error('Error fetching tokens:', error);
            }
        };

        fetchTokens();
    }, []);

    return (
        <AuthContext.Provider value={{ csrfToken, laravelSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
