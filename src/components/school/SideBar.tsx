import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';

const SideBar = () => {
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
                { label: 'Waktu Presensi Siswa', icon: 'pi pi-list', command: () => navigate('/attendance/time'), className: currentPath === '/attendance/time' ? 'active-route' : 'menu-item' },
                { label: 'Daftar Status Presensi', icon: 'pi pi-list', command: () => navigate('/attendance/type'), className: currentPath === '/attendance/type' ? 'active-route' : 'menu-item' },
            ]
        },
        {
            label: 'Kelas',
            items: [{ label: 'Daftar Kelas', icon: 'pi pi-book', command: () => navigate('/school/classroom'), className: currentPath === '/school/classroom' ? 'active-route' : 'menu-item' }]
        },
        {
            label: 'Pencapaian',
            items: [
                { label: 'Daftar Pencapaian', icon: 'pi pi-book', command: () => navigate('/achievement'), className: currentPath === '/achievement' ? 'active-route' : 'menu-item' },
                { label: 'Data Pencapaian Siswa', icon: 'pi pi-book', command: () => navigate('/achievement/student'), className: currentPath === '/achievement/student' ? 'active-route' : 'menu-item' }
            ]
        },
        {
            label: 'Pelanggaran',
            items: [
                { label: 'Daftar Pelanggaran', icon: 'pi pi-book', command: () => navigate('/violation'), className: currentPath === '/violation' ? 'active-route' : 'menu-item' },
                { label: 'Data Pelanggaran Siswa', icon: 'pi pi-book', command: () => navigate('/violation/student'), className: currentPath === '/violation/student' ? 'active-route' : 'menu-item' },
                { label: 'Lapor Poin Siswa', icon: 'pi pi-book', command: () => navigate('/violation/studentpointreport'), className: currentPath === '/violation/studentpointreport' ? 'active-route' : 'menu-item' },
            ]
        },
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} />
        </div>
    );
};

export default SideBar;
