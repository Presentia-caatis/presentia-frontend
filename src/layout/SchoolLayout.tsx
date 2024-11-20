import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import Topbar from '../components/school/SchoolTopBar';
import SideBar from '../components/school/SchoolSideBar';
import Footer from '../components/school/SchoolFooter';

const SchoolLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    return (
        <div className={`layout-wrapper layout-static ${containerClass}`}>
            <Topbar />
            <div className="layout-sidebar">
                <SideBar />
            </div>
            <div className="layout-main-container">
                <div className="layout-main">
                    <Outlet />
                </div>
                <Footer />
            </div>
            <LayoutConfigSidebar />
            <div className="layout-mask"></div>
        </div>
    );
};

export default SchoolLayout;
