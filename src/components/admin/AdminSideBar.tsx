import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminSideBar = () => {
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
                    command: () => navigate('/admin/mainpage'),
                    className: currentPath === '/admin/mainpage' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Manajemen Sekolah',
            items: [
                {
                    label: 'Daftar Sekolah',
                    icon: 'pi pi-fw pi-building',
                    command: () => navigate('/admin/schools'),
                    className: currentPath === '/admin/schools' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Tambah Sekolah',
                    icon: 'pi pi-fw pi-plus',
                    command: () => navigate('/admin/add-school'),
                    className: currentPath === '/admin/add-school' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Kontrol Fitur Sekolah',
            items: [
                {
                    label: 'Pengaturan Fitur Presensi',
                    icon: 'pi pi-fw pi-cog',
                    command: () => navigate('/admin/attendance-settings'),
                    className: currentPath === '/admin/attendance-settings' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Custom Event',
                    icon: 'pi pi-fw pi-calendar',
                    command: () => navigate('/admin/custom-events'),
                    className: currentPath === '/admin/custom-events' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Pengaturan Jadwal Presensi',
                    icon: 'pi pi-fw pi-clock',
                    command: () => navigate('/admin/schedule-settings'),
                    className: currentPath === '/admin/schedule-settings' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Laporan & Statistik',
            items: [
                {
                    label: 'Statistik Sekolah',
                    icon: 'pi pi-fw pi-chart-bar',
                    command: () => navigate('/admin/school-stats'),
                    className: currentPath === '/admin/school-stats' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Laporan Kehadiran',
                    icon: 'pi pi-fw pi-file',
                    command: () => navigate('/admin/attendance-reports'),
                    className: currentPath === '/admin/attendance-reports' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Manajemen Pengguna',
            items: [
                {
                    label: 'Daftar Admin Sekolah',
                    icon: 'pi pi-fw pi-users',
                    command: () => navigate('/admin/school-admins'),
                    className: currentPath === '/admin/school-admins' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Tambah Admin Sekolah',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => navigate('/admin/add-school-admin'),
                    className: currentPath === '/admin/add-school-admin' ? 'active-route' : 'menu-item'
                }
            ]
        },
        {
            label: 'Pengaturan Subscription',
            items: [
                {
                    label: 'Daftar Subscription',
                    icon: 'pi pi-fw pi-money-bill',
                    command: () => navigate('/admin/subscriptions'),
                    className: currentPath === '/admin/subscriptions' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Kelola Harga Subscription',
                    icon: 'pi pi-fw pi-wallet',
                    command: () => navigate('/admin/manage-pricing'),
                    className: currentPath === '/admin/manage-pricing' ? 'active-route' : 'menu-item'
                }
            ]
        }
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} />
        </div>
    );
};

export default AdminSideBar;
