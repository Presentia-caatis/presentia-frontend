import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { useSchool } from '../../../context/SchoolContext';
import schoolService from '../../../services/schoolService';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';

const SchoolProfilePage = () => {
    const { school, setSchool } = useSchool();
    const [editData, setEditData] = useState({ name: '', address: '' });
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (school) {
            setEditData({ name: school.name, address: school.address });
        }
    }, [school]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updatedSchool = await schoolService.update(school.id, {
                school_name: editData.name,
                address: editData.address
            });
            setSchool(updatedSchool.data);
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
            reject: () => {
            }
        });
    };

    const isDataChanged = editData.name !== school.name || editData.address !== school.address;


    return (
        <div className="p-4 card">
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="w-full md:w-1/2">
                <h1>Profile Sekolah</h1>
                <Divider></Divider>
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
                        disabled={!isDataChanged}
                    />
                    <Button
                        label="Batal"
                        className="p-button-secondary"
                        onClick={() => setEditData({ name: school.name, address: school.address })}
                        disabled={loading || !isDataChanged}
                    />
                </div>
            </div>
        </div>
    );
};

export default SchoolProfilePage;
