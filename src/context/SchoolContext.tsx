/* eslint-disable @typescript-eslint/no-explicit-any */
// SchoolContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import schoolService from '../services/schoolService';
import { useAuth } from './AuthContext';

interface SchoolContextProps {
    schoolData: any;
    loading: boolean;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    const [schoolData, setSchoolData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useAuth();

    const schoolId = user?.school_id;

    useEffect(() => {
        const fetchSchoolData = async () => {
            if (!schoolId) {
                console.log('No school ID available.');
                setLoading(false);
                return;
            }

            try {
                const response = await schoolService.getById(schoolId);
                setSchoolData(response.data);
            } catch (error) {
                console.error('Error fetching school data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolData();
    }, [schoolId]);

    return (
        <SchoolContext.Provider value={{ schoolData, loading }}>
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
