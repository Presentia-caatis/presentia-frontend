import { Menu } from 'primereact/menu';
import { Sidebar } from 'primereact/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLayoutConfig } from '../../context/LayoutConfigContext';
import { useEffect } from 'react';

const AdminSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
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

export default AdminSideBar;
