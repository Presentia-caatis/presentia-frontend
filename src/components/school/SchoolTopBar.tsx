/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import logoImage from '../../assets/Logo-SMK-10-Bandung.png';
import { logoutADMSJS } from '../../services/admsjsService';
import { Toast } from 'primereact/toast';
import { formatSchoolName } from '../../utils/formatSchoolName';

const SchoolTopbar = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const [user, setUser] = useState<{ fullname: string } | null>(null);
    const { school, loading } = useSchool();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const profileItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            action: () => {
                navigate(`/school/${formatSchoolName(school.name)}/profile`);
            },
        },
        // {
        //     label: 'Settings',
        //     icon: 'pi pi-cog',
        //     action: () => {
        //         console.log('Open Settings');
        //     },
        // },
        {
            label: 'Keluar Dashboard Sekolah',
            icon: 'pi pi-sign-out',
            action: () => {
                handleLogoutSchool();
            },
        },
    ];

    const handleLogoutSchool = async () => {
        await logoutADMSJS();
        localStorage.removeItem('admsjs_token');
        navigate('/client/dashboard');
    }

    const handleToggleMenu = () => {
        setProfileOpen((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
        ) {
            setProfileOpen(false);
        }
    };

    useState(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    },);

    return (
        <div className="layout-topbar  flex justify-content-between">
            <Link to={`/school/${formatSchoolName(school?.name) || 'default-school'}/dashboard`} className="layout-topbar-logo">
                <img src={logoImage} alt="logo" />
                <span>{school?.name || 'Loading...'}</span>
            </Link>

            <div
                ref={containerRef}
                className="flex gap-2 cursor-pointer justify-content-end relative w-12rem"
                onClick={handleToggleMenu}
                aria-controls="popup_profile_menu"
                aria-haspopup
            >
                <div className='lg:white-space-nowrap'>
                    {user?.fullname || 'Guest'}
                </div>
                <div>
                    <i className='pi pi-user'></i>
                </div>
                <div>
                    <i
                        className={`pi ${profileOpen ? 'pi-angle-up' : 'pi-angle-down'
                            } transition-all duration-300`}
                    />
                </div>

                {profileOpen && (
                    <div
                        className="absolute bg-white card p-0 text-sm w-full transition-all duration-300 opacity-100 scale-100"
                        style={{
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: 'calc(100% + 10px)',
                            zIndex: 10,
                        }}
                    >
                        <div className="flex flex-column">
                            {profileItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 align-items-center py-3 px-3 cursor-pointer hover:bg-primary-100 transition-all transition-delay-100 transition-duration-100"
                                    onClick={item.action}
                                >
                                    <i className={item.icon}></i>
                                    <div>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolTopbar;
