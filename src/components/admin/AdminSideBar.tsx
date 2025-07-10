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
                },
                {
                    label: 'Daftar Sekolah',
                    icon: 'pi pi-fw pi-building',
                    command: () => navigate('/admin/schools'),
                    className: currentPath === '/admin/schools' ? 'active-route' : 'menu-item'
                },
                {
                    label: 'Daftar Langganan',
                    icon: 'pi pi-fw pi-money-bill',
                    command: () => navigate('/admin/subscriptions'),
                    className: currentPath === '/admin/subscriptions' ? 'active-route' : 'menu-item'
                },
            ]
        },
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} />
        </div>
    );
};

export default AdminSideBar;
