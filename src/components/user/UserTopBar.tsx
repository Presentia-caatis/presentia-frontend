/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useToastContext } from '../../layout/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { formatSchoolName } from '../../utils/formatSchoolName';
import { Avatar } from 'primereact/avatar';
import defaultProfileUser from '../../assets/defaultProfileUser.png';

const UserTopBar = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const toast = React.useRef<Toast>(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { school } = useSchool();
    const [loading, setLoading] = useState(false);

    const { showToast } = useToastContext();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    const handleLogout = async () => {
        try {
            callToast(showToast, 'info', 'Logout', 'Sedang proses logout...');
            setLoading(true);

            await logout();
            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    const profileItems = [
        {
            label: 'Profile Pengguna',
            icon: 'pi pi-user',
            action: () => navigate('/user/profile'),
        },
        ...(school && !user?.roles.includes('super_admin')
            ? [
                {
                    label: 'Profile Sekolah',
                    icon: 'pi pi-graduation-cap',
                    action: () => {
                        navigate(`/school/${formatSchoolName(school.name)}/profile`);
                    },
                },
            ]
            : []),
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            action: handleLogout,
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
        <div className="layout-topbar flex justify-content-between">
            <Link to={"/"} className="layout-topbar-logo text-center">
                <span>My Presentia</span>
            </Link>
            <Toast ref={toast} />
            <div
                ref={containerRef}
                className="flex gap-2 cursor-pointer relative"
                onClick={handleToggleMenu}
                aria-controls="popup_profile_menu"
                aria-haspopup
            >
                <div className='my-auto'>
                    {user?.fullname || 'Loading...'}
                </div>
                <div className=''>
                    <img
                        loading="lazy"
                        src={user?.profile_image_path || defaultProfileUser}
                        alt=""
                        className='w-4rem h-4rem border-circle border-3'
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultProfileUser;
                        }}
                    />

                </div>
                <div className='my-auto'>
                    <i
                        className={`pi ${profileOpen ? 'pi-angle-up' : 'pi-angle-down'
                            } transition-all duration-300`}
                    />
                </div>

                {profileOpen && (
                    <div
                        className="absolute bg-white min-w-full card p-0 text-sm transition-all duration-300 opacity-100 scale-100"
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

export default UserTopBar;
