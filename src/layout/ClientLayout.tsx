import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import ClientSideBar from '../components/client/ClientSideBar';
import ClientFooter from '../components/client/ClientFooter';
import ClientTopBar from '../components/client/ClientTopBar';

const ClientLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    return (
        <div className={`layout-wrapper layout-static ${containerClass}`}>
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
