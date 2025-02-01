import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

const AdminTopbar = () => {
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const outsideClickListener = useRef<((event: MouseEvent) => void) | null>(null);
    const topbarMenuRef = useRef<HTMLDivElement>(null);
    const topbarMenuButtonRef = useRef<HTMLButtonElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const profileItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            action: () => {
                navigate('/user/profile');
            },
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            action: () => {
                navigate('/');
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

    const onMenuToggle = () => {
    };

    const onTopBarMenuButton = () => {
        setTopbarMenuActive(prevState => !prevState);
    };

    const handleLogout = () => {
        console.log('Logged out');
    };

    const bindOutsideClickListener = () => {
        if (outsideClickListener.current) {
            document.addEventListener('click', outsideClickListener.current);
        }
    };

    const unbindOutsideClickListener = () => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
        }
    };

    useEffect(() => {
        outsideClickListener.current = (event) => {
            if (
                topbarMenuRef.current && !topbarMenuRef.current.contains(event.target as Node) &&
                topbarMenuButtonRef.current && !topbarMenuButtonRef.current.contains(event.target as Node)
            ) {
                setTopbarMenuActive(false);
            }
        };
        bindOutsideClickListener();
        return () => {
            unbindOutsideClickListener();
        };
    }, []);

    return (
        <div className="layout-topbar flex justify-content-between">
            <Link to="" className="layout-topbar-logo">
                <span>Presentia Super Admin</span>
            </Link>

            <div
                ref={containerRef}
                className="flex gap-2 cursor-pointer relative"
                onClick={handleToggleMenu}
                aria-controls="popup_profile_menu"
                aria-haspopup
            >
                <div>
                    MUHAMMAD ZAKY FATHURAHIM
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

export default AdminTopbar;
