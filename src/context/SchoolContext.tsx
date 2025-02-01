/* eslint-disable @typescript-eslint/no-explicit-any */
// SchoolContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import schoolService from '../services/schoolService';
import { useAuth } from './AuthContext';

interface SchoolContextProps {
    school: any;
    setSchool: any;
    attendance: any;
    loading: boolean;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    const [school, setSchool] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [attendance] = useState<any>(null);

    const { user } = useAuth();

    const schoolId = user?.school_id;

    useEffect(() => {
        const fetchSchool = async () => {
            if (!schoolId) {
                console.log('No school ID available.');
                setLoading(false);
                return;
            }

            try {
                const response = await schoolService.getById(schoolId);
                setSchool(response.data);
            } catch (error) {
                console.error('Error fetching school :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchool();
    }, [schoolId]);



    return (
        <SchoolContext.Provider value={{ school, attendance, loading, setSchool }}>
            {children}
        </SchoolContext.Provider>
    );
};

export const useSchool = () => {
    const context = useContext(SchoolContext);
    if (!context) {
        throw new Error('useSchool must be used within a SchoolProvider');
    }
    return context;
};
