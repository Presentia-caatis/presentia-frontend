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
interface AbsenceData {
    id: number;
    student: {
        class_group: {
            class_name: string;
        };
        student_name: string;
    };
    check_in_time: Date | null;
    check_out_time: Date | null;
    check_in_status_id: number;
}


const SchoolStudentAbsencePermitPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const [editAbsenceData, setEditAbsenceData] = useState<AbsenceData | null>(null);
    const [tempEditAttendanceData, setTempEditAttendanceData] = useState<AbsenceData | null>(null);
    const [listKelas, setListKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingAbsence, setLoadingAbsence] = useState(true);
    const [loadingStatusAbsensi, setLoadingStatusAbsensi] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [listStatusAbsensi, setListStatusAbsensi] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState<number[]>([]);
    const [selectedStatusAbsensi, setSelectedStatusAbsensi] = useState<number[]>([]);
    const [selectedAttendances, setSelectedAttendances] = useState([]);
    const [listAttendances, setListAbsence] = useState([]);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

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
        fetchAbsences(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
        fetchKelas();
        fetchStatusAbsensi();
    }, []);

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

    const handleUpdate = async () => {
        try {
            if (!editAbsenceData) return;
            if (JSON.stringify(tempEditAttendanceData) === JSON.stringify(editAbsenceData)) return;

            setLoadingSave(true);

            const formatToWIB = (dateInput: string | Date | null) => {
                if (!dateInput) return null;

                const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

                return date.toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }).replace(/\//g, "-").replace(",", "");
            };

            const formattedData = {
                check_in_time: formatToWIB(editAbsenceData.check_in_time),
                check_out_time: formatToWIB(editAbsenceData.check_out_time),
                check_in_status_id: editAbsenceData.check_in_status_id,
            };

            await attendanceService.updateAttendance(editAbsenceData.id, formattedData);

            toast.current?.show({
                severity: "success",
                summary: "Sukses",
                detail: "Berhasil memperbarui data kehadiran!",
                life: 3000,
            });

            fetchAbsences(currentPage, rowsPerPage);
            setShowEditDialog(false);
        } catch (error) {
            console.error("Gagal memperbarui data kehadiran", error);
        } finally {
            setLoadingSave(false);
        }
    };

    const fetchAbsences = async (page = 1, perPage = 20) => {
        try {
            setLoadingAbsence(true);
            setListAbsence([]);
            const params: any = {
                page,
                perPage
            };

            if (startDate) {
                params.startDate = startDate.toISOString().split("T")[0];
            }
            if (endDate) {
                params.endDate = endDate.toISOString().split("T")[0];
            }

            if (selectedKelas && selectedKelas.length > 0) {
                params.classGroup = selectedKelas.join(',');
            }
            if (selectedStatusAbsensi && selectedStatusAbsensi.length > 0) {
                params.checkInStatusId = selectedStatusAbsensi.join(',');
            }


            const response = await absencePermitService.getAll();

            setListAbsence(response.data.data);
            setTotalRecords(response.data.total);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error("Error fetching attendances:", error);
        } finally {
            setLoadingAbsence(false);
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

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Izin Absensi Siswa</h1>
                <div className="grid mt-4">
                    <div className="col-12 xl:col-6">
                        <h5>Pilih Tanggal <span className="text-red-600">*</span></h5>
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
                        <h5>Pilih Status Absensi</h5>
                        <MultiSelect filter placeholder="Silahkan Pilih Status Absensi" showClear loading={loadingStatusAbsensi} value={selectedStatusAbsensi} options={listStatusAbsensi} onChange={(e) => {
                            setSelectedStatusAbsensi(e.value);
                        }} optionLabel="label" className="w-full " />
                    </div>
                </div>
                <h3>Tampilkan data kehadiran siswa</h3>
                <Button icon="pi pi-upload" loading={loadingAbsence} label="Tampilkan" onClick={() => {
                    setCurrentPage(1);
                    fetchAbsences(1, rowsPerPage)
                }} />
            </div>
            <div className="card">
                <div className='flex flex-column md:flex-row justify-content-between p-4 card'>
                    <div className='flex flex-column mb-2 md:mb-0 md:flex-row gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Absensi' onClick={() => {
                            setShowAddDialog(true);
                        }} />
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
                    emptyMessage={loadingAbsence ? (
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
                                        setEditAbsenceData(rowData);
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
                visible={showAddDialog}
                onHide={() => setShowAddDialog(false)}
                header="Tambah Izin"
                modal
            >
                {editAbsenceData && (
                    <div className="p-fluid">
                        <div className="field">
                            <label>Nama Siswa</label>
                            <InputText value={editAbsenceData.student.student_name} disabled />
                        </div>
                        <div className="field">
                            <label>Kelas</label>
                            <InputText value={editAbsenceData.student.class_group.class_name} disabled />
                        </div>
                        <div className="field">
                            <label>Waktu Masuk</label>
                            <Calendar
                                value={editAbsenceData.check_in_time ? new Date(editAbsenceData.check_in_time) : null}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_in_time: e.value ?? null })}
                                showTime
                                hourFormat="24"
                                showSeconds
                                readOnlyInput
                            />
                        </div>

                        <div className="field">
                            <label>Waktu Pulang</label>
                            <Calendar
                                value={editAbsenceData.check_out_time ? new Date(editAbsenceData.check_out_time) : null}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_out_time: e.value ?? null })}
                                showTime
                                hourFormat="24"
                                showSeconds
                                readOnlyInput
                            />
                        </div>

                        <div className="field">
                            <label>Status</label>
                            <Dropdown
                                value={editAbsenceData.check_in_status_id}
                                options={listStatusAbsensi}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_in_status_id: e.value })}
                                placeholder="Pilih Status"
                            />
                        </div>

                        <Button
                            label="Simpan"
                            icon="pi pi-check"
                            loading={loadingSave}
                            disabled={JSON.stringify(editAbsenceData) === JSON.stringify(tempEditAttendanceData)}
                            onClick={(e) => { confirmUpdate(e) }}
                        />
                    </div>
                )}
            </Dialog>

            <Dialog
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                header="Edit Kehadiran"
                modal
            >
                {editAbsenceData && (
                    <div className="p-fluid">
                        <div className="field">
                            <label>Nama Siswa</label>
                            <InputText value={editAbsenceData.student.student_name} disabled />
                        </div>
                        <div className="field">
                            <label>Kelas</label>
                            <InputText value={editAbsenceData.student.class_group.class_name} disabled />
                        </div>
                        <div className="field">
                            <label>Waktu Masuk</label>
                            <Calendar
                                value={editAbsenceData.check_in_time ? new Date(editAbsenceData.check_in_time) : null}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_in_time: e.value ?? null })}
                                showTime
                                hourFormat="24"
                                showSeconds
                                readOnlyInput
                            />
                        </div>

                        <div className="field">
                            <label>Waktu Pulang</label>
                            <Calendar
                                value={editAbsenceData.check_out_time ? new Date(editAbsenceData.check_out_time) : null}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_out_time: e.value ?? null })}
                                showTime
                                hourFormat="24"
                                showSeconds
                                readOnlyInput
                            />
                        </div>

                        <div className="field">
                            <label>Status</label>
                            <Dropdown
                                value={editAbsenceData.check_in_status_id}
                                options={listStatusAbsensi}
                                onChange={(e) => setEditAbsenceData({ ...editAbsenceData, check_in_status_id: e.value })}
                                placeholder="Pilih Status"
                            />
                        </div>

                        <Button
                            label="Simpan"
                            icon="pi pi-check"
                            loading={loadingSave}
                            disabled={JSON.stringify(editAbsenceData) === JSON.stringify(tempEditAttendanceData)}
                            onClick={(e) => { confirmUpdate(e) }}
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

export default SchoolStudentAbsencePermitPage;