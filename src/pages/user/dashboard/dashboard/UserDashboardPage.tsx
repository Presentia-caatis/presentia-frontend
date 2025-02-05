    import { useEffect, useState } from 'react';
    import { Button } from 'primereact/button';
    import { useNavigate } from 'react-router-dom';
    import { Card } from 'primereact/card';
    import { Divider } from 'primereact/divider';
    import { Tag } from 'primereact/tag';
    import { Tooltip } from 'primereact/tooltip';
    import { Panel } from 'primereact/panel';
    import UserCreateSchoolModal from '../../../../components/user/UserCreateSchoolModal';
    import { ProgressSpinner } from 'primereact/progressspinner';
    import schoolService from '../../../../services/schoolService';
    import { useAuth } from '../../../../context/AuthContext';
    import SchoolStudentAttendanceList from '../../../../components/school/SchoolStudentAttendanceList';
    import logoImage from '../../../../assets/Logo-SMK-10-Bandung.png';
    import dashboardService from '../../../../services/dashboardService';
    import { formatSchoolName } from '../../../../utils/formatSchoolName';

type SchoolData = {
    id: number;
    name: string;
    plan: string;
    latest_subscription: string;
    status: string;
    address: string;
    totalStudents: number;
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
        const { user } = useAuth();
        const [totalAttendance, setTotalAttendance] = useState(0);

        const handleAttendanceUpdate = (total: number) => {
            setTotalAttendance(total);
        };

        useEffect(() => {
            if (!user) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const fetchUserAndSchoolData = async () => {
                try {
                    console.log(user.school_id);
                    if (user.school_id) {
                        const school = await schoolService.getById(user.school_id!);

                        const staticSchoolData = await dashboardService.getStaticStatistics();
                        console.log(staticSchoolData.data);

                    setSchoolData({
                        id: school.data.id!,
                        name: school.data.name,
                        plan: 'Premium',
                        latest_subscription: school.data.latest_subscription,
                        status: 'Active',
                        address: school.data.address,
                        totalStudents: staticSchoolData.data.active_students,
                        registeredAt: school.data.created_at!,
                        logoImagePath: school.data.logo_image_path!,
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

            fetchUserAndSchoolData();
        }, [token, navigate]);


        const handleDashboard = () => {
            if (schoolData) navigate(`/school/${formatSchoolName(schoolData.name)}/dashboard`);
        };

        const handleAttendanceIn = () => {
            if (schoolData) navigate(`/school/attendance`);
        };

        const handleAttendanceOut = () => {
            if (schoolData) navigate(`/school/student/attendance/out`);
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

                                    <div className="col-12 md:col-6 p-4">
                                        <div className="grid">
                                            <div className="col-12 flex flex-column gap-3">
                                                <div className="grid gap-4">
                                                    <Card className="flex flex-column shadow-1 text-center align-items-center gap-2 p-3 col">
                                                        <i className="pi pi-users text-blue-500 text-4xl"></i>
                                                        <p className="text-3xl font-bold">{schoolData.totalStudents}</p>
                                                        <label className="text-lg">Jumlah siswa aktif</label>
                                                    </Card>
                                                    <Card className="flex flex-column shadow-1 text-center align-items-center gap-2 p-3 col">
                                                        <i className="pi pi-address-book text-green-500 text-4xl"></i>
                                                        <p className="text-3xl font-bold">{totalAttendance}</p>
                                                        <label className="text-lg">Jumlah presensi hari ini</label>
                                                    </Card>
                                                    <Card className="flex flex-column shadow-1 text-center align-items-center gap-2 p-3 col">
                                                        <i className="pi pi-user-minus text-orange-500 text-4xl"></i>
                                                        <p className="text-3xl font-bold">{schoolData.totalStudents - totalAttendance}</p>
                                                        <label className="text-lg">Jumlah absensi hari ini</label>
                                                    </Card>
                                                </div>
                                                <div className='grid mt-2'>
                                                    <SchoolStudentAttendanceList onAttendanceUpdate={handleAttendanceUpdate} />
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
                            <Card className='shadow-1'>
                                <div className="col-12 flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                                    <ProgressSpinner />
                                </div>
                            </Card>
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
