/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { useSchool } from '../../../context/SchoolContext';
import schoolService from '../../../services/schoolService';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import defaultLogoSekolah from '../../../assets/defaultLogoSekolah.png';
import { formatSchoolName } from '../../../utils/formatSchoolName';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const SchoolProfilePage = () => {
    const { school, setSchool } = useSchool();
    const [editData, setEditData] = useState({ name: '', address: '', logo_image: '', remove_image: false });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModified, setIsModified] = useState(false);
    const { user } = useAuth();
    const [hasAccess, setHasAccess] = useState(user?.roles.some(role => ['super_admin', 'school_admin'].includes(role)))
    const navigate = useNavigate();

    useEffect(() => {
        if (school) {
            setEditData({ name: school.name, address: school.address, logo_image: school.logoImagePath, remove_image: false });
            setImagePreview(school.logoImagePath);
        }
    }, [school]);


    useEffect(() => {
        if (!school) return;

        const isChanged = (
            editData.name !== school.name ||
            editData.address !== school.address ||
            (editData.remove_image && imagePreview !== school.logoImagePath) ||
            logoImage !== null
        );

        setIsModified(isChanged);
    }, [editData, school, logoImage, imagePreview]);


    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", editData.name);
            formData.append("address", editData.address);

            if (logoImage) {
                formData.append("logo_image", logoImage);
            }

            if (editData.remove_image) {
                formData.append("remove_image", "1");
            }

            if (school) {
                const updatedSchool = await schoolService.update(school.id, formData as any);

                if (updatedSchool.data) {
                    setSchool((prev) => prev ? {
                        ...prev,
                        name: updatedSchool.data.name,
                        address: updatedSchool.data.address,
                        logoImagePath: updatedSchool.data.logo_image_path,
                        status: updatedSchool.data.status ?? prev.status,
                        latest_subscription: updatedSchool.data.latest_subscription
                    } : updatedSchool.data);

                    setImagePreview(updatedSchool.data.logo_image_path);
                    const newSchoolName = formatSchoolName(updatedSchool.data.name);
                    navigate(`/school/${newSchoolName}/profile`, { replace: true });
                }
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
            message: 'Apakah Anda yakin ingin mengubah data sekolah?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: handleUpdate,
            reject: () => { }
        });
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
                setLogoImage(file);

                event.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    };



    const handleRemoveLogo = () => {
        setImagePreview(null);
        setLogoImage(null);
        setEditData({ ...editData, remove_image: true });
    };

    return (
        <div className="p-4 card">
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="w-full md:w-1/2">
                <h1>Profile Sekolah</h1>
                <Divider />
                <div className="field">
                    <label>Logo</label>
                    <div className="flex items-center gap-4">
                        <div >
                            <img loading="lazy" src={imagePreview || defaultLogoSekolah} alt="" className='w-5rem h-5rem border-circle' onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultLogoSekolah;
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
                        {hasAccess &&
                            <div className="flex flex-col gap-2">
                                <div className='my-auto flex gap-2'>
                                    <Button disabled={loading} label="Ganti Logo" icon="pi pi-upload" className="p-button-sm" onClick={handleAvatarClick} />
                                    <Button disabled={!imagePreview || loading} label="Hapus Logo" icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={handleRemoveLogo} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="field">
                    <label>Nama</label>
                    <InputText
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Masukkan Nama Sekolah"
                        className="w-full"
                        disabled={!hasAccess || loading}
                    />
                </div>
                <div className="field mt-3">
                    <label>Alamat</label>
                    <InputText
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        placeholder="Masukkan Alamat"
                        className="w-full"
                        disabled={!hasAccess || loading}
                    />
                </div>
                <Divider />
                {
                    hasAccess &&
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
                                if (!school) return;
                                setImagePreview(school.logoImagePath);
                                setLogoImage(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                setEditData({ name: school.name, address: school.address, logo_image: school.logoImagePath, remove_image: false });

                            }}
                            disabled={loading || !isModified}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default SchoolProfilePage;
