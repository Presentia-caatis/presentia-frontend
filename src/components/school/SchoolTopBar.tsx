/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { formatSchoolName } from '../../utils/formatSchoolName';
import { useLayoutConfig } from '../../context/LayoutConfigContext';
import defaultLogoSekolah from '../../assets/defaultLogoSekolah.png';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import defaultProfileUser from '../../assets/defaultProfileUser.png';

const SchoolTopbar = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const { school } = useSchool();
    const { user } = useAuth();

    const { setIsSidebarVisible } = useLayoutConfig();

    const profileItems = [
        {
            label: 'Profile Pengguna',
            icon: 'pi pi-user',
            action: () => {
                handleLogoutSchool();
                navigate(`/user/profile`);
            },
        },
        {
            label: 'Profile Sekolah',
            icon: 'pi pi-graduation-cap',
            action: () => {
                if (school) {
                    navigate(`/school/${formatSchoolName(school.name)}/profile`);
                }
            },
        },
        {
            label: 'Keluar Dashboard Sekolah',
            icon: 'pi pi-sign-out',
            action: () => {
                handleLogoutSchool();
            },
        },
    ];

    const handleLogoutSchool = async () => {
        localStorage.removeItem('admsjs_token');
        navigate('/user/dashboard');
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
        <div className="layout-topbar flex justify-content-between gap-2">
            <Link
                to={school ? `/school/${formatSchoolName(school.name)}/dashboard` : "/user/dashboard"}
                className="layout-topbar-logo text-center"
            >
                <img loading="lazy" src={school?.logoImagePath || defaultLogoSekolah} alt="logo" onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultLogoSekolah;
                }} />
                <div className='white-space-nowrap overflow-hidden text-overflow-ellipsis hidden sm:block'>
                    {school?.name || 'Loading...'}
                </div>
            </Link>

            <div className='flex'>
                <div className="menu-toggle cursor-pointer lg:hidden my-auto mr-3" onClick={() => setIsSidebarVisible(prev => !prev)}>
                    <i className="pi pi-bars text-2xl"></i>
                </div>
                <div
                    ref={containerRef}
                    className="flex gap-2 cursor-pointer justify-content-end relative w-12rem"
                    onClick={handleToggleMenu}
                    aria-controls="popup_profile_menu"
                    aria-haspopup
                >
                    <div className='my-auto flex flex-column'>
                        <div className='school-profile'>
                            {user?.fullname || 'Loading...'}
                        </div>
                        <div className='text-left md:text-right'>
                            <Tag>Admin</Tag>
                        </div>
                    </div>
                    <div className=''>
                        <Avatar shape="circle" className='border border-1' size='large' image={user?.profile_image_path || defaultProfileUser}></Avatar>
                    </div>
                    <div className='my-auto'>
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

        </div >
    );
};

export default SchoolTopbar;
