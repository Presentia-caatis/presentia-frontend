/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Tooltip } from 'primereact/tooltip';
import { absencePermitTypeService } from '../../../../services/absencePermitService';
import { useAuth } from '../../../../context/AuthContext';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';

const SchoolAbsenceStatusPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [permitTypeData, setPermitTypeData] = useState<any>({ permit_name: '', is_active: '' });
    const [selectedPermits, setSelectedPermits] = useState<any[]>([]);
    const [permitList, setPermitList] = useState<any[]>([]);
    const { user } = useAuth();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchPermitTypes();
    }, []);

    const fetchPermitTypes = async () => {
        try {
            const data = await absencePermitTypeService.getAll();
            setPermitList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching permit types:", error);
            setPermitList([]);
        }
    };

    const confirmSavePermitType = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menyimpan tipe izin ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleSave(),
            reject: () => {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Dibatalkan',
                    detail: 'Penyimpanan tipe izin dibatalkan.',
                    life: 3000,
                });
            },
        });
    };


    const handleSave = async () => {
        try {
            if (permitTypeData.id) {
                await absencePermitTypeService.update(permitTypeData.id, permitTypeData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Tipe izin berhasil diperbarui.',
                    life: 3000,
                });
            } else {
                await absencePermitTypeService.create({
                    ...permitTypeData,
                    school_id: user?.school_id,
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Tipe izin berhasil ditambahkan.',
                    life: 3000,
                });
            }
            setShowAddDialog(false);
            fetchPermitTypes();
        } catch (error) {
            console.error('Error saving permit type:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Terjadi kesalahan saat menyimpan tipe izin.',
                life: 3000,
            });
        }
    };

    const handleDelete = async (id: number) => {
        await absencePermitTypeService.delete(id);
        fetchPermitTypes();
    };

    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Status absensi yang aktif, dapat digunakan untuk menentukan status siswa yang tidak hadir.',
            closable: false,
        });
    });

    return (
        <div className="card">
            <h1>Daftar Status Absensi</h1>
            <Toast ref={toast} />
            <Messages ref={msgs} />
            <ConfirmPopup />
            <div className="flex justify-content-between p-4 card">
                <div className="flex gap-2">
                    <Button icon="pi pi-plus" severity="success" label="Status Baru" onClick={() => setShowAddDialog(true)} />
                    <Button icon="pi pi-trash" severity="danger" label="Hapus" disabled={!selectedPermits?.length} />
                </div>
                <Button icon="pi pi-upload" severity="help" label="Export" />
            </div>

            <Tooltip className='p-1' target=".student-count-tooltip" />
            <DataTable
                dataKey="id"
                selection={selectedPermits!}
                selectionMode="multiple"
                onSelectionChange={(e) => setSelectedPermits(e.value)}
                value={permitList}
                paginator
                rows={20}
                emptyMessage="No status available"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Name" sortable />
                <Column field="status" header="Status" sortable />
                <Column
                    body={(rowData: any) => (
                        <div className='flex gap-2'>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-success p-button-rounded"
                                tooltip="Perbarui"
                                onClick={() => { setPermitTypeData(rowData); setShowAddDialog(true); }}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-rounded"
                                tooltip="Hapus"
                                onClick={() => handleDelete(rowData.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                visible={showAddDialog}
                style={{ width: '450px' }}
                onHide={() => setShowAddDialog(false)}
                header="Tambah Status Baru"
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="Simpan" disabled={!permitTypeData.permit_name || !permitTypeData.is_active} icon="pi pi-check" onClick={(e) => confirmSavePermitType(e)} />
                    </div>
                }
                modal
                className="p-fluid"
            >
                <div className="field">
                    <label htmlFor="permit_name">Nama</label>
                    <InputText
                        id="permit_name"
                        value={permitTypeData.permit_name}
                        placeholder='Masukkan nama status absen'
                        onChange={(e) => setPermitTypeData({ ...permitTypeData, permit_name: e.target.value })}
                        required
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label htmlFor="is_active">Status</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status1"
                                name="is_active"
                                value={1}
                                onChange={(e) => setPermitTypeData({ ...permitTypeData, is_active: e.value })}
                                checked={permitTypeData.is_active === 1}
                            />
                            <label htmlFor="status1" className="ml-2">Aktif</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status2"
                                name="is_active"
                                value={0}
                                onChange={(e) => setPermitTypeData({ ...permitTypeData, is_active: e.value })}
                                checked={permitTypeData.is_active === 0}
                            />
                            <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default SchoolAbsenceStatusPage;
