/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
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
import { format, formatDate } from 'date-fns';
import { hasAnyPermission } from '../../../../utils/hasAnyPermissions';
import attendanceWindowService from '../../../../services/attendanceWindowService';
import { Calendar } from 'primereact/calendar';

const defaultCheckInStatus = {
    status_name: '',
    description: '',
    late_duration: 0,
    is_active: 1,
};

const SchoolAttendanceWindowPage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [generateDialog, setGenerateDialog] = useState(false);
    const [generateDate, setGenerateDate] = useState<Date | null>(null);
    const [checkInStatusData, setCheckInStatusData] = useState<any>(defaultCheckInStatus);
    const [originalData, setOriginalData] = useState<any>(defaultCheckInStatus);
    const [selectedAttendanceWindow, setSelectedAttendanceWindow] = useState<any>({});
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

    const handleGenerateWindow = async () => {
        if (!generateDate) return;

        try {
            setLoadingButton(true);
            await attendanceWindowService.generateAttendanceWindow({
                date: generateDate?.toLocaleDateString('sv-SE'),
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Waktu presensi berhasil dibuat.',
                life: 3000,
            });
            setGenerateDialog(false);
            setGenerateDate(null);
            fetchAttendanceWindow();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal membuat waktu presensi';
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: message,
                life: 4000,
            });
        } finally {
            setLoadingButton(false);
        }
    };


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

    const isAttendanceWindowValid = () => {
        const aw = selectedAttendanceWindow;
        return (
            aw.name &&
            aw.date &&
            aw.check_in_start_time &&
            aw.check_in_end_time &&
            aw.check_out_start_time &&
            aw.check_out_end_time &&
            aw.check_in_start_time < aw.check_in_end_time &&
            aw.check_in_end_time < aw.check_out_start_time &&
            aw.check_out_start_time < aw.check_out_end_time
        );
    };

    const handleSaveAttendanceWindow = async () => {
        try {
            setLoadingButton(true);
            await attendanceWindowService.updateAttendanceWindow(selectedAttendanceWindow.id, selectedAttendanceWindow);
            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Waktu presensi berhasil diperbarui.',
                life: 3000,
            });
            setShowDialog(false);
            fetchAttendanceWindow();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Gagal memperbarui waktu presensi.',
                life: 3000,
            });
        } finally {
            setLoadingButton(false);
        }
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
                            <Button icon="pi pi-calendar-plus" severity="success" label="Generate Waktu Presensi" onClick={() => setGenerateDialog(true)} />
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
                <Column
                    body={(rowData) => (
                        <Button
                            icon="pi pi-pencil"
                            className="p-button-text p-button-sm"
                            onClick={() => {
                                setSelectedAttendanceWindow(rowData);
                                setShowDialog(true);
                            }}
                            tooltip="Ubah"
                            tooltipOptions={{ position: 'top' }}
                        />
                    )}
                    style={{ width: '80px' }}
                />

            </DataTable>

            <Dialog
                visible={showDialog}
                style={{ width: '600px' }}
                onHide={() => {
                    setShowDialog(false);
                    setSelectedAttendanceWindow({});
                }}
                header="Ubah Waktu Presensi"
                modal
                className="p-fluid"
                footer={
                    <div>
                        <Button
                            label="Batal"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => {
                                setShowDialog(false);
                                setSelectedAttendanceWindow({});
                            }}
                        />
                        <Button
                            label="Simpan"
                            icon="pi pi-check"
                            loading={loadingButton}
                            onClick={handleSaveAttendanceWindow}
                            disabled={!isAttendanceWindowValid()}
                        />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="name">Nama <span className="text-red-500">*</span></label>
                    <InputText
                        id="name"
                        value={selectedAttendanceWindow.name || ''}
                        onChange={(e) =>
                            setSelectedAttendanceWindow({
                                ...selectedAttendanceWindow,
                                name: e.target.value,
                            })
                        }
                        placeholder="Nama presensi"
                    />
                </div>

                <div className="field">
                    <label htmlFor="date">Tanggal <span className="text-red-500">*</span></label>
                    <Calendar
                        id="date"
                        value={selectedAttendanceWindow.date ? new Date(selectedAttendanceWindow.date) : null}
                        onChange={(e) =>
                            setSelectedAttendanceWindow({
                                ...selectedAttendanceWindow,
                                date: e.value ? format(e.value, 'yyyy-MM-dd') : '',
                            })
                        }
                        dateFormat="yy-mm-dd"
                        showIcon
                    />
                </div>

                <div className="grid">
                    <div className="col-6 field">
                        <label>Masuk Mulai <span className="text-red-500">*</span></label>
                        <Calendar
                            value={selectedAttendanceWindow.check_in_start_time ? new Date(`1970-01-01T${selectedAttendanceWindow.check_in_start_time}`) : null}
                            onChange={(e) =>
                                setSelectedAttendanceWindow({
                                    ...selectedAttendanceWindow,
                                    check_in_start_time: e.value ? formatDate(e.value, 'HH:mm:ss') : '',
                                })
                            }
                            timeOnly
                            hourFormat="24"
                            showIcon
                            placeholder="HH:mm:ss"
                        />
                    </div>

                    <div className="col-6 field">
                        <label>Masuk Selesai <span className="text-red-500">*</span></label>
                        <Calendar
                            value={selectedAttendanceWindow.check_in_end_time ? new Date(`1970-01-01T${selectedAttendanceWindow.check_in_end_time}`) : null}
                            onChange={(e) =>
                                setSelectedAttendanceWindow({
                                    ...selectedAttendanceWindow,
                                    check_in_end_time: e.value ? formatDate(e.value, 'HH:mm:ss') : '',
                                })
                            }
                            timeOnly
                            hourFormat="24"
                            showIcon
                            placeholder="HH:mm:ss"
                        />
                    </div>

                    <div className="col-6 field">
                        <label>Pulang Mulai <span className="text-red-500">*</span></label>
                        <Calendar
                            value={selectedAttendanceWindow.check_out_start_time ? new Date(`1970-01-01T${selectedAttendanceWindow.check_out_start_time}`) : null}
                            onChange={(e) =>
                                setSelectedAttendanceWindow({
                                    ...selectedAttendanceWindow,
                                    check_out_start_time: e.value ? formatDate(e.value, 'HH:mm:ss') : '',
                                })
                            }
                            timeOnly
                            hourFormat="24"
                            showIcon
                            placeholder="HH:mm:ss"
                        />
                    </div>

                    <div className="col-6 field">
                        <label>Pulang Selesai <span className="text-red-500">*</span></label>
                        <Calendar
                            value={selectedAttendanceWindow.check_out_end_time ? new Date(`1970-01-01T${selectedAttendanceWindow.check_out_end_time}`) : null}
                            onChange={(e) =>
                                setSelectedAttendanceWindow({
                                    ...selectedAttendanceWindow,
                                    check_out_end_time: e.value ? formatDate(e.value, 'HH:mm:ss') : '',
                                })
                            }
                            timeOnly
                            hourFormat="24"
                            showIcon
                            placeholder="HH:mm:ss"
                        />
                    </div>

                    {!isAttendanceWindowValid() && (
                        <Message
                            severity="warn"
                            text="Pastikan semua kolom waktu terisi dengan benar dan urutan waktunya valid."
                            className="mt-3"
                        />
                    )}
                </div>
            </Dialog>


            <Dialog
                visible={generateDialog}
                style={{ width: '400px' }}
                header="Generate Waktu Presensi"
                modal
                className="p-fluid"
                onHide={() => { setGenerateDialog(false); setGenerateDate(null); }}
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => { setGenerateDialog(false); setGenerateDate(null); }} />
                        <Button label="Generate" icon="pi pi-check" loading={loadingButton} onClick={handleGenerateWindow} disabled={!generateDate} />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="generate-date">Pilih Tanggal <span className="text-red-500">*</span></label>
                    <Calendar
                        id="generate-date"
                        value={generateDate}
                        onChange={(e) => setGenerateDate(e.value ?? null)}
                        dateFormat="yy-mm-dd"
                        showIcon
                        placeholder="Pilih tanggal"
                    />
                </div>
            </Dialog>


        </div >
    );
};

export default SchoolAttendanceWindowPage;
