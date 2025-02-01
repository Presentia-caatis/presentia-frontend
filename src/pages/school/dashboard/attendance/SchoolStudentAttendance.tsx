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
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";

const SchoolStudentAttendance = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editAttendanceData, setEditAttendanceData] = useState<null>(null);
    const [tempEditAttendanceData, setTempEditAttendanceData] = useState<null>(null);
    const [listKelas, setListKelas] = useState([]);
    const listJenisKehadiran = ([{
        label: "Presensi",
        value: "presensi",
    },
    {
        label: "Absensi",
        value: "absensi",
    },
    ]);
    const [selectedKelas, setSelectedKelas] = useState();
    const [selectedJenisKehadiran, setSelectedJenisKehadiran] = useState();
    const [selectedAttendances, setSelectedAttendances] = useState([]);
    const [date, setDate] = useState(new Date());
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
        fetchKelas();
    }, []);

    const fetchKelas = async () => {
        try {
            if (!user?.school_id) return;
            const response = await classGroupService.getClassGroups();
            setListKelas(response.responseData.data.map((kelas: { id: number; class_name: string }) => ({
                label: kelas.class_name,
                value: kelas.id
            })));

        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const confirmGenerateAttendance = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menampilkan data kehadiran siswa?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => { },
            reject: () => { },
        });
    };


    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Kehadiran {school.name}</h1>
                <div className="grid mt-4">
                    <div className="col-12 xl:col-6">
                        <h5>Pilih Tanggal Kehadiran  <span className='text-red-600'>*</span></h5>
                        <div className="flex gap-2">
                            <Calendar id="date" value={date} className="w-8" />
                            <div className="my-auto">-</div>
                            <Calendar id="date" value={date} className="w-8" />
                        </div>
                    </div>
                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Kelas</h5>
                        <Dropdown placeholder="Silahkan Pilih Kelas" value={selectedKelas} options={listKelas} onChange={(e) => {
                            setSelectedKelas(e.value);
                        }} optionLabel="label" className="w-full" />
                    </div>
                    <div className=" col-12 xl:col-3">
                        <h5>Pilih Jenis Kehadiran</h5>
                        <Dropdown placeholder="Silahkan Pilih Jenis Kehadiran" value={selectedJenisKehadiran} options={listJenisKehadiran} onChange={(e) => {
                            setSelectedJenisKehadiran(e.value);
                        }} optionLabel="label" className="w-full " />
                    </div>
                </div>
                <h3>Tampilkan data kehadiran siswa</h3>
                <Button icon="pi pi-upload" label="Tampilkan" onClick={confirmGenerateAttendance} />
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
                <DataTable paginator header={
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
                } rows={20} globalFilter={globalFilter} filters={filters} rowsPerPageOptions={[20, 50, 75, 100]} emptyMessage="Data kehadiran belum ditampilkan" tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students">
                    <Column sortable field="nama" header="Nama"></Column>
                    <Column sortable field="nis" header="NIS"></Column>
                    <Column sortable field="kelamin" header="Kelamin"></Column>
                    <Column sortable field="kelas" header="Kelas"></Column>
                    <Column sortable field="date" header="Tanggal"></Column>
                    <Column sortable field="check_in_time" header="Waktu presensi masuk"></Column>
                    <Column sortable field="check_out_time" header="Waktu absensi pulang"></Column>
                    <Column sortable field="status" header="Status"></Column>
                    <Column
                        body={(rowData) =>
                        (
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
                        )
                        }
                    />
                </DataTable>
            </div>
        </>
    )
}

export default SchoolStudentAttendance;