import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';

const SchoolSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const model = [
        {
            label: 'Dashboard',
            items: [
                {
                    label: 'Halaman Utama',
                    icon: 'pi pi-fw pi-home',
                    command: () => navigate('/school/mainpage'),
                    className: currentPath === '/school/mainpage' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Siswa',
            items: [
                {
                    label: 'Daftar Siswa',
                    icon: 'pi pi-users',
                    command: () => navigate('/school/student'),
                    className: currentPath === '/school/student' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Kedatangan Presensi Siswa',
                    icon: 'pi pi-users',
                    command: () => window.open(`${window.origin}/school/student/attendance/in`, '_blank'),
                    className: currentPath === '/student/attendance/in' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Kepulangan Presensi Siswa',
                    icon: 'pi pi-users',
                    command: () => window.open(`${window.origin}/school/student/attendance/out`, '_blank'),
                    className: currentPath === '/student/attendance/out' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Presensi',
            items: [
                { label: 'Rekam Presensi Siswa', icon: 'pi pi-book', command: () => navigate('/school/attendance-record'), className: currentPath === '/school/attendance-record' ? 'active-route' : 'menu-item' },
                { label: 'Rekam Absensi Siswa', icon: 'pi pi-book', command: () => navigate('/school/attendance-record-result'), className: currentPath === '/school/attendance-record-result' ? 'active-route' : 'menu-item' },
                { label: 'Custom Event Baru', icon: 'pi pi-book', command: () => navigate('/school/custom-event'), className: currentPath === '/school/custom-event' ? 'active-route' : 'menu-item' },
                { label: 'Set Waktu Presensi Siswa', icon: 'pi pi-list', command: () => navigate('/school/default-attendance-time'), className: currentPath === '/school/default-attendance-time' ? 'active-route' : 'menu-item' },
                { label: 'Daftar Status Presensi', icon: 'pi pi-list', command: () => navigate('/school/attendance/status'), className: currentPath === '/school/attendance/status' ? 'active-route' : 'menu-item' },
            ]
        },
        {
            label: 'Kelas',
            items: [{ label: 'Daftar Kelas', icon: 'pi pi-book', command: () => navigate('/school/classroom'), className: currentPath === '/school/classroom' ? 'active-route' : 'menu-item' }]
        },
        {
            label: 'Pencapaian',
            items: [
                { label: 'Daftar Pencapaian', icon: 'pi pi-book', command: () => navigate('/school/achievement'), className: currentPath === '/school/achievement' ? 'active-route' : 'menu-item' },
                { label: 'Daftar Pencapaian Siswa', icon: 'pi pi-book', command: () => navigate('/school/achievement/student'), className: currentPath === '/school/achievement/student' ? 'active-route' : 'menu-item' }
            ]
        },
        {
            label: 'Pelanggaran',
            items: [
                { label: 'Daftar Pelanggaran', icon: 'pi pi-book', command: () => navigate('/school/violation'), className: currentPath === '/school/violation' ? 'active-route' : 'menu-item' },
                { label: 'Data Pelanggaran Siswa', icon: 'pi pi-book', command: () => navigate('/school/violation/student'), className: currentPath === '/school/violation/student' ? 'active-route' : 'menu-item' },
                { label: 'Lapor Poin Siswa', icon: 'pi pi-book', command: () => navigate('/school/violation/student-point-report'), className: currentPath === '/school/violation/student-point-report' ? 'active-route' : 'menu-item' },
            ]
        },
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} />
        </div>
    );
};

export default SchoolSideBar;
