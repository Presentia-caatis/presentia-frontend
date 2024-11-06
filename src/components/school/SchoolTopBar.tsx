import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import smkTelkomlogo from '../../assets/logo-smk-telkom-bdg.png';

const SchoolTopbar = () => {

    const onMenuToggle = () => { };
    const onTopBarMenuButton = () => { };
    const handleLogout = () => { };

    return (
        <div className="layout-topbar">
            <Link to="/login" className="layout-topbar-logo">
                <img src={smkTelkomlogo} alt="logo" />
                <span>SMK Telkom Bandung</span>
            </Link>

            <Button icon="pi pi-bars" onClick={onMenuToggle} className='p-link layout-menu-button layout-topbar-button' />

            <Button
                icon="pi pi-ellipsis-v"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={onTopBarMenuButton}
            />

            <div className="layout-topbar-menu">
                <Tooltip target=".layout-topbar-menu .logout-button" content="Log Out" />
                <Button
                    icon="pi pi-sign-out"
                    label="Log Out"
                    className="p-link layout-topbar-button logout-button"
                    onClick={handleLogout}
                />

                <Tooltip target=".layout-topbar-menu .profile-button" content="Profile" />
                <Link to="/school/profile">
                    <Button
                        icon="pi pi-user"
                        label="Profile"
                        className="p-link layout-topbar-button profile-button"
                    />
                </Link>
            </div>
        </div>
    );
};

export default SchoolTopbar;
