import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Panel } from 'primereact/panel';
import ClientCreateSchoolModal from '../../../../components/client/ClientCreateSchoolModal';


type SchoolData = {
    id: number;
    name: string;
    plan: string;
    dueDate: string;
    status: string;
    address: string;
    totalStudents: number;
    registeredAt: string;
};

type UserData = {
    id: number;
    school_id: number | null;
    role: string;
    email: string;
    username: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
};


const ClientDashboardPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userData, setUserData] = useState<UserData | null>(null);
    const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
        }

        const dummyUserData: UserData = {
            id: 1,
            school_id: 1,
            role: 'Admin',
            email: 'user@example.com',
            username: 'JohnDoe',
            email_verified_at: '2024-01-01T00:00:00Z',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
        };

        const dummySchoolData: SchoolData = {
            id: 1,
            name: 'Sekolah Harapan Bangsa',
            plan: 'Premium',
            dueDate: '2024-02-01',
            status: 'Active',
            address: 'Jl. Merdeka No. 1, Jakarta',
            totalStudents: 1200,
            registeredAt: '2023-01-01',
        };

        setTimeout(() => {
            setUserData(dummyUserData);
            if (dummyUserData.school_id) {
                setSchoolData(dummySchoolData);
            }
        }, 1000);
    }, [token]);

    const handleDashboard = () => {
        if (schoolData) navigate(`/school/${schoolData.id}/mainpage`);
    };

    const handleAttendanceIn = () => {
        if (schoolData) navigate(`/school/${schoolData.id}/student/attendance/in`);
    };

    const handleAttendanceOut = () => {
        if (schoolData) navigate(`/school/${schoolData.id}/student/attendance/out`);
    };

    const eventDetail = {
        isEvent: true,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    const studentAttendance = [
        { name: 'John Doe', time: '08:10' },
        { name: 'Jane Smith', time: '08:20' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
        { name: 'Alice Johnson', time: '08:30' },
    ];

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();


    return (
        <div className="grid gap-4">
            {schoolData ? (
                <>
                    <div className="col-12">
                        <Panel header="Sekolah yang dikelola">
                            <div className="grid grid-nogutter">
                                <div className="col-12 md:col-6 p-6">
                                    <div className="flex gap-4 items-center">
                                        <h1 className="text-4xl font-bold ml-2">{schoolData.name}</h1>
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
                                                <strong className='mr-2 white-space-nowrap'>Jatuh Tempo Paket:</strong>
                                                <span>{new Date(schoolData.dueDate).toLocaleDateString()}</span>
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
                                                    <i className="pi pi-users text-orange-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalStudents}</p>
                                                    <label className="text-lg">Total Siswa Aktif</label>
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center align-items-center gap-2 p-3 col">
                                                    <i className="pi pi-users text-blue-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalStudents}</p>
                                                    <label className="text-lg">Total Siswa Baru</label>
                                                </Card>
                                                <Card className="flex flex-column shadow-1 text-center align-items-center gap-2 p-3 col">
                                                    <i className="pi pi-users text-green-500 text-4xl"></i>
                                                    <p className="text-3xl font-bold">{schoolData.totalStudents}</p>
                                                    <label className="text-lg">Total Kelas Baru</label>
                                                </Card>
                                            </div>
                                            <div className='grid mt-2'>
                                                <Card className="text-center shadow-1 col-12 py-0">
                                                    <div className="flex justify-content-between align-items-center mb-4">
                                                        <div>
                                                            <h5>{formattedDate}</h5>
                                                            <p>{formattedTime}</p>
                                                        </div>
                                                        <div className="sm:block hidden">
                                                            <h4>Daftar Absen Masuk Siswa</h4>
                                                            <p className="text-sm text-secondary">Batas waktu absen masuk: 07:00</p>
                                                        </div>
                                                        <div>
                                                            {eventDetail.isEvent ? (
                                                                <Tag
                                                                    value="Sedang Event"
                                                                    severity="info"
                                                                    id="event-tooltip"
                                                                    className="cursor-pointer"
                                                                    data-pr-tooltip={`Event: ${eventDetail.name}\nJam Masuk: ${eventDetail.startTime}\nJam Keluar: ${eventDetail.endTime}`}
                                                                />
                                                            ) : (
                                                                <Tag value="Tidak Ada Event" severity="secondary" />
                                                            )}
                                                            <Tooltip target="#event-tooltip" position="left" />
                                                        </div>
                                                    </div>
                                                    <div className="sm:hidden block mb-2">
                                                        <h4>Daftar Absen Masuk Siswa</h4>
                                                        <p className="text-sm text-secondary">Batas waktu absen masuk: 07:00</p>
                                                    </div>
                                                    <ul
                                                        className="list-none p-2 m-0"
                                                        style={{ maxHeight: '180px', overflowY: 'auto' }}
                                                    >
                                                        {studentAttendance.map((student, index) => (
                                                            <li
                                                                key={index}
                                                                className="py-1 flex justify-content-between align-items-center text-sm surface-border"
                                                            >
                                                                <span className="font-bold">{index + 1}. {student.name}</span>
                                                                <span>{student.time}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
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
                                />
                            </div>
                        </Panel>
                    </div>
                </>
            ) : (
                <div className="col-12">
                    <Card title="Selamat Datang di Presentia">
                        <p className="text-sm mb-4">
                            Anda belum memiliki sekolah yang terdaftar. Buat sekolah untuk memulai pengelolaan presensi.
                        </p>
                        <Button
                            icon="pi pi-plus"
                            label="Buat Sekolah"
                            className="p-button-success"
                            onClick={() => setModalVisible(true)}
                        />
                    </Card>
                </div>
            )}

            <ClientCreateSchoolModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(newSchool: SchoolData) => {
                    setSchoolData(newSchool);
                    setModalVisible(false);
                }}
            />
        </div>

    );
};

export default ClientDashboardPage;
