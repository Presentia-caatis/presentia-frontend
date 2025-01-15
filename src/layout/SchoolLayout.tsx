import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import Topbar from '../components/school/SchoolTopBar';
import SideBar from '../components/school/SchoolSideBar';
import Footer from '../components/school/SchoolFooter';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import logoImage from '../assets/Logo-SMK-10-Bandung.png';

const SchoolLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');
    const { user } = useAuth();
    const { schoolData } = useSchool();

    const schoolId = user?.school_id;

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    const getTitle = () => {
        const schoolName = schoolData?.school_name || 'Presentia';
        switch (location.pathname) {
            case `/school/${schoolId}/dashboard`:
                return `Dashboard - ${schoolName}`;
            case `/school/${schoolId}/student`:
                return `Daftar Siswa - ${schoolName}`;
            case `/school/${schoolId}/attendance-record`:
                return `Rekam Presensi Siswa - ${schoolName}`;
            case `/school/${schoolId}/classroom`:
                return `Daftar Kelas - ${schoolName}`;
            default:
                return `${schoolName}`;
        }
    };

    return (
        <div className={`layout-wrapper layout-static ${containerClass}`}>
            <Helmet>
                <title>{getTitle()}</title>
                <link rel="icon" href={logoImage} type="image/png" />
            </Helmet>
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
