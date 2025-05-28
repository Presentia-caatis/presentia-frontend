import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useLayoutConfig } from '../context/LayoutConfigContext';
import LayoutConfigSidebar from '../components/LayoutConfigSidebar';
import Topbar from '../components/school/SchoolTopBar';
import SideBar from '../components/school/SchoolSideBar';
import Footer from '../components/school/SchoolFooter';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import logoImage from '../assets/Logo-SMK-10-Bandung.png';
import { formatSchoolName } from '../utils/formatSchoolName';
import { ProgressSpinner } from 'primereact/progressspinner';
import SchoolService from '../services/schoolService';

const SchoolLayout = () => {
    const { darkMode } = useLayoutConfig();
    const [containerClass, setContainerClass] = useState('');
    const { checkAuth, user } = useAuth();
    const { school, schoolLoading } = useSchool();
    const { schoolName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const authenticate = async () => {
            await checkAuth();
        };

        authenticate();
    }, []);

    useEffect(() => {
        setContainerClass(
            darkMode ? 'layout-theme-dark' : 'layout-theme-light'
        );
    }, [darkMode]);

    useEffect(() => {
        if (user?.roles.includes('super_admin') && !user?.school_id) {
            navigate('/admin/schools');
        }
    }, [user]);

    useEffect(() => {
        if (!user?.roles.includes('super_admin')) {
            if (school && schoolName && formatSchoolName(school.name) !== schoolName) {
                navigate('/404');
            }
        }
    }, [user, school, schoolName, navigate]);

    useEffect(() => {
        if (!user?.roles.includes('super_admin')) {
            if (!school && !schoolLoading) {
                navigate('/404');
            }
        }
    }, [user, school, schoolLoading, navigate]);



    if (schoolLoading) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (!school) {
        return <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
            <ProgressSpinner />
        </div>;
    }


    const formatedSchoolName = formatSchoolName(school.name);
    const schoolNameTitle = school.name || 'Presentia';


    const getTitle = () => {
        switch (location.pathname) {
            case `/school/${formatedSchoolName}/dashboard`:
                return `Dashboard - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/student`:
                return `Daftar Siswa - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/attendance-record`:
                return `Rekam Presensi Siswa - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/attendance`:
                return `Kehadiran Siswa - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/custom-event`:
                return `Event - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/default-attendance-time`:
                return `Waktu Presensi - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/classroom`:
                return `Daftar Kelas - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/fingerprint`:
                return `Fingerprint - ${schoolNameTitle}`;
            case `/school/${formatedSchoolName}/profile`:
                return `Profile - ${schoolNameTitle}`;
            default:
                return `${schoolNameTitle}`;
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
            <div className="block md:hidden">
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
