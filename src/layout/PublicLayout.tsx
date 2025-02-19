import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import Footer from '../components/school/SchoolFooter';
import PublicTopbar from '../components/public/PublicTopBar';

const PublicLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    return (
        <div className={`layout-wrapper ${containerClass}`}>
            <PublicTopbar />
            <div className="layout-main-container">
                <Outlet />
                <Footer />
            </div>
            <LayoutConfigSidebar />
            <div className="layout-mask"></div>
        </div>
    );
};

export default PublicLayout;
