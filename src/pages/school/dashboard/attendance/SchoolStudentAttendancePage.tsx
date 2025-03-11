/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar, CalendarProps } from "primereact/calendar"
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import classGroupService from "../../../../services/classGroupService";
import { useSchool } from "../../../../context/SchoolContext";
import { useAuth } from "../../../../context/AuthContext";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import checkInStatusService from "../../../../services/checkInStatusService";
import attendanceService from "../../../../services/attendanceService";
import { Dialog } from "primereact/dialog";
import { addHours } from "date-fns";
import { MultiSelect } from "primereact/multiselect";
import { absencePermitService, absencePermitTypeService } from "../../../../services/absencePermitService";
import { FileUpload } from "primereact/fileupload";
import { Divider } from "primereact/divider";
import { Messages } from "primereact/messages";
import { useMountEffect } from "primereact/hooks";
import { Message } from "primereact/message";
import documentService from "../../../../services/documentService";
interface AttendanceData {
    id: number;
    attendance_window_id: number;
    student: {
        class_group: {
            class_name: string;
        };
        student_name: string;
    };
    check_in_time: Date | null;
    check_out_time: Date | null;
    check_in_status_id: number;
    check_in_status_late_duration: number;
}


const SchoolStudentAttendancePage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const [editAttendanceData, setEditAttendanceData] = useState<AttendanceData | null>(null);
    const [tempEditAttendanceData, setTempEditAttendanceData] = useState<AttendanceData | null>(null);
    const [listKelas, setListKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [loadingStatusPresensi, setLoadingStatusPresensi] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [listStatusPresensi, setListStatusPresensi] = useState([]);
    const [loadingStatusAbsensi, setLoadingStatusAbsensi] = useState(true);
    const [listStatusAbsensi, setListStatusAbsensi] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState<number[]>([]);
    const [selectedStatusPresensi, setSelectedStatusPresensi] = useState<number[]>([]);
    const [selectedStatusAbsensi, setSelectedStatusAbsensi] = useState(null);
    const [absenceDescription, setAbsenceDescription] = useState("");
    const [selectedAttendances, setSelectedAttendances] = useState([]);
    const [listAttendances, setListAttendances] = useState([]);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [file, setFile] = useState<File | null>(null);
    const msgs = useRef<Messages>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);

    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportStartDate, setExportStartDate] = useState<Date | null>(new Date());
    const [exportEndDate, setExportEndDate] = useState<Date | null>(new Date());
    const [exportKelas, setExportKelas] = useState<number[]>([]);



    const { school, handleExportAttendance, loadingExportAttendance } = useSchool();
    const { user } = useAuth();

    const toast = useRef<Toast>(null);

    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        student_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nis: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nisn: { value: null, matchMode: FilterMatchMode.CONTAINS },
        gender: { value: null, matchMode: FilterMatchMode.EQUALS },
        class_group_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    useEffect(() => {
        fetchAttendances(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
        fetchKelas();
        fetchStatusPresensi();
        fetchStatusAbsensi();
    }, []);

    const handleFileSelect = (event: any) => {
        if (event.files && event.files.length > 0) {
            const selectedFile = event.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('Format file harus PDF');
            }
        }
    };

    const handleClearFile = () => {
        setFile(null);
    };

    const handleStartDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setStartDate(localDate);

            if (endDate && localDate > endDate) {
                setEndDate(localDate);
            }
        }
    };

    const handleEndDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setEndDate(localDate);
        }
    };

    const handleExportStartDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setExportStartDate(localDate);

            if (endDate && localDate > endDate) {
                setExportEndDate(localDate);
            }
        }
    };

    const handleExportEndDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setExportEndDate(localDate);
        }
    };
    const formatToWIB = (dateInput: string | Date | null) => {
        if (!dateInput) return null;

        const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };


    const handleUpdate = async () => {
        try {
            if (!editAttendanceData) return;

            setLoadingSave(true);

            const formattedData: any = {
                attendance_window_id: editAttendanceData.attendance_window_id,
                check_in_time: formatToWIB(editAttendanceData.check_in_time),
                check_out_time: formatToWIB(editAttendanceData.check_out_time),
                check_in_status_id: editAttendanceData.check_in_status_id,
            };

            const isAttendanceChanged =
                JSON.stringify(editAttendanceData) !== JSON.stringify(tempEditAttendanceData);

            const isAbsence = listStatusPresensi.find(
                (status: { value: number; late_duration: number }) =>
                    status.value === editAttendanceData.check_in_status_id &&
                    status.late_duration === -1
            );

            if (!isAbsence) {
                if (!formattedData.check_in_time) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Gagal",
                        detail: "Waktu masuk tidak boleh kosong!",
                        life: 3000,
                    });
                    setLoadingSave(false);
                    return;
                }

                if (!formattedData.check_out_time) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Gagal",
                        detail: "Waktu pulang tidak boleh kosong!",
                        life: 3000,
                    });
                    setLoadingSave(false);
                    return;
                }

                const checkInTime = editAttendanceData.check_in_time ? new Date(editAttendanceData.check_in_time).getTime() : 0;
                const checkOutTime = editAttendanceData.check_out_time ? new Date(editAttendanceData.check_out_time).getTime() : 0;

                if (checkOutTime <= checkInTime) {
                    toast.current?.show({
                        severity: "error",
                        summary: "Gagal",
                        detail: "Waktu pulang harus setelah waktu masuk!",
                        life: 3000,
                    });
                    setLoadingSave(false);
                    return;
                }
            }

            let documentId = null;

            if (selectedStatusAbsensi && file) {
                try {
                    const uploadResponse = await documentService.createDocument(
                        `Bukti Absensi - ${editAttendanceData.student.student_name}`,
                        file
                    );

                    if (uploadResponse?.data?.id) {
                        documentId = uploadResponse.data.id;
                    }

                    toast.current?.show({
                        severity: "success",
                        summary: "Sukses",
                        detail: "Upload bukti absensi berhasil!",
                        life: 3000,
                    });
                } catch (error) {
                    console.error("Gagal mengunggah dokumen:", error);
                    toast.current?.show({
                        severity: "error",
                        summary: "Gagal",
                        detail: "Gagal mengunggah dokumen!",
                        life: 3000,
                    });
                    setLoadingSave(false);
                    return;
                }
            }

            if (isAttendanceChanged) {
                await attendanceService.updateAttendance(editAttendanceData.id, formattedData);

                toast.current?.show({
                    severity: "success",
                    summary: "Sukses",
                    detail: "Data kehadiran berhasil diperbarui!",
                    life: 3000,
                });
            }

            if (selectedStatusAbsensi) {
                await absencePermitService.create({
                    attendance_id: editAttendanceData.id,
                    absence_permit_type_id: selectedStatusAbsensi,
                    description: absenceDescription ?? "",
                    document_id: documentId ?? null,
                });

                toast.current?.show({
                    severity: "success",
                    summary: "Sukses",
                    detail: "Data absensi berhasil diperbarui!",
                    life: 3000,
                });
            }

            fetchAttendances(currentPage, rowsPerPage);
            setShowEditDialog(false);
        } catch (error) {
            console.error("Gagal memperbarui data kehadiran:", error);
            toast.current?.show({
                severity: "error",
                summary: "Gagal",
                detail: "Gagal memperbarui data kehadiran!",
                life: 3000,
            });
        } finally {
            setLoadingSave(false);
        }
    };



    const fetchAttendances = async (page = 1, perPage = 20) => {
        try {
            setLoadingAttendance(true);
            setListAttendances([]);
            const params: any = {
                page,
                perPage
            };

            if (startDate) {
                params.startDate = startDate.toLocaleDateString("en-CA");
            }
            if (endDate) {
                params.endDate = endDate.toLocaleDateString("en-CA");
            }

            if (selectedKelas && selectedKelas.length > 0) {
                params.classGroup = selectedKelas.join(',');
            }
            if (selectedStatusPresensi && selectedStatusPresensi.length > 0) {
                params.checkInStatusId = selectedStatusPresensi.join(',');
            }


            const response = await attendanceService.getAttendances(params);

            setListAttendances(response.data.data);
            setTotalRecords(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error("Error fetching attendances:", error);
        } finally {
            setLoadingAttendance(false);
        }
    };


    const fetchKelas = async () => {
        try {
            setLoadingKelas(true);
            if (!user?.school_id) return;
            const response = await classGroupService.getClassGroups(1, 100);
            setListKelas(response.responseData.data.data.map((kelas: { id: number; class_name: string }) => ({
                label: kelas.class_name,
                value: kelas.id
            })));

        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoadingKelas(false);
        }
    };

    const fetchStatusPresensi = async () => {
        try {
            setLoadingStatusPresensi(true);
            const { responseData } = await checkInStatusService.getAll(1, 100);
            setListStatusPresensi(responseData.data.data.map((status: { id: number; status_name: string, late_duration: number }) => ({
                label: status.status_name,
                late_duration: status.late_duration,
                value: status.id
            })));
        } catch (error) {
            console.error('Error fetching check-in status:', error);
            setListStatusPresensi([]);
        } finally {
            setLoadingStatusPresensi(false);
        }
    };


    const fetchStatusAbsensi = async () => {
        try {
            setLoadingStatusAbsensi(true);
            const responseData = await absencePermitTypeService.getAll(1, 100);
            setListStatusAbsensi(responseData.data.data.map((permit: { id: number; permit_name: string }) => ({
                label: permit.permit_name,
                value: permit.id
            })));
        } catch (error) {
            console.error('Error fetching absence permit type', error);
            setListStatusAbsensi([]);
        } finally {
            setLoadingStatusAbsensi(false);
        }
    };

    const confirmUpdate = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin memperbarui data kehadiran ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleUpdate(),
            reject: () => { },
        });
    };

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Waktu yang ditentukan akan menjadi default waktu presensi.',
            closable: false,
        });
    });

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Kehadiran {school ? school.name : "Loading..."}</h1>
                <div className="grid mt-4">
                    <div className="col-12 xl:col-6">
                        <h5>Pilih Tanggal Kehadiran <span className="text-red-600">*</span></h5>
                        <div className="flex gap-2">
                            <div>
                                <Calendar
                                    id="startDate"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    maxDate={endDate ?? undefined}
                                    readOnlyInput
                                    className="w-full"
                                    placeholder="Tanggal Awal"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                            <div className="my-auto">
                                -
                            </div>
                            <div>
                                <Calendar
                                    id="endDate"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    minDate={startDate ?? undefined}
                                    readOnlyInput
                                    className="w-full"
                                    placeholder="Tanggal Akhir"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Kelas</h5>
                        <MultiSelect filter placeholder="Silahkan Pilih Kelas" showClear loading={loadingKelas} value={selectedKelas} options={listKelas} onChange={(e) => {
                            setSelectedKelas(e.value);
                        }} optionLabel="label" className="w-full" />
                    </div>
                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Status Presensi</h5>
                        <MultiSelect filter placeholder="Silahkan Pilih Status Presensi" showClear loading={loadingStatusPresensi} value={selectedStatusPresensi} options={listStatusPresensi} onChange={(e) => {
                            setSelectedStatusPresensi(e.value);
                        }} optionLabel="label" className="w-full " />
                    </div>
                </div>
                <h3>Tampilkan data kehadiran siswa</h3>
                <Button icon="pi pi-upload" loading={loadingAttendance} label="Tampilkan" onClick={() => {
                    setCurrentPage(1);
                    fetchAttendances(1, rowsPerPage)
                }} />
            </div>
            <div className="card">
                <div className='flex flex-column md:flex-row justify-content-between p-4 card'>
                    <div className='flex flex-column mb-2 md:mb-0 md:flex-row gap-2'>
                        {/* <Button icon="pi pi-plus" severity='success' label='Kehadiran' onClick={() => {
                            setShowAddDialog(true);
                        }} /> */}
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedAttendances?.length} />
                    </div>
                    <Button
                        icon="pi pi-upload"
                        severity="help"
                        label="Export"
                        onClick={() => {
                            setExportStartDate(startDate);
                            setExportEndDate(endDate);
                            setExportKelas(selectedKelas);
                            setShowExportDialog(true)
                        }}
                    />
                </div>
                <DataTable
                    selectionMode="multiple"
                    dataKey='id'
                    value={listAttendances}
                    selection={selectedAttendances}
                    onSelectionChange={(e) => setSelectedAttendances(e.value)}
                    header={(
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Data kehadiran siswa {school ? school.name : "Loading"}</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" style={{ paddingLeft: "8px" }} />
                                <InputText
                                    className="py-2 pl-5"
                                    placeholder="Search..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </span>
                        </div>
                    )}
                    globalFilter={globalFilter}
                    emptyMessage={loadingAttendance ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data kehadiran...</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-calendar-times text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Belum ada data kehadiran</span>
                            <small className="text-gray-400">Silakan periksa tanggal atau lakukan presensi terlebih dahulu.</small>
                        </div>
                    )}
                    paginator
                    lazy
                    first={(currentPage - 1) * rowsPerPage}
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    onPage={(event) => {
                        setCurrentPage((event.page ?? 0) + 1);
                        setRowsPerPage(event.rows);
                    }}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} kehadiran"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                    <Column
                        field="student.student_name"
                        header="Nama"
                        body={(rowData) => rowData.student?.student_name?.toUpperCase()}
                    />
                    <Column field="student.nis" header="NIS"></Column>
                    <Column field="student.gender" header="Kelamin" body={(rowData) => rowData.student.gender === "male" ? "Laki-laki" : "Perempuan"}></Column>
                    <Column field="student.class_group.class_name" header="Kelas"></Column>
                    <Column
                        field="check_in_time"
                        header="Tanggal"
                        body={(rowData) =>
                            rowData.check_in_time ? new Date(rowData.check_in_time).toLocaleDateString("id-ID") : "-"
                        }
                    />
                    <Column field="check_in_time" header="Waktu Masuk" body={(rowData) => rowData.check_in_time ? new Date(rowData.check_in_time).toLocaleTimeString("id-ID") : "-"}></Column>
                    <Column field="check_out_time" header="Waktu Pulang" body={(rowData) => rowData.check_out_time ? new Date(rowData.check_out_time).toLocaleTimeString("id-ID") : "-"}></Column>
                    <Column field="check_in_status.status_name" header="Status"></Column>
                    <Column
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-success p-button-rounded"
                                    tooltip="Edit"
                                    tooltipOptions={{ position: "top" }}
                                    onClick={() => {
                                        setTempEditAttendanceData(rowData);
                                        setEditAttendanceData(rowData);
                                        console.log(rowData);
                                        setShowEditDialog(true);
                                    }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-rounded"
                                    tooltip="Hapus"
                                    tooltipOptions={{ position: "top" }}
                                    onClick={() => { }}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>
            <Dialog
                visible={showEditDialog}
                onHide={() => {
                    setShowEditDialog(false);
                    setSelectedStatusAbsensi(null);
                    setAbsenceDescription("");
                    setFile(null);
                }}
                header="Edit Kehadiran"
                modal
                style={{ width: "90vw", maxWidth: "600px" }}
            >
                {editAttendanceData && (
                    <div className="p-fluid">
                        <div className="grid">
                            <div className="col-6">
                                <div className="field">
                                    <label>Nama Siswa</label>
                                    <InputText value={editAttendanceData.student.student_name} disabled />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label>Kelas</label>
                                    <InputText value={editAttendanceData.student.class_group.class_name} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-6">
                                <div className="field">
                                    <label>Waktu Masuk</label>
                                    <Calendar
                                        value={editAttendanceData.check_in_time ? new Date(editAttendanceData.check_in_time) : null}
                                        onChange={(e) =>
                                            setEditAttendanceData({
                                                ...editAttendanceData,
                                                check_in_time: e.value ?? null,
                                            })
                                        }
                                        showTime
                                        hourFormat="24"
                                        showSeconds
                                        readOnlyInput
                                        disabled={listStatusPresensi.find(
                                            (status: { value: number; late_duration: number }) =>
                                                status.value === editAttendanceData.check_in_status_id &&
                                                status.late_duration === -1)}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label>Waktu Pulang</label>
                                    <Calendar
                                        value={editAttendanceData.check_out_time ? new Date(editAttendanceData.check_out_time) : null}
                                        onChange={(e) =>
                                            setEditAttendanceData({
                                                ...editAttendanceData,
                                                check_out_time: e.value ?? null,
                                            })
                                        }
                                        showTime
                                        hourFormat="24"
                                        showSeconds
                                        readOnlyInput
                                        disabled={listStatusPresensi.find(
                                            (status: { value: number; late_duration: number }) =>
                                                status.value === editAttendanceData.check_in_status_id &&
                                                status.late_duration === -1)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label>Status Presensi</label>
                            <Dropdown
                                value={editAttendanceData.check_in_status_id}
                                options={listStatusPresensi}
                                onChange={(e) =>
                                    setEditAttendanceData({
                                        ...editAttendanceData,
                                        check_in_status_id: e.value,
                                    })
                                }
                                placeholder="Pilih Status"
                            />
                        </div>

                        {listStatusPresensi.find(
                            (status: { value: number; late_duration: number }) =>
                                status.value === editAttendanceData.check_in_status_id &&
                                status.late_duration === -1
                        ) && (
                                <>
                                    <Divider />
                                    <Message
                                        style={{
                                            border: 'solid #696cff',
                                            borderWidth: '0 0 0 6px',
                                            color: '#696cff',
                                        }}
                                        className="border-primary w-full justify-content-start"
                                        severity="info"
                                        content={
                                            <div className="flex align-items-center">
                                                <i className="pi pi-calendar" style={{ fontSize: '1.5rem', color: '#696cff' }} />
                                                <div className="ml-2">Lengkapi Bukti Absensi.</div>
                                            </div>
                                        }
                                    />
                                    <br />
                                    <div className="field">
                                        <label>Status Absensi</label>
                                        <Dropdown
                                            filter
                                            placeholder="Silahkan Pilih Status Absensi"
                                            showClear
                                            loading={loadingStatusAbsensi}
                                            value={selectedStatusAbsensi}
                                            options={listStatusAbsensi}
                                            onChange={(e) => setSelectedStatusAbsensi(e.value)}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field">
                                        <label>Keterangan Absensi</label>
                                        <InputText value={absenceDescription} placeholder="Keterangan siswa tidak masuk" onChange={(value) => {
                                            setAbsenceDescription(value.target.value);
                                        }} />
                                    </div>
                                    <div className="field">
                                        <label>Bukti Absensi</label>
                                        <div className="mt-2 flex flex-column gap-2">
                                            {!file && (
                                                <FileUpload
                                                    name="demo[]"
                                                    accept="application/pdf"
                                                    mode="basic"
                                                    maxFileSize={1000000}
                                                    chooseLabel="Pilih File"
                                                    customUpload
                                                    onSelect={handleFileSelect}
                                                    auto={false}
                                                    emptyTemplate={<p className="m-0">Upload file disini.</p>}
                                                />
                                            )}
                                            {file && (
                                                <div className="flex align-items-center justify-content-between p-2 border-round border-1 surface-border">
                                                    <div className="flex gap-2">
                                                        <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: '#FF5252' }}></i>
                                                        <div className="flex flex-column justify-content-start">
                                                            <div
                                                                className="overflow-hidden text-left text-overflow-ellipsis white-space-nowrap w-22rem"
                                                                title={file.name}
                                                            >
                                                                {file.name}
                                                            </div>
                                                            <small className="text-left">
                                                                {(file.size / 1024).toFixed(2)} KB
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={URL.createObjectURL(file)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={file.name}
                                                        >
                                                            <Button
                                                                icon="pi pi-eye"
                                                                className="p-button-sm p-button-outlined"
                                                                tooltip="Lihat File"
                                                            />
                                                        </a>
                                                        <Button
                                                            icon="pi pi-trash"
                                                            className="p-button-sm p-button-danger"
                                                            onClick={handleClearFile}
                                                            tooltip="Hapus File"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Divider />
                                </>
                            )}
                        <Button
                            label="Simpan"
                            icon="pi pi-check"
                            loading={loadingSave}
                            disabled={JSON.stringify(editAttendanceData) === JSON.stringify(tempEditAttendanceData) && !selectedStatusAbsensi}
                            onClick={(e) => {
                                confirmUpdate(e);
                            }}
                        />
                    </div>
                )}
            </Dialog>
            <Dialog
                header="Export Data Kehadiran"
                visible={showExportDialog}
                style={{ width: "90vw", maxWidth: "600px" }}
                onHide={() => { setExportKelas([]); setExportStartDate(new Date()); setExportEndDate(new Date()); setShowExportDialog(false); }}
            >
                <div className="flex flex-column gap-3">
                    <label className="font-bold">Tanggal</label>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Calendar
                                id="exportStartDate"
                                value={exportStartDate}
                                onChange={handleExportStartDateChange}
                                maxDate={exportEndDate ?? undefined}
                                readOnlyInput
                                className="w-full"
                                placeholder="Tanggal Awal"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                        <div className="my-auto">
                            -
                        </div>
                        <div className="w-full">
                            <Calendar
                                id="exportEndDate"
                                value={exportEndDate}
                                onChange={handleExportEndDateChange}
                                minDate={exportStartDate ?? undefined}
                                readOnlyInput
                                className="w-full"
                                placeholder="Tanggal Akhir"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                    </div>
                    <label className="font-bold">Kelas</label>
                    <MultiSelect
                        value={exportKelas}
                        options={listKelas}
                        onChange={(e) => setExportKelas(e.value)}
                        placeholder="Pilih Kelas"
                        loading={loadingKelas}
                        showClear
                        multiple
                        filter
                        style={{ width: "100%", maxWidth: "100%" }}
                        panelStyle={{ maxHeight: "300px", overflowY: "auto" }}
                    />

                    <Button
                        label="Export"
                        icon="pi pi-download"
                        className="p-button-success"
                        onClick={() => handleExportAttendance({ exportKelas, exportStartDate, exportEndDate })}
                        loading={loadingExportAttendance}
                    />
                </div>
            </Dialog>

        </>
    )
}

export default SchoolStudentAttendancePage;