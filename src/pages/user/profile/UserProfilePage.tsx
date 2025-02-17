/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../../../layout/ToastContext';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import userService from '../../../services/userService';

const UserProfilePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [editData, setEditData] = useState({ username: '', fullname: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const toast = useRef<Toast>(null);

    const items = [
        { label: 'Profile Kamu', icon: 'pi pi-user' },
        { label: 'Ganti Password', icon: 'pi pi-lock' },
        { label: 'Logout', icon: 'pi pi-sign-out' },
    ];

    const { showToast } = useToastContext();

    useEffect(() => {
        if (user) {
            setEditData({ username: user.username, fullname: user.fullname, email: user.email });
        }
    }, [user]);

    const isDataChanged = editData.username !== user?.username || editData.fullname !== user?.fullname || editData.email !== user?.email;

    const handleUpdate = async () => {
        setLoading(true);
        try {
            if (user?.id !== undefined) {
                const payload: {
                    fullname: string;
                    username: string;
                    email: string;
                    school_id?: number;
                    password?: string;
                    password_confirmation?: string;
                } = {
                    fullname: editData.fullname,
                    username: editData.username,
                    email: user.email,
                    school_id: user.school_id ?? undefined
                };

                if (password) {
                    payload.password = password;
                    payload.password_confirmation = passwordConfirmation;
                }

                await userService.updateUser(user.id, payload);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Sukses',
                    detail: 'Data berhasil diperbarui.',
                    life: 3000
                });
            } else {
                console.error("User ID is undefined");
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: 'Data sekolah berhasil diperbarui.',
                life: 3000
            });
        } catch (error) {
            console.error("Gagal memperbarui data sekolah", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmUpdate = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin mengubah data?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: handleUpdate,
            reject: () => {
            }
        });
    };

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

            callToast(showToast, 'success', 'Logout Sukses', 'Kamu berhasil logout');
            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            callToast(showToast, 'error', 'Logout Gagal', 'Tidak bisa logout');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <div className="p-grid p-justify-center p-align-center p-mt-4">
                        <div className="w-full md:w-1/2">
                            <h1>Profile Pengguna</h1>
                            <Divider></Divider>
                            <div className="field">
                                <label>Username</label>
                                <InputText
                                    value={editData.username}
                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                    placeholder="Masukkan Username"
                                    className="w-full"
                                />
                            </div>
                            <div className="field mt-3">
                                <label>Nama Lengkap</label>
                                <InputText
                                    value={editData.fullname}
                                    onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                                    placeholder="Masukkan Nama Lengkap"
                                    className="w-full"
                                />
                            </div>
                            <div className="field mt-3">
                                <label>Email</label>
                                <InputText
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    placeholder="Masukkan Email"
                                    className="w-full"
                                />
                            </div>

                            <Divider />

                            <div className="flex gap-2">
                                <Button
                                    label="Simpan Pembaruan"
                                    icon="pi pi-save"
                                    className="p-button-primary"
                                    onClick={confirmUpdate}
                                    loading={loading}
                                    disabled={!isDataChanged}
                                />
                                <Button
                                    label="Batal"
                                    className="p-button-secondary"
                                    onClick={() => setEditData({ username: user?.username || '', fullname: user?.fullname || '', email: user?.email || '' })}
                                    disabled={loading || !isDataChanged}
                                />
                            </div>
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
                        <Button label="Logout" loading={loading} onClick={handleLogout} icon="pi pi-sign-out" className="p-button-danger" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 card">
            <Toast ref={toast} />
            <ConfirmPopup />
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            <div className="mt-4">{renderContent()}</div>
        </div>
    );
};

export default UserProfilePage;
