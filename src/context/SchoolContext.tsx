/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import schoolService from "../services/schoolService";
import dashboardService from "../services/dashboardService";
import attendanceService from "../services/attendanceService";
import { useAuth } from "./AuthContext";
import { useToastContext } from "../layout/ToastContext";
import { setResetSchoolCallback } from "../utils/schoolUtils";

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
    handleExportAttendance: (params: any) => Promise<void>;
    loadingExportAttendance: boolean;
}


const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: React.ReactNode }) => {
    const [school, setSchool] = useState<SchoolData | null>(null);
    const [schoolLoading, setSchoolLoading] = useState<boolean>(true);
    const [loadingExportAttendance, setLoadingExportAttendance] = useState<boolean>(false);
    const { user, logout } = useAuth();
    const schoolId = user?.school_id;
    const { showToast, clearToast } = useToastContext();
    function callToast(showToast: any, severity: string, summary: string, detail: string, sticky: boolean = false, position: string = "top-right") {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail,
            life: sticky ? 999999 : 3000,
        }, position);
    }

    const resetSchool = () => {
        setSchool(null);
    };

    useEffect(() => {
        setResetSchoolCallback(resetSchool);
    }, []);

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
                    totalPresenceToday: dailyResSummarize.data[0]?.statistic?.check_in.present ?? 0,
                    totalAbsenceToday: dailyResSummarize.data[0]?.statistic?.check_in.absent ?? 0,
                    registeredAt: schoolRes.data.created_at ?? new Date().toISOString(),
                    logoImagePath: schoolRes.data.logo_image_path ?? "",
                    activeStudents: staticRes.data.active_students,
                    inactiveStudents: staticRes.data.inactive_students,
                    maleStudents: staticRes.data.male_students,
                    femaleStudents: staticRes.data.female_students,
                    activePackage: staticRes.data.subscription_packet?.subscription_name ?? "-",
                    packageExpiry: staticRes.data.subscription_packet?.end_duration ?? "-",
                    dailyData: dailyRes.data[0]?.statistic?.check_in ?? []
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

    const handleExportAttendance = async (params: any) => {
        try {
            setLoadingExportAttendance(true);

            const queryParams: any = {};
            if (params.exportStartDate && params.exportEndDate) {
                queryParams.startDate = params.exportStartDate.toISOString().split("T")[0];
                queryParams.endDate = params.exportEndDate.toISOString().split("T")[0];
            }
            if (params.exportKelas && params.exportKelas.length > 0) {
                queryParams.classGroup = params.exportKelas.join(",");
            }
            callToast(showToast, 'info', 'Sedang melakukan export data kehadiran!', 'Anda dapat melakukan aktivitas lain sementara menunggu proses selesai.', true);

            await attendanceService.exportAttendance(queryParams);

            clearToast();
            callToast(showToast, 'success', 'Sukses', 'Export data kehadiran berhasil!', false, 'top-center');
        } catch (error) {
            clearToast();
            callToast(showToast, 'error', 'Export Gagal', 'Terjadi kesalahan saat mengekspor!');
        } finally {
            setLoadingExportAttendance(false);
        }
    };

    return (
        <SchoolContext.Provider value={{ school, setSchool, schoolLoading, handleExportAttendance, loadingExportAttendance }}>
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
