/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Panel } from 'primereact/panel';
import UserCreateSchoolModal from '../../../../components/user/UserCreateSchoolModal';
import schoolService from '../../../../services/schoolService';
import { useAuth } from '../../../../context/AuthContext';
import logoImage from '../../../../assets/Logo-SMK-10-Bandung.png';
import dashboardService from '../../../../services/dashboardService';
import { formatSchoolName } from '../../../../utils/formatSchoolName';
import { Skeleton } from 'primereact/skeleton';

type SchoolData = {
    id: number;
    name: string;
    plan: string;
    latest_subscription: string;
    status: string;
    address: string;
    totalActiveStudents: number;
    totalPresenceToday: number;
    totalAbsenceToday: number;
    registeredAt: string;
    logoImagePath: string,
};


const UserDashboardPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [schoolLoading, setSchoolLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
        }

        const fetchUserAndSchoolData = async () => {
            try {
                if (user.school_id) {
                    setSchoolLoading(true);

                    const date = new Date().toISOString().split('T')[0];

                    const [schoolRes, staticRes, dailyRes] = await Promise.all([
                        schoolService.getById(user.school_id),
                        dashboardService.getStaticStatistics(),
                        dashboardService.getDailyStatistics(date, 1)
                    ]);

                    setSchoolData({
                        id: schoolRes.data.id!,
                        name: schoolRes.data.name,
                        plan: staticRes.data.subscription_packet.subscription_name,
                        latest_subscription: schoolRes.data.latest_subscription,
                        status: 'Active',
                        address: schoolRes.data.address,
                        totalActiveStudents: staticRes.data.active_students ?? 0,
                        totalPresenceToday: dailyRes.data.presence ?? 0,
                        totalAbsenceToday: dailyRes.data.absence ?? 0,
                        registeredAt: schoolRes.data.created_at!,
                        logoImagePath: schoolRes.data.logo_image_path!,
                    });
                }
            } catch (error) {
                if ((error as any).response && ((error as any).response.status === 401 || (error as any).response.status === 403)) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
                setSchoolLoading(false);
            }
        };

        fetchUserAndSchoolData();
    }, []);


    const handleDashboard = () => {
        if (schoolData) navigate(`/school/${formatSchoolName(schoolData.name)}/dashboard`);
    };

    const handleAttendanceIn = () => {
        if (schoolData) navigate(`/school/attendance`);
    };

    return (
        <div className="grid gap-4">
            {schoolData ? (
                <>
                    <div className="col-12">
                        <Panel header="Sekolah yang dikelola">
                            <div className="grid grid-nogutter">
                                <div className="col-12 md:col-6 p-6">
                                    <div className="flex gap-4 items-center">
                                        <img
                                            src={logoImage}
                                            alt={`${schoolData.name} logo`}
                                            className="h-4rem  w-4rem object-cover rounded-full"
                                        />
                                        <h1 className="text-4xl font-bold my-auto">{schoolData.name}</h1>
                                    </div>
                                    <div className="mt-4 text-lg">
                                        <div className="mb-3 flex">
                                            <i className="pi pi-info-circle text-xl mr-2"></i>
                                            <div className='flex'>
                                                <strong className='mr-2'>Status:</strong>
                                                <span>{schoolData.status}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-map-marker text-xl mr-2"></i>
                                            <div className='flex sm:flex-row flex-column'>
                                                <strong className='mr-2 white-space-nowrap'>Alamat:</strong>
                                                <span>{schoolData.address}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-calendar text-xl mr-2"></i>
                                            <div className='flex sm:flex-row flex-column'>
                                                <strong className='mr-2 white-space-nowrap'>Terdaftar Sejak:</strong>
                                                <span>{new Date(schoolData.registeredAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-calendar-times text-xl mr-2"></i>
                                            <div className='flex sm:flex-row flex-column'>
                                                <strong className='mr-2 white-space-nowrap'>Terakhir Berlangganan:</strong>
                                                <span>{schoolData.latest_subscription}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <i className="pi pi-box text-xl mr-2"></i>
                                            <strong>Paket:</strong>
                                            <Tag
                                                id="package-tooltip"
                                                value={schoolData.plan}
                                                severity="info"
                                                className="cursor-pointer text-lg ml-2"
                                                data-pr-tooltip={
                                                    "Fitur yang Didapatkan:\n" +
                                                    "- Manajemen Presensi Siswa\n" +
                                                    "- Rekap Data Kehadiran\n" +
                                                    "- Dashboard Statistik\n" +
                                                    "- Laporan Otomatis"
                                                }
                                            />
                                            <Tooltip target="#package-tooltip" position="right" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12  md:col-6 p-4">
                                    <div className="grid h-full">
                                        <div className="col-12 flex flex-column gap-3">
                                            <div className="grid gap-4 h-full">
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <i className="pi pi-users text-blue-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalActiveStudents}</p>
                                                    <label className="text-lg">Jumlah siswa aktif</label>
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <i className="pi pi-address-book text-green-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalPresenceToday}</p>
                                                    <label className="text-lg">Jumlah presensi hari ini</label>
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <i className="pi pi-user-minus text-orange-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalAbsenceToday}</p>
                                                    <label className="text-lg">Jumlah absensi hari ini</label>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className="flex gap-3 sm:flex-row flex-column">
                                <Button
                                    label="Dashboard Sekolah"
                                    icon="pi pi-home"
                                    className="p-button p-button-primary"
                                    onClick={handleDashboard}
                                />
                                <Button
                                    label="Daftar Presensi Hari Ini"
                                    icon="pi pi-sign-in"
                                    className="p-button p-button-success"
                                    onClick={handleAttendanceIn}
                                />
                                {/* <Button
                                    label="Absen Masuk"
                                    icon="pi pi-sign-in"
                                    className="p-button p-button-success"
                                    onClick={handleAttendanceIn}
                                />
                                <Button
                                    label="Absen Keluar"
                                    icon="pi pi-sign-out"
                                    className="p-button p-button-warning"
                                    onClick={handleAttendanceOut}
                                /> */}
                            </div>
                        </Panel>
                    </div>
                </>
            ) : (
                <div className="col-12">
                    {!loading ? <Card className='shadow-1' title="Selamat Datang di Presentia">
                        <p className="text-sm mb-4">
                            Anda belum memiliki sekolah yang terdaftar. Buat sekolah untuk memulai pengelolaan presensi.
                        </p>
                        <Button
                            icon="pi pi-plus"
                            label="Buat Sekolah"
                            className="p-button-success"
                            onClick={() => setModalVisible(true)}
                        />
                    </Card> :
                        <Panel header={<Skeleton width="60%" height="2rem" />}>
                            <div className="grid grid-nogutter">
                                <div className="col-12 md:col-6 p-6">
                                    <div className="flex gap-4 items-center">
                                        <Skeleton shape="circle" size="4rem" />
                                        <Skeleton width="60%" height="2rem" />
                                    </div>
                                    <div className="mt-4 text-lg">
                                        <div className="mb-3 flex">
                                            <i className="pi pi-info-circle text-xl mr-2"></i>
                                            <Skeleton width="40%" height="1.5rem" />
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-map-marker text-xl mr-2"></i>
                                            <Skeleton width="60%" height="1.5rem" />
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-calendar text-xl mr-2"></i>
                                            <Skeleton width="50%" height="1.5rem" />
                                        </div>
                                        <div className="mb-3 flex">
                                            <i className="pi pi-calendar-times text-xl mr-2"></i>
                                            <Skeleton width="50%" height="1.5rem" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-6 p-4">
                                    <div className="grid h-full">
                                        <div className="col-12 flex flex-column gap-3">
                                            <div className="grid gap-4 h-full">
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <Skeleton shape="circle" size="3rem" />
                                                    <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                    <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <Skeleton shape="circle" size="3rem" />
                                                    <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                    <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                    <Skeleton shape="circle" size="3rem" />
                                                    <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                    <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className="flex gap-3 sm:flex-row flex-column">
                                <Skeleton width="30%" height="2.5rem" />
                                <Skeleton width="30%" height="2.5rem" />
                            </div>
                        </Panel>
                    }

                </div>
            )}

            {/* <UserCreateSchoolModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(newSchool: SchoolData) => {
                    setSchoolData(newSchool);
                    setModalVisible(false);
                }}
            /> */}
        </div>
    );
};

export default UserDashboardPage;
