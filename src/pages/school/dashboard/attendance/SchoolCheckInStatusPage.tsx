/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import checkInStatusService from '../../../../services/checkInStatusService';
import { useAuth } from '../../../../context/AuthContext';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import { hasAnyPermission } from '../../../../utils/hasPermissions';

const defaultCheckInStatus = {
    status_name: '',
    description: '',
    late_duration: 0,
    is_active: 1,
};

const SchoolCheckInStatusPage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [checkInStatusData, setCheckInStatusData] = useState<any>(defaultCheckInStatus);
    const [originalData, setOriginalData] = useState<any>(defaultCheckInStatus);
    const [selectedCheckInStatus, setSelectedCheckInStatus] = useState<any[]>([]);
    const [checkInStatusList, setCheckInStatusList] = useState<any[]>([]);
    const { user } = useAuth();
    const msgs = useRef<Messages>(null);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const disableDefaultStatusForm = checkInStatusData.late_duration === -1 || checkInStatusData.late_duration === 0;

    useEffect(() => {
        fetchCheckInStatus(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Status presensi yang aktif, akan menentukan status siswa yang presensi sesuai dengan durasi keterlambatan (Menit).',
            closable: false,
        });
    });


    const fetchCheckInStatus = async (page = 1, perPage = 20) => {
        try {
            setLoading(true);
            setCheckInStatusList([]);
            const { responseData } = await checkInStatusService.getAll(page, perPage);
            setCheckInStatusList(responseData.data.data || []);
            setTotalRecords(responseData.data.total);
        } catch (error) {
            console.error('Error fetching check-in status:', error);
            setCheckInStatusList([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCheckInStatusData(defaultCheckInStatus);
        setOriginalData(defaultCheckInStatus);
    };

    const isDataValid = () => {
        const { status_name, description } = checkInStatusData;
        return status_name.trim() !== '' && description.trim() !== '';
    };

    const isDataChanged = () => {
        return JSON.stringify(checkInStatusData) !== JSON.stringify(originalData);
    };

    const confirmSaveCheckInStatus = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menyimpan status presensi ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleSave(),
        });
    };

    const confirmDeleteCheckInStatus = (event: React.MouseEvent, id: number) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menghapus status presensi ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleDelete(id),
        });
    };

    const handleSave = async () => {
        try {
            setLoadingButton(true);
            if (checkInStatusData.id) {
                await checkInStatusService.update(checkInStatusData.id, checkInStatusData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Status presensi berhasil diperbarui.',
                    life: 3000,
                });
            } else {
                await checkInStatusService.create({
                    ...checkInStatusData,
                    school_id: user?.school_id,
                });
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Status presensi berhasil ditambahkan.',
                    life: 3000,
                });
            }
            setShowDialog(false);
            fetchCheckInStatus();
            resetForm();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan, coba lagi nanti.';
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: errorMessage,
                life: 3000,
            });
        } finally {
            setLoadingButton(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoadingDelete(true);
            toast.current?.show({
                severity: 'info',
                summary: 'Loading...',
                detail: 'Sedang menghapus data status presensi.',
                life: 3000,
            });
            await checkInStatusService.delete(id);
            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Status presensi berhasil dihapus.',
                life: 3000,
            });
            fetchCheckInStatus();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan, coba lagi nanti.';
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: errorMessage,
                life: 3000,
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <div className="card">
            <h1>Daftar Status Presensi</h1>
            <Toast ref={toast} />
            <Messages ref={msgs} />
            <ConfirmPopup />
            {
                hasAnyPermission(user, ['manage_schools']) && (
                    <div className="flex justify-content-between p-4 card">
                        <div className="flex gap-2">
                            <Button icon="pi pi-plus" severity="success" label="Tambah Status" onClick={() => setShowDialog(true)} />
                            <Button icon="pi pi-trash" severity="danger" label="Hapus" disabled={!selectedCheckInStatus.length} />
                        </div>
                    </div>
                )
            }

            <DataTable
                dataKey="id"
                selection={selectedCheckInStatus}
                selectionMode="multiple"
                onSelectionChange={(e) => {
                    const filteredSelection = e.value.filter((student) => student.late_duration > 1);
                    setSelectedCheckInStatus(filteredSelection)
                }}
                value={checkInStatusList}
                paginator
                first={(currentPage - 1) * rowsPerPage
                }
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPage={(event) => {
                    setCurrentPage((event.page ?? 0) + 1);
                    setRowsPerPage(event.rows);
                }}
                rowsPerPageOptions={[10, 20, 50, 100]}
                tableStyle={{ minWidth: "50rem" }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} status presensi"
                stripedRows
                emptyMessage={
                    loading ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data status presensi...</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Belum ada data status presensi</span>
                            <small className="text-gray-400">Silakan tambahkan status presensi melalui tombol tambah status.</small>
                        </div>
                    )
                }
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column
                    field="status_name"
                    header="Nama Status"
                    sortable
                    body={(rowData) =>
                        loading ? <Skeleton width="80%" height="1rem" /> : rowData.status_name
                    }
                />
                <Column
                    field="description"
                    header="Deskripsi"
                    sortable
                    body={(rowData) =>
                        loading ? <Skeleton width="90%" height="1rem" /> : rowData.description
                    }
                />
                <Column
                    field="late_duration"
                    header="Durasi Keterlambatan (Menit)"
                    sortable
                    body={(rowData) =>
                        loading ? <Skeleton width="50%" height="1rem" /> : rowData.late_duration
                    }
                />
                <Column
                    field="is_active"
                    header="Status"
                    sortable
                    body={(rowData) =>
                        loading ? <Skeleton width="60%" height="1rem" /> : rowData.is_active ? "Aktif" : "Tidak Aktif"
                    }
                />
                <Column
                    body={(rowData: any) =>
                        loading ? (
                            <div className="flex gap-2">
                                <Skeleton shape="circle" size="2rem" />
                                <Skeleton shape="circle" size="2rem" />
                            </div>
                        ) : hasAnyPermission(user, ['manage_schools']) ? (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-success p-button-rounded"
                                    tooltip="Edit"
                                    disabled={loadingDelete}
                                    onClick={() => {
                                        setOriginalData(rowData);
                                        setCheckInStatusData(rowData);
                                        setShowDialog(true);
                                    }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-rounded"
                                    tooltip="Hapus"
                                    disabled={loadingDelete || rowData.late_duration === 0 || rowData.late_duration === -1}
                                    onClick={(e) => confirmDeleteCheckInStatus(e, rowData.id)}
                                />
                            </div>
                        ) : null
                    }
                />

            </DataTable>

            <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                onHide={() => { setShowDialog(false); resetForm() }}
                header="Tambah/Edit Status presensi"
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => { setShowDialog(false); resetForm() }} />
                        <Button label="Simpan" icon="pi pi-check" loading={loadingButton} onClick={(e) => confirmSaveCheckInStatus(e)} disabled={!isDataValid() || !isDataChanged()} />
                    </div>
                }
                modal
                className="p-fluid"
            >
                <div className="field">
                    <label htmlFor="status_name">Nama Status <span className='text-red-600'>*</span></label>
                    <InputText
                        id="status_name"
                        placeholder='masukkan nama status'
                        value={checkInStatusData.status_name}
                        onChange={(e) => setCheckInStatusData({ ...checkInStatusData, status_name: e.target.value })}
                        required
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label htmlFor="description">Deskripsi <span className='text-red-600'>*</span></label>
                    <InputText
                        id="description"
                        placeholder='masukkan deskripsi status'
                        value={checkInStatusData.description}
                        onChange={(e) => setCheckInStatusData({ ...checkInStatusData, description: e.target.value })}
                    />
                </div>
                <div className="field">
                    <label htmlFor="late_duration">Durasi Keterlambatan (Menit) <span className='text-red-600'>*</span></label>
                    <InputText
                        id="late_duration"
                        type="number"
                        value={checkInStatusData.late_duration}
                        disabled={disableDefaultStatusForm}
                        onChange={(e) => setCheckInStatusData({ ...checkInStatusData, late_duration: parseInt(e.target.value) })}
                    />
                </div>
                <div className='field'>
                    <label htmlFor="status">Status <span className='text-red-600'>*</span></label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status1"
                                name="status"
                                value={1}
                                onChange={() => setCheckInStatusData({ ...checkInStatusData, is_active: 1 })}
                                checked={checkInStatusData.is_active === 1}
                                disabled={disableDefaultStatusForm}
                            />
                            <label htmlFor="status1" className="ml-2">Aktif</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status2"
                                name="status"
                                value={0}
                                onChange={() => setCheckInStatusData({ ...checkInStatusData, is_active: 0 })}
                                checked={checkInStatusData.is_active === 0}
                                disabled={disableDefaultStatusForm}
                            />
                            <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div >
    );
};

export default SchoolCheckInStatusPage;
