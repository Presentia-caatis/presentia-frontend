/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar } from "primereact/calendar"
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import classGroupService from "../../../../services/classGroupService";
import { useSchool } from "../../../../context/SchoolContext";
import { useAuth } from "../../../../context/AuthContext";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import checkInStatusService from "../../../../services/checkInStatusService";
import attendanceService from "../../../../services/attendanceService";
import { Nullable } from "primereact/ts-helpers";

const SchoolStudentAttendancePage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editAttendanceData, setEditAttendanceData] = useState<null>(null);
    const [tempEditAttendanceData, setTempEditAttendanceData] = useState<null>(null);
    const [listKelas, setListKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [loadingStatusPresensi, setLoadingStatusPresensi] = useState(true);
    const [listStatusPresensi, setListStatusPresensi] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState();
    const [selectedStatusPresensi, setSelectedStatusPresensi] = useState();
    const [selectedAttendances, setSelectedAttendances] = useState([]);
    const [listAttendances, setListAttendances] = useState([]);
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date(),
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);


    const { school } = useSchool();
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
    }, []);

    const fetchAttendances = async (page = 1, perPage = 10) => {
        try {
            setLoadingAttendance(true);
            setListAttendances([]);
            const params: any = {
                page,
                perPage
            };

            if (dates && dates.length === 2 && dates[0] && dates[1]) {
                params.startDate = dates[0].toISOString().split("T")[0];
                params.endDate = dates[1].toISOString().split("T")[0];
            }

            if (selectedKelas) {
                params.classGroup = selectedKelas;
            }
            if (selectedStatusPresensi) {
                params.checkInStatusId = selectedStatusPresensi;
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
            setListStatusPresensi(responseData.data.data.map((status: { id: number; status_name: string }) => ({
                label: status.status_name,
                value: status.id
            })));
        } catch (error) {
            console.error('Error fetching check-in status:', error);
            setListStatusPresensi([]);
        } finally {
            setLoadingStatusPresensi(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Kehadiran {school ? school.name : "Loading..."}</h1>
                <div className="grid mt-4">
                    <div className="col-12 xl:col-6">
                        <h5>Pilih Tanggal Kehadiran  <span className='text-red-600'>*</span></h5>
                        <div className="">
                            <Calendar
                                id="date"
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                hideOnRangeSelection
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Kelas</h5>
                        <Dropdown filter placeholder="Silahkan Pilih Kelas" showClear loading={loadingKelas} value={selectedKelas} options={listKelas} onChange={(e) => {
                            setSelectedKelas(e.value);
                        }} optionLabel="label" className="w-full" />
                    </div>
                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Status Presensi</h5>
                        <Dropdown filter placeholder="Silahkan Pilih Status Presensi" showClear loading={loadingStatusPresensi} value={selectedStatusPresensi} options={listStatusPresensi} onChange={(e) => {
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
                        <Button icon="pi pi-plus" severity='success' label='Kehadiran' onClick={() => {
                            setShowAddDialog(true);
                        }} />
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedAttendances?.length} />
                    </div>
                    <Button icon="pi pi-upload" severity='help' label='Export' />
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                    <Column field="student.student_name" header="Nama"></Column>
                    <Column field="student.nis" header="NIS"></Column>
                    <Column field="student.gender" header="Kelamin" body={(rowData) => rowData.student.gender === "male" ? "Laki-laki" : "Perempuan"}></Column>
                    <Column field="student.class_group.class_name" header="Kelas"></Column>
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
        </>
    )
}

export default SchoolStudentAttendancePage;