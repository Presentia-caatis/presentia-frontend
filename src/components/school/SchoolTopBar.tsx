import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import smkTelkomlogo from '../../assets/logo-smk-telkom-bdg.png';
import { useEffect, useRef, useState } from 'react';

const SchoolTopbar = () => {

    const onMenuToggle = () => { };
    const onTopBarMenuButton = () => { };
    const handleLogout = () => { };


    const containerRef = useRef<HTMLDivElement>(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const [user, setUser] = useState<{ fullname: string } | null>(null);

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
                navigate('/school/profile');
            },
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            action: () => {
                console.log('Open Settings');
            },
        },
        {
            label: 'Keluar Dashboard Sekolah',
            icon: 'pi pi-sign-out',
            action: () => {
                navigate('/client/dashboard');
            },
        },
    ];

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
            <Link to="/school/mainpage" className="layout-topbar-logo">
                <img src={smkTelkomlogo} alt="logo" />
                <span>SMK Telkom Bandung</span>
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
