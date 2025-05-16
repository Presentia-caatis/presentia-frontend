import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';

const UserSideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const model = [
        {
            label: 'Menu Utama',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    command: () => navigate('/user/dashboard'),
                    className: currentPath === '/user/dashboard' ? 'active-route' : 'menu-item'
                },
                // {
                //     label: 'Pembayaran',
                //     icon: 'pi pi-fw pi-receipt',
                //     command: () => navigate('/user/dashboard/billing'),
                //     className: currentPath === '/user/dashboard/billing' ? 'active-route' : 'menu-item'
                // },
                {
                    label: 'Bantuan',
                    icon: 'pi pi-fw pi-headphones',
                    command: () => navigate('/user/dashboard/support'),
                    className: currentPath === '/user/dashboard/support' ? 'active-route' : 'menu-item'
                }
            ]
        },
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} className='w-full' />
        </div>
    );
};

export default UserSideBar;
