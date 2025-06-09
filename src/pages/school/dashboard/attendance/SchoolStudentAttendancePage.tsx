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
    attendance_window: {
        date: string;
    };
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
    const [previewMode, setPreviewMode] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [loadPermit, setLoadPermit] = useState(false);
    const [editAttendanceData, setEditAttendanceData] = useState<AttendanceData | null>(null);
    const [tempEditAttendanceData, setTempEditAttendanceData] = useState<AttendanceData | null>(null);
    const [listKelas, setListKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [loadingStatusPresensi, setLoadingStatusPresensi] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [listStatusPresensi, setListStatusPresensi] = useState([]);
    const [loadingStatusAbsensi, setLoadingStatusAbsensi] = useState(true);
    const [listStatusAbsensi, setListStatusAbsensi] = useState<{ label: string; value: number }[]>([]);
    const [selectedKelas, setSelectedKelas] = useState<number[]>([]);
    const [selectedStatusPresensi, setSelectedStatusPresensi] = useState<number[]>([]);
    const [selectedStatusAbsensi, setSelectedStatusAbsensi] = useState(null);
    const [absenceDescription, setAbsenceDescription] = useState("Siswa tidak masuk");
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

    const [globalFilter, setGlobalFilter] = useState('');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
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
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchAttendances();
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [globalFilter]);

    useEffect(() => {
        fetchKelas();
        fetchStatusPresensi();
        fetchStatusAbsensi();
    }, []);

    const handleFileSelect = (event: any) => {
        if (event.files && event.files.length > 0) {
            const selectedFile = event.files[0];
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Format file harus PDF, JPG, atau PNG!",
                    life: 3000,
                });
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

    const mergeDateAndTime = (dateStr: string, timeInput: Date | string | null) => {
        if (!timeInput) return null;

        const time = typeof timeInput === "string" ? new Date(timeInput) : timeInput;
        const [year, month, day] = dateStr.split("-");

        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };


    useEffect(() => {
        if (showAddDialog || showEditDialog || showExportDialog) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => document.body.classList.remove('modal-open');
    }, [showAddDialog, showEditDialog, showExportDialog]);


    const handleUpdate = async () => {
        try {
            if (!editAttendanceData) return;

            setLoadingSave(true);

            const formattedData: any = {
                attendance_window_id: editAttendanceData.attendance_window_id,
                check_in_time: mergeDateAndTime(editAttendanceData.attendance_window.date, editAttendanceData.check_in_time),
                check_out_time: mergeDateAndTime(editAttendanceData.attendance_window.date, editAttendanceData.check_out_time),
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
                    const now = new Date();
                    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
                    const formattedTime = wibTime.toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        hour12: false,
                    });
                    const uploadResponse = await documentService.createDocument(
                        `Bukti Absensi - ${editAttendanceData.student.student_name} (${formattedTime})`,
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
                const attendanceIds = [editAttendanceData.id];

                await absencePermitService.create({
                    attendance_ids: attendanceIds,
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
            setSelectedStatusAbsensi(null);
            setAbsenceDescription("Siswa tidak masuk")
            setFile(null);
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

    const getAbsencePermitById = async (id: number) => {
        try {
            const response = await absencePermitService.getById(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching absence permit:', error);
            return null;
        }
    }


    const fetchAttendances = async (page = 1, perPage = 20) => {
        try {
            if (!user?.school_id) return;
            setLoadingAttendance(true);
            setListAttendances([]);
            const params: any = {
                page,
                perPage,
                school_id: user.school_id,
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

            if (globalFilter) {
                params.search = globalFilter;
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
            const response = await classGroupService.getClassGroups(1, 100, {}, Number(user.school_id));
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

    const confirmExport = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin export data kehadiran ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleExportAttendance({ exportKelas, exportStartDate, exportEndDate }),
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

    const handleEditAttendanceClick = async (rowData: any) => {
        setTempEditAttendanceData(rowData);
        setEditAttendanceData(rowData);

        if (rowData.absence_permit_id) {
            setLoadPermit(true);
            setSelectedStatusAbsensi(rowData.absence_permit_id);
            try {
                const permit = await getAbsencePermitById(rowData.absence_permit_id);
                if (permit.description == "") {
                    setAbsenceDescription("Siswa tidak masuk");
                }
                setAbsenceDescription(permit.description);

                if (permit?.document?.path) {
                    try {
                        const response = await fetch(permit.document.path);
                        const blob = await response.blob();

                        const fileName = permit.document.document_name || 'document';
                        const fileExtension = permit.document.path.split('.').pop() || '';
                        const fileType = blob.type || `image/${fileExtension}`;

                        const file = new File([blob], `${fileName}.${fileExtension}`, {
                            type: fileType
                        });

                        setFile(file);
                    } catch (error) {
                        console.error("Failed to fetch document", error);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch absence permit", error);
            } finally {
                setLoadPermit(false);
            }
        }

        console.log(rowData);
        setShowEditDialog(true);
    };


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
                        {
                            // user?.permissions?.includes("manage_attendance") && (
                            //     <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedAttendances?.length} />
                            // )
                        }
                        <Button
                            icon="pi pi-copy"
                            severity="secondary"
                            label="Salin Tautan Halaman Kehadiran Publik"
                            tooltip="Halaman kehadiran yang dapat diakses tanpa login"
                            onClick={() => {
                                const publicLink = `${window.location.origin}/kehadiran/${user?.school_id}`;
                                navigator.clipboard.writeText(publicLink).then(() => {
                                    toast.current?.show({
                                        severity: 'success',
                                        summary: 'Berhasil',
                                        detail: 'Link kehadiran publik berhasil disalin!',
                                        life: 3000
                                    });
                                }).catch(() => {
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Gagal',
                                        detail: 'Gagal menyalin link.',
                                        life: 3000
                                    });
                                });
                            }}
                        />
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
                            rowData.attendance_window.date ? rowData.attendance_window.date : "-"
                        }
                    />
                    <Column field="check_in_time" header="Waktu Masuk" body={(rowData) => rowData.check_in_time ? new Date(rowData.check_in_time).toLocaleTimeString("id-ID") : "-"}></Column>
                    <Column field="check_out_time" header="Waktu Pulang" body={(rowData) => rowData.check_out_time ? new Date(rowData.check_out_time).toLocaleTimeString("id-ID") : "-"}></Column>
                    <Column
                        header="Status"
                        body={(rowData) => {
                            const status = rowData.check_in_status?.status_name || "-";
                            const permit = listStatusAbsensi.find(p => p.value === rowData.absence_permit_id);
                            const permitLabel = permit ? permit.label : null;

                            return (
                                <div>
                                    <div>{status}</div>
                                    {permitLabel && <div className="text-md text-gray-500">({permitLabel})</div>}
                                </div>
                            );
                        }}
                    />


                    <Column
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-eye"
                                    className="p-button-info  p-button-rounded"
                                    tooltip="Lihat"
                                    tooltipOptions={{ position: "top" }}
                                    onClick={async () => {
                                        setPreviewMode(true);
                                        await handleEditAttendanceClick(rowData)
                                    }}
                                />
                                {
                                    user?.permissions?.includes("manage_attendance") && (
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-success p-button-rounded"
                                            tooltip="Edit"
                                            tooltipOptions={{ position: "top" }}
                                            loading={loadPermit}
                                            disabled={loadPermit}
                                            onClick={async () => {
                                                setPreviewMode(false);
                                                await handleEditAttendanceClick(rowData)
                                            }}
                                        />

                                    )
                                }
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
                    setAbsenceDescription("Siswa tidak masuk");
                    setPreviewMode(false);
                    setFile(null);
                }}
                header={`${previewMode ? "Lihat" : "Edit"} Kehadiran`}
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
                                        disabled={(listStatusPresensi.find(
                                            (status: { value: number; late_duration: number }) =>
                                                status.value === editAttendanceData.check_in_status_id &&
                                                status.late_duration === -1) || previewMode)}
                                        dateFormat="mm/dd/yy"
                                        timeOnly
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
                                        disabled={(listStatusPresensi.find(
                                            (status: { value: number; late_duration: number }) =>
                                                status.value === editAttendanceData.check_in_status_id &&
                                                status.late_duration === -1)) || previewMode}
                                        dateFormat="mm/dd/yy"
                                        timeOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label>Status Presensi</label>
                            <Dropdown
                                value={editAttendanceData.check_in_status_id}
                                options={listStatusPresensi}
                                disabled={previewMode}
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
                                            disabled={previewMode}
                                            onChange={(e) => setSelectedStatusAbsensi(e.value)}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field">
                                        <label>Keterangan Absensi</label>
                                        <InputText value={absenceDescription} disabled={previewMode} placeholder="Keterangan siswa tidak masuk" onChange={(value) => {
                                            setAbsenceDescription(value.target.value);
                                        }} />
                                    </div>
                                    <div className="field">
                                        <label>Bukti Absensi (Format: PDF, JPG, PNG | Ukuran maksimal 5 MB)</label>
                                        <div className="mt-2 flex flex-column gap-2">
                                            {!file && (
                                                <FileUpload
                                                    name="demo[]"
                                                    accept="application/pdf,image/jpeg,image/png"
                                                    mode="basic"
                                                    maxFileSize={5000000}
                                                    chooseLabel="Pilih File"
                                                    customUpload
                                                    onSelect={handleFileSelect}
                                                    auto={false}
                                                    disabled={previewMode}
                                                    emptyTemplate={<p className="m-0">Upload file disini.</p>}
                                                />
                                            )}
                                            {file && (
                                                <div className="flex align-items-center justify-content-between p-2 border-round border-1 surface-border">
                                                    <div className="flex gap-2">
                                                        {file.type === 'application/pdf' && (
                                                            <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem', color: '#FF5252' }}></i>
                                                        )}
                                                        {file.type === 'image/jpeg' && (
                                                            <i className="pi pi-image" style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                                                        )}
                                                        {file.type === 'image/png' && (
                                                            <i className="pi pi-image" style={{ fontSize: '1.5rem', color: '#4CAF50' }}></i>
                                                        )}
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
                        {
                            !previewMode && (
                                <Button
                                    label="Simpan"
                                    icon="pi pi-check"
                                    loading={loadingSave}
                                    disabled={JSON.stringify(editAttendanceData) === JSON.stringify(tempEditAttendanceData) && !selectedStatusAbsensi}
                                    onClick={(e) => {
                                        confirmUpdate(e);
                                    }}
                                />
                            )
                        }

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
                        onClick={(e) => confirmExport(e)}
                        loading={loadingExportAttendance}
                    />
                </div>
            </Dialog>

        </>
    )
}

export default SchoolStudentAttendancePage;