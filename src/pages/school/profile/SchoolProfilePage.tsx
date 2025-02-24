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

const SchoolProfilePage = () => {
    const { school, setSchool } = useSchool();
    const [editData, setEditData] = useState({ name: '', address: '', logo_image: '', remove_image: false });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (school) {
            setEditData({ name: school.name, address: school.address, logo_image: school.logoImagePath, remove_image: false });
            setImagePreview("");
        }
    }, [school]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("school_name", editData.name);
            formData.append("address", editData.address);

            if (logoImage) {
                formData.append("logo_image", logoImage);
            }

            if (school) {
                const updatedSchool = await schoolService.update(school.id, formData as any);
                setSchool(updatedSchool.data);
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
                    <label>Logo Sekolah</label>
                    <div className="flex items-center gap-4">
                        <div onClick={handleAvatarClick} className="cursor-pointer">
                            <img src={imagePreview || defaultLogoSekolah} alt="" className='w-5rem h-5rem border-circle' />
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className='my-auto flex gap-2'>
                                <Button label="Ganti Logo" icon="pi pi-upload" className="p-button-sm" onClick={handleAvatarClick} />
                                <Button label="Hapus Logo" icon="pi pi-trash" disabled={!imagePreview} className="p-button-sm p-button-danger" onClick={handleRemoveLogo} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label>Nama Sekolah</label>
                    <InputText
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Masukkan Nama Sekolah"
                        className="w-full"
                    />
                </div>
                <div className="field mt-3">
                    <label>Alamat</label>
                    <InputText
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        placeholder="Masukkan Alamat"
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
                        disabled={!editData.name || !editData.address}
                    />
                    <Button
                        label="Batal"
                        className="p-button-secondary"
                        onClick={() => {
                            if (!school) return;
                            setEditData({ name: school.name, address: school.address, logo_image: school.logoImagePath, remove_image: false })
                        }}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default SchoolProfilePage;
