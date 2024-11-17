import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

const ClientTopBar = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const profileItems = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            action: () => {
                navigate('/client/profile');
            },
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            action: () => {
                console.log('Open Settings');
                // Open settings modal or page
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

    return (
        <div className="layout-topbar flex justify-content-between">
            <Link to={"dashboard"} className="layout-topbar-logo">
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

export default ClientTopBar;
