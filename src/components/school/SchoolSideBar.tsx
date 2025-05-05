import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import { formatSchoolName } from '../../utils/formatSchoolName';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useLayoutConfig } from '../../context/LayoutConfigContext';
import { Sidebar } from 'primereact/sidebar';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const SchoolSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { school, schoolLoading } = useSchool();
    const { user } = useAuth();
    const { isSidebarVisible, setIsSidebarVisible } = useLayoutConfig();
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarVisible(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (schoolLoading) {
        return (
            <div className="layout-sidebar">
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} height="1rem" width="100%" className="mb-4 mt-4" />
                ))}
            </div>
        );
    }


    const schoolName = school ? formatSchoolName(school.name) : 'Loading...';

    const model = [
        {
            label: 'Dashboard',
            items: [
                {
                    label: 'Halaman Utama',
                    icon: 'pi pi-home',
                    command: () => navigate(`/school/${schoolName}/dashboard`),
                    className: currentPath === `/school/${schoolName}/dashboard` ? 'active-route' : 'menu-item',
                },
                ...(user?.roles.some(role => ['super_admin', 'schools_admin'].includes(role)) ? [
                    {
                        label: 'Presensi Manual',
                        icon: 'pi pi-address-book',
                        command: () => window.open(`${window.origin}/school/student/attendance/in`, '_blank'),
                        className: currentPath === `/school/student/attendance/in` ? 'active-route' : 'menu-item',
                    },
                ] : [])
                ,
                {
                    label: 'Presensi Hari Ini',
                    icon: 'pi pi-calendar',
                    command: () => window.open(`${window.origin}/school/attendance`, '_blank'),
                    className: currentPath === `/school/attendance` ? 'active-route' : 'menu-item',
                },
            ],
        },
        {
            label: 'Manajemen Data',
            items: [
                {
                    label: 'Daftar Siswa',
                    icon: 'pi pi-users',
                    command: () => navigate(`/school/${schoolName}/student`),
                    className: currentPath === `/school/${schoolName}/student` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Daftar Kelas',
                    icon: 'pi pi-th-large',
                    command: () => navigate(`/school/${schoolName}/classroom`),
                    className: currentPath === `/school/${schoolName}/classroom` ? 'active-route' : 'menu-item',
                },
                ...(user?.roles.some(role => ['super_admin', 'schools_admin'].includes(role)) ? [
                    {
                        label: 'Daftar Sidik Jari',
                        icon: 'pi pi-key',
                        command: () => navigate(`/school/${schoolName}/fingerprint`),
                        className: currentPath === `/school/${schoolName}/fingerprint` ? 'active-route' : 'menu-item',
                    }
                ] : [])
            ],
        },
        {
            label: 'Konfigurasi Presensi',
            items: [
                {
                    label: 'Kehadiran Siswa',
                    icon: 'pi pi-users',
                    command: () => navigate(`/school/${schoolName}/attendance`),
                    className: currentPath === `/school/${schoolName}/attendance` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Kelola Acara Sekolah',
                    icon: 'pi pi-calendar-plus',
                    command: () => navigate(`/school/${schoolName}/custom-event`),
                    className: currentPath === `/school/${schoolName}/custom-event` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Konfigurasi Waktu Presensi',
                    icon: 'pi pi-clock',
                    command: () => navigate(`/school/${schoolName}/default-attendance-time`),
                    className: currentPath === `/school/${schoolName}/default-attendance-time` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Daftar Status Presensi',
                    icon: 'pi pi-check-circle',
                    command: () => navigate(`/school/${schoolName}/check-in/status`),
                    className: currentPath === `/school/${schoolName}/check-in/status` ? 'active-route' : 'menu-item',
                },
                {
                    label: 'Daftar Status Absensi',
                    icon: 'pi pi-times-circle',
                    command: () => navigate(`/school/${schoolName}/absence-permit/type`),
                    className: currentPath === `/school/${schoolName}/absence-permit/type` ? 'active-route' : 'menu-item',
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
        <>
            <div className="layout-sidebar hidden md:block">
                <Menu model={model} />
            </div>
            <Sidebar
                visible={isSidebarVisible}
                onHide={() => setIsSidebarVisible(false)}
                className="block lg:hidden pr-6"
            >
                <Menu className='mb-6 text-xs' model={model} />
            </Sidebar>
        </>
    );
};

export default SchoolSideBar;
