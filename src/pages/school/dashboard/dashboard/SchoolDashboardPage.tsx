/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useSchool } from '../../../../context/SchoolContext';
import { useAuth } from '../../../../context/AuthContext';
import dashboardService from '../../../../services/dashboardService';
import { Skeleton } from 'primereact/skeleton';
import { Carousel } from 'primereact/carousel';

interface DashboardData {
    activeStudents: number;
    inactiveStudents: number;
    maleStudents: number;
    femaleStudents: number;
    activePackage: string;
    packageExpiry: string;
    totalPresenceToday: number;
    totalAbsenceToday: number;
    dailyData: []
}

const SchoolDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { school } = useSchool();
    const { user, logout } = useAuth();

    const today = new Date();
    const todayString = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    useEffect(() => {
        if (!user || user.school_id === null) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const date = new Date().toISOString().split('T')[0];

                const [staticData, dailyDataSummarize, dailyData] = await Promise.all([
                    dashboardService.getStaticStatistics(),
                    dashboardService.getDailyStatistics(date, 1),
                    dashboardService.getDailyStatistics(date, 0)
                ]);

                setDashboardData({
                    activeStudents: staticData.data.active_students,
                    inactiveStudents: staticData.data.inactive_students,
                    maleStudents: staticData.data.male_students,
                    femaleStudents: staticData.data.female_students,
                    activePackage: staticData.data.subscription_packet?.subscription_name ?? "-",
                    packageExpiry: staticData.data.subscription_packet?.end_duration ?? "-",
                    totalPresenceToday: dailyDataSummarize.data.presence ?? 0,
                    totalAbsenceToday: dailyDataSummarize.data.absence ?? 0,
                    dailyData: dailyData.data ?? []
                });

            } catch (error) {
                console.error('Error fetching data:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.school_id]);


    useEffect(() => {
        if (dashboardData) {
            setStudentActiveChart({
                labels: ["Siswa Aktif", "Siswa Tidak Aktif"],
                datasets: [
                    {
                        data: [dashboardData.activeStudents, dashboardData.inactiveStudents],
                        backgroundColor: ["#1E3A8A", "#6B21A8"]

                    },
                ],
            });

            setStudentGenderChart({
                labels: ["Laki-Laki", "Perempuan"],
                datasets: [
                    {
                        data: [dashboardData.maleStudents, dashboardData.femaleStudents],
                        backgroundColor: ["#6366F1", "#A855F7"]
                    },
                ],
            });

            setStudentAttendanceChart({
                labels: ["Hadir", "Tidak Hadir"],
                datasets: [
                    {
                        data: [dashboardData.totalPresenceToday, dashboardData.totalAbsenceToday],
                        backgroundColor: ["#10B981", "#EF4444"]
                    },
                ],
            });
        }
    }, [dashboardData]);

    const dailyDataArray = dashboardData?.dailyData
        ? Object.entries(dashboardData.dailyData).map(([key, value]) => ({ key, value }))
        : [];


    useEffect(() => {
        if (dashboardData?.dailyData && Object.keys(dashboardData.dailyData).length > 0) {
            const dailyKeys: string[] = Object.keys(dashboardData.dailyData);
            const dailyValues: number[] = Object.values(dashboardData.dailyData).map(Number);

            setDailyChart({
                labels: dailyKeys,
                datasets: [
                    {
                        data: dailyValues,
                        backgroundColor: ["#10B981", "#EF4444", "#F59E0B", "#6366F1", "#A855F7"],
                    },
                ],
            });
        }
    }, [dashboardData?.dailyData]);



    const [studentActiveChart, setStudentActiveChart] = useState({
        labels: ["Siswa Aktif", "Siswa Tidak Aktif"],
        datasets: [{ data: [0, 0], backgroundColor: ["#1E3A8A", "#6B21A8"] }],
    });

    const [studentGenderChart, setStudentGenderChart] = useState({
        labels: ["Laki-Laki", "Perempuan"],
        datasets: [{ data: [0, 0], backgroundColor: ["#6366F1", "#A855F7"] }],
    });

    const [studentAttendanceChart, setStudentAttendanceChart] = useState({
        labels: ["Hadir", "Tidak Hadir"],
        datasets: [{ data: [0, 0], backgroundColor: ["#10B981", "#EF4444"] }],
    });

    const [dailyChart, setDailyChart] = useState<{
        labels: string[];
        datasets: { data: number[]; backgroundColor: string[] }[];
    }>({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: ["#10B981", "#EF4444", "#F59E0B", "#6366F1", "#A855F7"],
            },
        ],
    });




    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: '#333',
                },
            },
        },
    };

    const convertToWIB = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Jakarta"
        }).format(date);
    };

    const itemTemplate = (item: { key: string; value: any }) => (
        <div className="card text-center m-2">
            <span className="block text-500 font-medium">{item.key}</span>
            <div className="text-900 font-bold text-2xl">{item.value}</div>
        </div>
    );

    return (
        <>
            <div className="card flex flex-column md:flex-row  gap-3 justify-content-between">
                <div>
                    <h1>{`Selamat Datang di Dashboard ${school ? school.name : 'Loading...'}`}</h1>
                    <p>{school ? school.address : 'Loading...'}</p>
                </div>
                <div className="my-auto">
                    <h3>{todayString}</h3>
                </div>
            </div>
            <div className="grid">
                <div className="col-12 lg:col-4">
                    <div className="card h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Hadir Hari Ini</span>
                                <div className="text-900 font-medium text-xl">{loading ? <Skeleton width="2rem" height="2rem" /> : dashboardData?.totalPresenceToday}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-users text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-4">
                    <div className="card  h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Absen Hari Ini</span>
                                <div className="text-900 font-medium text-xl">{loading ? <Skeleton width="2rem" height="2rem" /> : dashboardData?.totalAbsenceToday}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-4">
                    <div className="card">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Paket Aktif</span>
                                <div className="text-900 font-medium text-xl">{loading ? <Skeleton width="2rem" height="2rem" /> : dashboardData?.activePackage}</div>
                                <span className="block text-500 font-small flex mt-2">
                                    Berlaku hingga: {loading ? (
                                        <Skeleton className='ml-2 pt-1' width="10rem" height="1.2rem" />
                                    ) : (
                                        convertToWIB(dashboardData?.packageExpiry)
                                    )}
                                </span>

                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-green-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-check-circle text-green-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 w-full h-full">
                    <div className="card">
                        <h5>Data Kehadiran Hari Ini</h5>
                        <div className="grid">
                            {loading
                                ? Array.from({ length: 4 }).map((_, index) => (
                                    <div className="col-12 md:col-4 lg:col-3" key={index}>
                                        <div className="card h-full text-center">
                                            <span className="block text-500 font-medium flex justify-content-center">
                                                <Skeleton width="80%" height="1rem" />
                                            </span>
                                            <div className="text-900 font-bold text-center text-2xl flex justify-content-center">
                                                <Skeleton width="50%" height="2rem" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : dashboardData?.dailyData &&
                                <Carousel
                                    className="col-12"
                                    value={dailyDataArray}
                                    numVisible={4}
                                    numScroll={1}
                                    itemTemplate={itemTemplate}
                                    showIndicators={false}
                                    circular
                                    autoplayInterval={3000}
                                />

                            }
                        </div>
                    </div>
                </div>

                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5>Perbandingan Kehadiran Hari Ini</h5>
                        {loading ? (
                            <Skeleton width="100%" height="200px" />
                        ) : dashboardData?.totalPresenceToday === 0 && dashboardData?.totalAbsenceToday === 0 ? (
                            <h3>Tidak Ada Kehadiran Hari Ini</h3>
                        ) : (
                            <Chart type="pie" data={studentAttendanceChart} options={chartOptions} />
                        )}
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center h-full">
                        <h5>Statistik Kehadiran Harian</h5>
                        {loading ? (
                            <Skeleton width="100%" height="200px" />
                        ) : dailyChart.labels.length === 0 ? (
                            <h3>Tidak Ada Data Kehadiran</h3>
                        ) : (
                            <Chart type="pie" data={dailyChart} options={chartOptions} />
                        )}
                    </div>
                </div>

                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5>Perbandingan Status Siswa</h5>
                        {loading ? (
                            <Skeleton width="100%" height="200px" />
                        ) : (
                            <Chart type="pie" data={studentActiveChart} options={chartOptions} />
                        )}
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5>Perbandingan Gender Siswa</h5>
                        {loading ? (
                            <Skeleton width="100%" height="200px" />
                        ) : (
                            <Chart type="doughnut" data={studentGenderChart} options={chartOptions} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SchoolDashboardPage;
