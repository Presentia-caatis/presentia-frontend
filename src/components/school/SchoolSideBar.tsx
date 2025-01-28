import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import { formatSchoolName } from '../../utils/formatSchoolName';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';

const SchoolSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { school, loading } = useSchool();

    if (loading) {
        return (
            <div className="layout-sidebar">
                <Skeleton height="1rem" width="100%" className="mb-4 mt-4" />
                <Skeleton height="1rem" width="100%" className="mb-4" />
                <Skeleton height="1rem" width="100%" className="mb-4" />
                <Skeleton height="1rem" width="100%" className="mb-4" />
                <Skeleton height="1rem" width="100%" className="mb-4" />
            </div>
        );
    }

    const schoolName = formatSchoolName(school.name);

    const model = [
        {
            label: 'Dashboard',
            items: [
                {
                    label: 'Halaman Utama',
                    icon: 'pi pi-fw pi-home',
                    command: () => navigate(`/school/${schoolName}/dashboard`),
                    className: currentPath === `/school/${schoolName}/dashboard` ? 'active-route' : 'menu-item',
                },
            ],
        },
        {
            label: 'Siswa',
            items: [
                {
                    label: 'Daftar Siswa',
                    icon: 'pi pi-users',
                    command: () => navigate(`/school/${schoolName}/student`),
                    className: currentPath === `/school/${schoolName}/student` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Daftar Presensi Siswa Hari Ini',
                    icon: 'pi pi-users',
                    command: () => window.open(`${window.origin}/school/attendance`, '_blank'),
                    className: currentPath === `/school/attendance` ? 'active-route' : 'menu-item',
                },
            ],
        },
        {
            label: 'Presensi',
            items: [
                {
                    label: 'Rekam Presensi Siswa',
                    icon: 'pi pi-book',
                    command: () => navigate(`/school/${schoolName}/attendance-record`),
                    className: currentPath === `/school/${schoolName}/attendance-record` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Rekam Absensi Siswa',
                    icon: 'pi pi-book',
                    command: () => navigate(`/school/${schoolName}/attendance-record-result`),
                    className: currentPath === `/school/${schoolName}/attendance-record-result` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Custom Event Baru',
                    icon: 'pi pi-book',
                    command: () => navigate(`/school/${schoolName}/custom-event`),
                    className: currentPath === `/school/${schoolName}/custom-event` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Set Waktu Presensi Siswa',
                    icon: 'pi pi-list',
                    command: () => navigate(`/school/${schoolName}/default-attendance-time`),
                    className: currentPath === `/school/${schoolName}/default-attendance-time` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Daftar Status Absensi',
                    icon: 'pi pi-list',
                    command: () => navigate(`/school/${schoolName}/attendance/status`),
                    className: currentPath === `/school/${schoolName}/attendance/status` ? 'active-route' : 'menu-item',
                },
            ],
        },
        {
            label: 'Kelas',
            items: [
                {
                    label: 'Daftar Kelas',
                    icon: 'pi pi-book',
                    command: () => navigate(`/school/${schoolName}/classroom`),
                    className: currentPath === `/school/${schoolName}/classroom` ? 'active-route' : 'menu-item',
                },
            ],
        },
        {
            label: 'Admin',
            items: [
                {
                    label: 'Mendaftarkan Sidik Jari',
                    icon: 'pi pi-book',
                    command: () => navigate(`/school/${schoolName}/fingerprint`),
                    className: currentPath === `/school/${schoolName}/fingerprint` ? 'active-route' : 'menu-item',
                },
            ],
        },
    ];

    if (!school) {
        return <div className="layout-sidebar flex justify-content-center align-items-center">
            <ProgressSpinner />
        </div>;
    }

    return (
        <div className="layout-sidebar">
            <Menu model={model} />
        </div>
    );
};

export default SchoolSideBar;
