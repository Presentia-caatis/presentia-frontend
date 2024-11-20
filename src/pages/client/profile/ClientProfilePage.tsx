import { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';

const ClientProfilePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Profile Kamu', icon: 'pi pi-user' },
        { label: 'Ganti Password', icon: 'pi pi-lock' },
        { label: 'Logout', icon: 'pi pi-sign-out' },
    ];

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <div className="p-grid p-justify-center p-align-center p-mt-4">
                        <h2>Profile</h2>

                        <div className="mt-3">
                            <h5>Nama</h5>
                            <InputText
                                placeholder="Nama"
                            />
                        </div>

                        <Divider />
                        <div className='flex gap-2'>
                            <Button label="Simpan Pembaruan" icon="pi pi-save" className="p-mt-3" />
                            <Button label="Batal" className="p-mt-3 p-button-secondary " />
                        </div>
                    </div>

                );
            case 1:
                return (
                    <div className="p-grid p-justify-center p-align-center p-mt-4">
                        <h2>Ganti Password</h2>

                        <div className="mt-3">
                            <h5>Password Lama</h5>
                            <Password id="currentPassword" toggleMask feedback={false} />
                        </div>

                        <div className="mt-3">
                            <h5>Password Baru</h5>
                            <Password id="newPassword" toggleMask />
                        </div>

                        <div className="mt-3">
                            <h5>Konfirmasi Password</h5>
                            <Password id="confirmPassword" toggleMask />
                        </div>

                        <Divider />
                        <div className='flex gap-2'>
                            <Button label="Ganti Password" icon="pi pi-save" className="p-mt-3" />
                            <Button label="Batal" className="p-mt-3 p-button-secondary " />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex justify-content-center align-items-center flex-column" style={{ height: '70vh' }}>
                        <h2>Logout</h2>
                        <p>Apakah Anda yakin ingin logout?</p>
                        <Button label="Logout" icon="pi pi-sign-out" className="p-button-danger" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 card">
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            <div className="mt-4">{renderContent()}</div>
        </div>
    );
};

export default ClientProfilePage;
