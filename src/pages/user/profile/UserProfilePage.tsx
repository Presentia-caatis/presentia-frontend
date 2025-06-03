/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastContext } from '../../../layout/ToastContext';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import userService from '../../../services/userService';
import defaultProfileUser from '../../../assets/defaultProfileUser.png';
import authService from '../../../services/authService';

const UserProfilePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const { logout, user, updateUser } = useAuth();
    const [editData, setEditData] = useState({ username: '', fullname: '', email: '', profile_image_path: '', remove_image: false });
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModified, setIsModified] = useState(false);
    const toast = useRef<Toast>(null);

    const items = [
        { label: 'Profile Kamu', icon: 'pi pi-user' },
        { label: 'Ganti Password', icon: 'pi pi-lock' },
        { label: 'Logout', icon: 'pi pi-sign-out' },
    ];

    const { showToast } = useToastContext();

    useEffect(() => {
        if (user) {
            setEditData({ username: user.username, fullname: user.fullname, email: user.email, profile_image_path: user.profile_image_path, remove_image: false });
            setImagePreview(user.profile_image_path);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const isChanged = (
            editData.username !== user.username ||
            editData.fullname !== user.fullname ||
            (editData.remove_image && imagePreview !== user.profile_image_path) ||
            profileImage !== null
        );

        setIsModified(isChanged);
    }, [editData, user, profileImage, imagePreview]);
    const handleSendResetLinkFromProfile = async () => {
        try {
            setLoading(true);

            if (!user?.email) {
                showToast({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Email pengguna tidak ditemukan.',
                });
                return;
            }

            const response = await authService.forgotPassword(user.email);

            showToast({
                severity: 'success',
                summary: 'Tautan Dikirim',
                detail: response.message,
            });
        } catch (error: any) {
            const response = error.response?.data;
            let errorMessage = 'Terjadi kesalahan';

            // Tampilkan hanya isi dari errors jika ada
            if (response?.errors) {
                errorMessage = Object.values(response.errors)
                    .flat()
                    .join(' | ');
            } else if (response?.message) {
                errorMessage = response.message;
            }

            showToast({
                severity: 'error',
                summary: 'Gagal',
                detail: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };




    const handleChangePassword = async () => {
        if (newPassword !== newPasswordConfirmation) {
            showToast({
                severity: 'warn',
                summary: 'Password baru tidak cocok',
                detail: 'Konfirmasi password baru harus sama.',
            });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            };


            const res = await authService.changePassword(payload);
            showToast({
                severity: 'success',
                summary: 'Sukses',
                detail: res?.message,
            });
            navigate('/login');
        } catch (error: any) {
            showToast({
                severity: 'error',
                summary: 'Gagal Ganti Password',
                detail: error?.response?.message || 'Terjadi kesalahan',
            });
        } finally {
            setLoading(false);
        }
    };


    // const handleResetPassword = async () => {
    //     if (password !== passwordConfirmation) {
    //         showToast({
    //             severity: 'warn',
    //             summary: 'Password tidak cocok',
    //             detail: 'Konfirmasi password harus sama.',
    //         });
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const payload = {
    //             email: user?.email,
    //             password,
    //             password_confirmation: passwordConfirmation,
    //             token: token,
    //         };

    //         const res = await axiosClient.post('/reset-password', payload);
    //         showToast({
    //             severity: 'success',
    //             summary: 'Sukses',
    //             detail: res.data.message,
    //         });
    //         navigate('/login');
    //     } catch (error: any) {
    //         showToast({
    //             severity: 'error',
    //             summary: 'Gagal Ganti Password',
    //             detail: error?.response?.data?.message || 'Terjadi kesalahan',
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleUpdate = async () => {
        if (!isModified) return;
        setLoading(true);

        try {
            if (user?.id !== undefined) {
                const formData = new FormData();

                if (editData.fullname !== user.fullname) formData.append('fullname', editData.fullname);
                if (editData.username !== user.username) formData.append('username', editData.username);
                if (editData.email !== user.email) formData.append('email', editData.email);

                if (profileImage) {
                    formData.append('profile_image', profileImage);
                } else if (editData.remove_image) {
                    formData.append('remove_image', '1');
                }

                if (formData.has('fullname') || formData.has('username') || formData.has('email') ||
                    formData.has('password') || formData.has('profile_image') || formData.has('remove_image')) {

                    const { responseData } = await userService.updateUser(formData);

                    if (responseData.status === "success") {
                        updateUser(responseData.data);
                        setImagePreview(responseData.data.profile_image_path);
                        setProfileImage(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        showToast({
                            severity: 'success',
                            summary: 'Sukses',
                            detail: 'Profil berhasil diperbarui.',
                            life: 3000
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Gagal memperbarui data", error);
            showToast({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Terjadi kesalahan saat memperbarui data.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Format tidak valid',
                    detail: 'Logo harus berupa file JPG, JPEG, atau PNG.',
                    life: 3000
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setProfileImage(file);

                event.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setImagePreview(null);
        setProfileImage(null);
        setEditData({ ...editData, remove_image: true });
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
            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            localStorage.clear();
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
                                <label>Foto Profile</label>
                                <div className="flex items-center gap-4">
                                    <div >
                                        <img loading="lazy" src={imagePreview || defaultProfileUser} alt="" className='w-5rem h-5rem border-circle' onError={(e) => {
                                            (e.target as HTMLImageElement).src = defaultProfileUser;
                                        }} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className='my-auto flex gap-2'>
                                            <Button disabled={loading} label="Ganti Foto" icon="pi pi-upload" className="p-button-sm" onClick={handleAvatarClick} />
                                            <Button disabled={!imagePreview || loading} label="Hapus Foto" icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={handleRemoveLogo} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field ">
                                <label>Email</label>
                                <InputText
                                    disabled={true}
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    placeholder="Masukkan Email"
                                    className="w-full"
                                />
                            </div>
                            <div className="field mt-3">
                                <label>Username</label>
                                <InputText
                                    value={editData.username}
                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                    placeholder="Masukkan Username"
                                    className="w-full"
                                    disabled={loading}
                                />
                            </div>
                            <div className="field mt-3">
                                <label>Nama Lengkap</label>
                                <InputText
                                    value={editData.fullname}
                                    onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                                    placeholder="Masukkan Nama Lengkap"
                                    className="w-full"
                                    disabled={loading}
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
                                    disabled={loading || !isModified}
                                />
                                <Button
                                    label="Batal"
                                    className="p-button-secondary"
                                    onClick={() => {
                                        if (!user) return;
                                        setImagePreview(user.profile_image_path);
                                        setProfileImage(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                        setEditData({ username: user.username, fullname: user.fullname, email: user.email, profile_image_path: user.profile_image_path, remove_image: false })
                                    }
                                    }
                                    disabled={loading || !isModified}
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
                            <h5>Password Sekarang</h5>
                            <Password id="currentPassword" toggleMask feedback={false} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>

                        <div className="mt-3">
                            <h5>Password Baru</h5>
                            <Password id="newPassword" toggleMask feedback={false} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className="mt-3">
                            <h5>Konfirmasi Password Baru</h5>
                            <Password id="confirmPassword" toggleMask feedback={false} value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
                        </div>

                        <Divider />

                        <div className="flex gap-2">
                            <Button
                                label="Ganti Password"
                                icon="pi pi-save"
                                className="p-mt-3"
                                onClick={handleChangePassword}
                                loading={loading}
                            />
                            <Button
                                label="Batal"
                                className="p-mt-3 p-button-secondary"
                                onClick={() => navigate('/login')}
                            />
                            <Button
                                label="Reset Password via Email"
                                icon="pi pi-envelope"
                                className="ml-1 p-button-text"
                                onClick={handleSendResetLinkFromProfile}
                            />

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
