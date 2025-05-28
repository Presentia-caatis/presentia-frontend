import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import UserSideBar from '../components/user/UserSideBar';
import UserFooter from '../components/user/UserFooter';
import UserTopBar from '../components/user/UserTopBar';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import AdminSideBar from '../components/admin/AdminSideBar';

const UserLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    const location = useLocation();

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.roles.includes('super_admin')) {
            const currentPath = location.pathname;
            if (!currentPath.includes('/user/profile')) {
                navigate('*', { replace: true });
            }
        }
    }, [user, navigate, location]);


    const getTitle = () => {
        switch (location.pathname) {
            case '/user/dashboard':
                return 'Dashboard - Presentia';
            case '/user/dashboard/billing':
                return 'Pembayaran - Presentia';
            case '/user/invoice':
                return 'Invoice - Presentia';
            case '/user/dashboard/support':
                return 'Support - Presentia';
            case '/user/profile':
                return 'Profile - Presentia';
            default:
                return 'Presentia';
        }
    };

    return (
        <div className={`layout-wrapper layout-static ${containerClass}`}>
            <Helmet>
                <title>{getTitle()}</title>
            </Helmet>
            <UserTopBar />
            {user?.roles.includes('super_admin') ? <div className="layout-sidebar">
                <AdminSideBar />
            </div> : (
                <div className="layout-sidebar">
                    <UserSideBar />
                </div>
            )}

            <div className="layout-main-container">
                <div className="layout-main">
                    <Outlet />
                </div>
                <UserFooter />
            </div>
            <LayoutConfigSidebar />
            <div className="layout-mask"></div>
        </div>
    );
};

export default UserLayout;
