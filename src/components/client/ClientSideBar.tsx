import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';

const ClientSideBar = () => {
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
                    command: () => navigate('/client/dashboard'),
                    className: currentPath === '/client/dashboard' ? 'active-route' : 'menu-item'
                },
                // {
                //     label: 'Pembayaran',
                //     icon: 'pi pi-fw pi-receipt',
                //     command: () => navigate('/client/dashboard/billing'),
                //     className: currentPath === '/client/dashboard/billing' ? 'active-route' : 'menu-item'
                // },
                // {
                //     label: 'Support',
                //     icon: 'pi pi-fw pi-headphones',
                //     command: () => navigate('/client/dashboard/support'),
                //     className: currentPath === '/client/dashboard/support' ? 'active-route' : 'menu-item'
                // }
            ]
        },
    ];

    return (
        <div className="layout-sidebar">
            <Menu model={model} className='w-full' />
        </div>
    );
};

export default ClientSideBar;
