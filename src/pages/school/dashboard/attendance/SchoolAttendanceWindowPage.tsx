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
import { hasAnyPermission } from '../../../../utils/hasAnyPermissions';
import attendanceWindowService from '../../../../services/attendanceWindowService';

const defaultCheckInStatus = {
    status_name: '',
    description: '',
    late_duration: 0,
    is_active: 1,
};

const SchoolAttendanceWindowPage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [checkInStatusData, setCheckInStatusData] = useState<any>(defaultCheckInStatus);
    const [originalData, setOriginalData] = useState<any>(defaultCheckInStatus);
    const [selectedAttendanceWindow, setSelectedAttendanceWindow] = useState<any[]>([]);
    const [attendanceWindowList, setAttendanceWindowList] = useState<any[]>([]);
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
        fetchAttendanceWindow(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            content: (
                <div className="flex align-items-start gap-2">
                    <i className="pi pi-info-circle text-blue-500 text-xl mt-1" />
                    <div>
                        <p>
                            Halaman ini digunakan untuk mengatur <b>jam presensi</b> untuk <b>hari ini</b> dan <b>hari-hari sebelumnya</b>.<br />
                            Jika Anda ingin mengubah <b>jam presensi yang akan digunakan mulai besok dan seterusnya</b>, silakan buka halaman{' '}
                            <a
                                href={`/school/${user?.school_id}/default-attendance-time`}
                                className="text-primary underline"
                            >
                                Waktu Presensi Default
                            </a>.
                        </p>
                    </div>
                </div>
            ),
            closable: false,
        });
    });



    const fetchAttendanceWindow = async (page = 1, perPage = 20) => {
        try {
            setLoading(true);
            setAttendanceWindowList([]);
            const params: any = {
                school_id: user?.school_id,
                page,
                perPage,
            };
            params.page = page;
            params.per_page = perPage;
            params.sort = {
                ['date']: 'desc'
            }
            const response = await attendanceWindowService.getAttendanceWindow(params);
            setAttendanceWindowList(response.data?.data || []);
            console.log(response.data.total);
            setTotalRecords(response.data.total);
            console.log(totalRecords);
        } catch (error) {
            console.error('Error fetching check-in status:', error);
            setAttendanceWindowList([]);
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
            message: 'Apakah Anda yakin ingin menyimpan waktu presensi ini?',
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
            message: 'Apakah Anda yakin ingin menghapus waktu presensi ini?',
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
                    detail: 'waktu presensi berhasil diperbarui.',
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
                    detail: 'waktu presensi berhasil ditambahkan.',
                    life: 3000,
                });
            }
            setShowDialog(false);
            fetchAttendanceWindow();
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
                detail: 'Sedang menghapus data waktu presensi.',
                life: 3000,
            });
            await checkInStatusService.delete(id);
            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'waktu presensi berhasil dihapus.',
                life: 3000,
            });
            fetchAttendanceWindow();
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
            <h1>Konfigurasi Waktu Presensi</h1>
            <Toast ref={toast} />
            <Messages ref={msgs} />
            <ConfirmPopup />
            {
                hasAnyPermission(user, ['manage_schools']) && (
                    <div className="flex justify-content-between p-4 card">
                        <div className="flex gap-2">
                            <Button icon="pi pi-plus" severity="success" label="Tambah Jendela" onClick={() => setShowDialog(true)} />

                        </div>
                    </div>
                )
            }
            <DataTable
                dataKey="id"
                value={attendanceWindowList}
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
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} waktu presensi"
                stripedRows
                emptyMessage={
                    loading ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data waktu presensi...</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Belum ada data waktu presensi</span>
                            <small className="text-gray-400">Silakan tambahkan waktu presensi melalui tombol tambah status.</small>
                        </div>
                    )
                }
            >
                <Column field="name" header="Nama" sortable />
                <Column field="date" header="Tanggal" sortable />
                <Column field="check_in_start_time" header="Masuk Mulai" />
                <Column field="check_in_end_time" header="Masuk Selesai" />
                <Column field="check_out_start_time" header="Pulang Mulai" />
                <Column field="check_out_end_time" header="Pulang Selesai" />
                <Column field="type" header="Tipe" body={(rowData) => rowData.type === 'default' ? 'Default' : 'Libur'} />
            </DataTable>

            <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                onHide={() => { setShowDialog(false); resetForm() }}
                header="Tambah/Edit waktu presensi"
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => { setShowDialog(false); resetForm() }} />
                        <Button label="Simpan" icon="pi pi-check" loading={loadingButton} onClick={(e) => confirmSaveCheckInStatus(e)} disabled={!isDataValid() || !isDataChanged()} />
                    </div>
                }
                modal
                className="p-fluid"
            >
                <div className='field'>
                    {checkInStatusData.late_duration === -1 && (
                        <div className="p-message p-message-info p-component mb-3">
                            <div className="p-message-wrapper">
                                <span className="p-message-icon pi pi-info-circle"></span>
                                <div className="p-message-text">
                                    Status ini akan digunakan untuk siswa yang tidak melakukan presensi, nama disesuaikan dengan aturan ini.
                                </div>
                            </div>
                        </div>
                    )}

                    {checkInStatusData.late_duration === 0 && (
                        <div className="p-message p-message-info p-component mb-3">
                            <div className="p-message-wrapper">
                                <span className="p-message-icon pi pi-info-circle"></span>
                                <div className="p-message-text">
                                    Status ini akan digunakan untuk siswa yang presensi tepat waktu, nama disesuaikan dengan aturan ini.
                                </div>
                            </div>
                        </div>
                    )}

                </div>
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

export default SchoolAttendanceWindowPage;
