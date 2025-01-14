import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import ClientSideBar from '../components/client/ClientSideBar';
import ClientFooter from '../components/client/ClientFooter';
import ClientTopBar from '../components/client/ClientTopBar';
import { Helmet } from 'react-helmet';

const ClientLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    const location = useLocation();

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    const getTitle = () => {
        switch (location.pathname) {
            case '/client/dashboard':
                return 'Dashboard - Presentia';
            case '/client/dashboard/billing':
                return 'Pembayaran - Presentia';
            case '/client/invoice':
                return 'Invoice - Presentia';
            case '/client/dashboard/support':
                return 'Support - Presentia';
            case '/client/profile':
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
            <ClientTopBar />
            <div className="layout-sidebar">
                <ClientSideBar />
            </div>
            <div className="layout-main-container">
                <div className="layout-main">
                    <Outlet />
                </div>
                <ClientFooter />
            </div>
            <LayoutConfigSidebar />
            <div className="layout-mask"></div>
        </div>
    );
};

export default ClientLayout;
