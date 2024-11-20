import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLayoutConfig } from '../context/LayoutConfigContext';
import AdminTopbar from '../components/admin/AdminTopBar';
import AdminSideBar from '../components/admin/AdminSideBar';
import AdminFooter from '../components/admin/AdminFooter';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';

const AdminLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    return (
        <div className={`layout-wrapper layout-static ${containerClass}`}>
            <AdminTopbar />
            <div className="layout-sidebar">
                <AdminSideBar />
            </div>
            <div className="layout-main-container">
                <div className="layout-main">
                    <Outlet />
                </div>
                <AdminFooter />
            </div>
            <LayoutConfigSidebar />
            <div className="layout-mask"></div>
        </div>
    );
};

export default AdminLayout;



