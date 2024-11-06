import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

const AdminTopbar = () => {
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const outsideClickListener = useRef<((event: MouseEvent) => void) | null>(null);
    const topbarMenuRef = useRef<HTMLDivElement>(null);
    const topbarMenuButtonRef = useRef<HTMLButtonElement>(null);

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
        <div className="layout-topbar">
            <Link to="/login" className="layout-topbar-logo">
                <span>Etmin </span>
            </Link>

            <Button
                icon="pi pi-bars"
                onClick={onMenuToggle}
                className="p-link layout-menu-button layout-topbar-button"
            />

            <Button
                icon="pi pi-ellipsis-v"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={onTopBarMenuButton}
            />

            <div
                className={`layout-topbar-menu ${topbarMenuActive ? 'layout-topbar-menu-mobile-active' : ''}`}
                ref={topbarMenuRef}
            >
                <Tooltip target=".layout-topbar-menu .logout-button" content="Log Out" />
                <Button
                    icon="pi pi-sign-out"
                    label="Log Out"
                    className="p-link layout-topbar-button logout-button"
                    onClick={handleLogout}
                />
            </div>
        </div>
    );
};

export default AdminTopbar;
