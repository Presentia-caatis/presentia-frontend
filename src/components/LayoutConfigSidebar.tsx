import React from 'react';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Sidebar } from 'primereact/sidebar';
import { useLayoutConfig } from '../context/LayoutConfigContext';

const LayoutConfigSidebar: React.FC = () => {
    const { darkMode, setDarkMode, scale, setScale, menuMode, setMenuMode, ripple, setRipple } = useLayoutConfig();
    const [visible, setVisible] = React.useState(false);

    const toggleSidebar = () => setVisible(!visible);

    return (
        <>
            <button className="layout-config-button p-link" onClick={toggleSidebar}>
                <i className="pi pi-cog"></i>
            </button>

            <Sidebar visible={visible} onHide={toggleSidebar} position="right" className="layout-config-sidebar w-20rem">
                <h5>Scale</h5>
                <div className="flex align-items-center">
                    <Button icon="pi pi-minus" onClick={() => setScale(scale - 1)} disabled={scale <= 12} />
                    <div className="mx-2">{scale}</div>
                    <Button icon="pi pi-plus" onClick={() => setScale(scale + 1)} disabled={scale >= 16} />
                </div>

                <h5>Menu Type</h5>
                <div className="flex">
                    <InputSwitch checked={menuMode === 'static'} onChange={(e) => setMenuMode(e.value ? 'static' : 'overlay')} />
                </div>

                <h5>Ripple Effect</h5>
                <InputSwitch checked={ripple} onChange={(e) => setRipple(e.value)} />

                <h5>Dark Mode</h5>
                <InputSwitch checked={darkMode} onChange={(e) => setDarkMode(e.value)} />
            </Sidebar>
        </>
    );
};

export default LayoutConfigSidebar;