/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import schoolService from "../services/schoolService";
import dashboardService from "../services/dashboardService";
import { useAuth } from "./AuthContext";

interface SchoolData {
    id: number;
    name: string;
    plan: string;
    is_subscription_packet_active: string;
    latest_subscription: string;
    status: string;
    address: string;
    totalActiveStudents: number;
    totalPresenceToday: number;
    totalAbsenceToday: number;
    registeredAt: string;
    logoImagePath: string;
    activeStudents: number;
    inactiveStudents: number;
    maleStudents: number;
    femaleStudents: number;
    activePackage: string;
    packageExpiry: string;
    dailyData: []
}

interface SchoolContextProps {
    school: SchoolData | null;
    setSchool: React.Dispatch<React.SetStateAction<SchoolData | null>>;
    schoolLoading: boolean;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    const [school, setSchool] = useState<SchoolData | null>(null);
    const [schoolLoading, setSchoolLoading] = useState<boolean>(true);

    const { user, logout } = useAuth();
    const schoolId = user?.school_id;

    useEffect(() => {
        const fetchSchool = async () => {
            if (!schoolId) {
                setSchoolLoading(false);
                return;
            }

            try {
                setSchoolLoading(true);
                const [schoolRes, staticRes, dailyResSummarize, dailyRes] = await Promise.all([
                    schoolService.getById(schoolId),
                    dashboardService.getStaticStatistics(),
                    dashboardService.getDailyStatistics(undefined, 1),
                    dashboardService.getDailyStatistics(undefined, 0),
                ]);

                setSchool({
                    id: schoolRes.data.id!,
                    name: schoolRes.data.name,
                    plan: staticRes.data.subscription_packet?.subscription_name ?? "Tidak Ada Paket",
                    latest_subscription: schoolRes.data.latest_subscription ?? "Tidak Ada Data",
                    is_subscription_packet_active: staticRes.data.is_subscription_packet_active ?? false,
                    status: schoolRes.data.status ?? "Unknown",
                    address: schoolRes.data.address ?? "Tidak Ada Alamat",
                    totalActiveStudents: staticRes.data.active_students ?? 0,
                    totalPresenceToday: dailyResSummarize.data.presence ?? 0,
                    totalAbsenceToday: dailyResSummarize.data.absence ?? 0,
                    registeredAt: schoolRes.data.created_at ?? new Date().toISOString(),
                    logoImagePath: schoolRes.data.logo_image_path ?? "",
                    activeStudents: staticRes.data.active_students,
                    inactiveStudents: staticRes.data.inactive_students,
                    maleStudents: staticRes.data.male_students,
                    femaleStudents: staticRes.data.female_students,
                    activePackage: staticRes.data.subscription_packet?.subscription_name ?? "-",
                    packageExpiry: staticRes.data.subscription_packet?.end_duration ?? "-",
                    dailyData: dailyRes.data ?? []
                });

            } catch (error) {
                logout();
                console.error("Error fetching school:", error);
            } finally {
                setSchoolLoading(false);
            }
        };

        fetchSchool();
    }, [schoolId]);

    return (
        <SchoolContext.Provider value={{ school, setSchool, schoolLoading }}>
            {children}
        </SchoolContext.Provider>
    );
};

export const useSchool = () => {
    const context = useContext(SchoolContext);
    if (!context) {
        throw new Error("useSchool must be used within a SchoolProvider");
    }
    return context;
};
