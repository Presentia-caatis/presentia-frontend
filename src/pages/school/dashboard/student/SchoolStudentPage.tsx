/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { useSchool } from '../../../../context/SchoolContext';
import studentService from '../../../../services/studentService';
import { useAuth } from '../../../../context/AuthContext';
import classGroupService from '../../../../services/classGroupService';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { FilterMatchMode } from 'primereact/api';
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { hasAnyPermission } from '../../../../utils/hasAnyPermissions';


type StudentData = {
    id: number;
    student_name: string;
    nis: string;
    nisn: string;
    gender: string;
    is_active: number;
    class_group_id: number;
    class_group: {
        id: number;
        class_name: string;
    };
};
const SchoolStudentPage = () => {
    const toast = useRef<Toast>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editStudentData, setEditStudentData] = useState<StudentData | null>(null);
    const [tempEditStudentData, setTempEditStudentData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingExport, setLoadingExport] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [listKelas, setListKelas] = useState([]);
    const { school } = useSchool();
    const { user } = useAuth();
    const listKelamin = [
        { label: 'Laki-Laki', value: 'male' },
        { label: 'Perempuan', value: 'female' }];
    const listStatus = [
        { label: "Aktif", value: 1 },
        { label: "Tidak Aktif", value: 0 },
    ];
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<StudentData[] | undefined>(undefined);
    const [newStudentData, setNewStudentData] = useState<StudentData>({
        id: 0,
        student_name: '',
        nis: '',
        nisn: '',
        gender: '',
        is_active: 1,
        class_group_id: 0,
        class_group: {
            id: 0,
            class_name: ''
        }
    });
    const [filters, setFilters] = useState({
        student_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nis: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nisn: { value: null, matchMode: FilterMatchMode.CONTAINS },
        gender: { value: null, matchMode: FilterMatchMode.EQUALS },
        class_group_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedFilter, setDebouncedFilter] = useState("");
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const fileUploadRef = useRef<FileUpload>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);

    const handleFileSelect = (event: any) => {
        setSelectedFile(event.files[0]);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        fileUploadRef.current?.clear();
    };

    const handleImportDialogClose = () => {
        setShowImportDialog(false);
        setSelectedFile(null);
        fileUploadRef.current?.clear();
    };

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            toast.current?.show({
                severity: 'info',
                summary: 'Loading...',
                detail: 'Sedang melakukan export data siswa!',
                life: 3000
            });

            await studentService.exportStudents();

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: 'Export data siswa berhasil!',
                life: 3000
            });
        } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Terjadi kesalahan saat export data siswa.',
                    life: 3000
                });
        } finally {
            setLoadingExport(false);
        }
    };


    const confirmImport = (event: React.MouseEvent) => {
        if (!selectedFile) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Peringatan',
                detail: 'Silakan pilih file terlebih dahulu!',
                life: 3000
            });
            return;
        }

        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin mengupload file ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: handleImport,
            reject: () => {
            }
        });
    };

    const handleImport = async () => {
        try {
            if (!selectedFile || !user?.school_id) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Peringatan',
                    detail: 'Silakan pilih file terlebih dahulu!',
                    life: 3000
                });
                return;
            }

            setImportLoading(true);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('school_id', user.school_id.toString());

            toast.current?.show({
                severity: 'info',
                summary: 'Loading...',
                detail: 'Sedang melakukan import data siswa!',
                life: 3000
            });

            await studentService.storeViaFile(formData);

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: 'Data berhasil di import!',
                life: 3000
            });

            setShowImportDialog(false);
            fileUploadRef.current?.clear();
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Terjadi kesalahan saat mengupload file.',
                life: 3000
            });
        } finally {
            setImportLoading(false);
        }
    };

    const inputFilterTemplate = (field: keyof typeof filters) => (
        <InputText
            value={filters[field]?.value || ""}
            onChange={(e) => setFilters({
                ...filters,
                [field]: { value: e.target.value }
            })}
            placeholder="Filter..."
            className="p-column-filter"
        />
    );

    const dropdownFilterTemplate = (field: keyof typeof filters, options: any) => (
        <Dropdown
            value={filters[field].value}
            options={options}
            onChange={(e) =>
                setFilters({ ...filters, [field]: { value: e.value, matchMode: FilterMatchMode.EQUALS } })
            }
            placeholder="Pilih..."
            showClear
            className="p-column-filter"
        />
    );


    useEffect(() => {
        fetchKelas();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [globalFilter]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters]);


    useEffect(() => {
        fetchStudents(currentPage, rowsPerPage, debouncedFilter, undefined, debouncedFilters);
    }, [currentPage, rowsPerPage, debouncedFilter, debouncedFilters]);


    const fetchStudents = async (
        page = 1,
        perPage = 20,
        search = "",
        classGroupId?: string | number,
        filters?: Record<string, any>
    ) => {
        try {
            setLoading(true);
            if (!school?.id) return;
            setStudentData([]);

            const response = await studentService.getStudent(page, perPage, classGroupId, search, filters);
            setStudentData(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchKelas = async () => {
        try {
            if (!user?.school_id) return;
            setLoadingKelas(true);
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

    const handleAddStudent = async (newStudent: StudentData) => {
        try {
            setSaveLoading(true);
            const payload = {
                student_name: newStudent.student_name,
                nis: newStudent.nis,
                nisn: newStudent.nisn,
                gender: newStudent.gender,
                is_active: newStudent.is_active,
                class_group_id: newStudent.class_group_id,
                school_id: user?.school_id
            };

            if (user?.school_id !== undefined) {
                if (user?.school_id !== null) {
                    await studentService.addStudent(payload);
                    setSaveLoading(false);
                    toast.current?.show({ severity: 'success', summary: 'Siswa berhasil ditambahkan', detail: 'Anda berhasil menambahkan siswa.', life: 3000 });
                } else {
                    throw new Error('School ID is null');
                }
            } else {
                throw new Error('School ID is undefined');
            }
            fetchStudents();
            closeDialog('add');
            setSaveLoading(false);
        } catch (error) {
            setSaveLoading(false);
            toast.current?.show({ severity: 'error', summary: 'Siswa gagal ditambahkan', detail: 'Anda gagal menambahkan siswa.', life: 3000 });
            console.error('Error Add student:', error);
        }
    };

    const handleUpdateStudent = async (updatedStudent: StudentData) => {
        try {
            setSaveLoading(true);
            const payload = {
                student_name: updatedStudent.student_name,
                nis: updatedStudent.nis,
                nisn: updatedStudent.nisn,
                gender: updatedStudent.gender,
                is_active: updatedStudent.is_active,
                class_group_id: updatedStudent.class_group_id,
            };

            if (user?.school_id !== undefined) {
                if (user?.school_id !== null) {
                    await studentService.updateStudent(user.school_id, updatedStudent.id, payload);
                    fetchStudents();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Siswa berhasil diperbarui',
                        detail: 'Data siswa telah diperbarui.',
                        life: 3000,
                    });
                } else {
                    throw new Error('School ID is null');
                }
            } else {
                throw new Error('School ID is undefined');
            }

            closeDialog('update');

        } catch (error) {
            console.error('Error updating student:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal memperbarui siswa',
                detail: 'Terjadi kesalahan saat memperbarui data siswa.',
                life: 3000,
            });
        } finally {
            setSaveLoading(false);
            closeDialog('update');
        }
    };

    const handleDeleteStudent = async (studentId: number) => {
        try {
            if (user?.school_id !== undefined && user?.school_id !== null) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Menghapus siswa',
                    detail: 'Proses menghapus sedang berlangsung...',
                    life: 3000,
                });
                await studentService.deleteStudent(studentId);
                fetchStudents();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Siswa berhasil dihapus',
                    detail: 'Data siswa telah dihapus.',
                    life: 3000,
                });
            } else {
                throw new Error(user?.school_id === null ? 'School ID is null' : 'School ID is undefined');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal menghapus siswa',
                detail: 'Terjadi kesalahan saat menghapus data siswa.',
                life: 3000,
            });
        }
    };

    const confirmAddStudent = (event: React.MouseEvent, newStudent: StudentData) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menambahkan siswa ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleAddStudent(newStudent),
            reject: () => { },
        });
    };

    const confirmUpdateStudent = (event: React.MouseEvent, updatedStudent: StudentData) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin memperbarui data siswa ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleUpdateStudent(updatedStudent),
            reject: () => { },
        });
    };

    const confirmDeleteStudent = (event: React.MouseEvent, studentId: number) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menghapus siswa ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleDeleteStudent(studentId),
            reject: () => {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Dibatalkan',
                    detail: 'Penghapusan siswa dibatalkan.',
                    life: 3000,
                });
            },
        });
    };

    const closeDialog = (type: string) => {
        if (type === "add") {
            setNewStudentData({
                id: 0,
                student_name: '',
                nis: '',
                nisn: '',
                gender: '',
                is_active: 1,
                class_group_id: 0,
                class_group: {
                    id: 0,
                    class_name: ''
                }
            });
            setShowAddDialog(false);
        } else if (type === "update") {
            setEditStudentData({
                id: 0,
                student_name: '',
                nis: '',
                nisn: '',
                gender: '',
                is_active: 1,
                class_group_id: 0,
                class_group: {
                    id: 0,
                    class_name: ''
                }
            });
            setShowEditDialog(false);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Daftar Siswa {school?.name ?? 'Loading...'}</h1>
                {hasAnyPermission(user, ['manage_students']) && (
                    <div className='flex flex-column md:flex-row justify-content-between p-4 card'>
                        <div className='flex flex-column mb-2 md:mb-0 md:flex-row gap-2'>
                            <Button icon="pi pi-plus" severity='success' label='Siswa Baru' onClick={() => {
                                setShowAddDialog(true);
                            }} />
                            <Button
                                icon="pi pi-upload"
                                severity="info"
                                label="Import"
                                onClick={() => setShowImportDialog(true)}
                            />
                            <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedStudents?.length} />
                        </div>
                        <Button icon="pi pi-upload" loading={loadingExport} severity='help' onClick={() => {
                            handleExport();
                        }} label='Export' />
                    </div>
                )}

                <DataTable
                    dataKey="id"
                    selection={selectedStudents!}
                    selectionMode="multiple"
                    value={studentData}
                    onSelectionChange={(e) => setSelectedStudents(e.value)}
                    emptyMessage={
                        loading ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data siswa...</span>
                            </div>
                        ) : Object.values(filters).some((filter) => filter.value !== null && filter.value !== undefined) || globalFilter ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-filter-slash text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Tidak ada siswa yang sesuai dengan pencarian Anda</span>
                            </div>
                        ) : (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Belum ada data siswa</span>
                                <small className="text-gray-400">Silakan tambahkan siswa melalui tombol siswa baru atau import.</small>
                            </div>
                        )
                    }
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
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} siswa"
                    stripedRows
                    filterDisplay="row"
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Data Siswa {school ? school.name : "Loading"}</h5>
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
                    }
                >
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

                    <Column
                        field="student_name"
                        header="Nama"
                        body={(rowData) => (loading ? <Skeleton width="80%" height="1.5rem" /> : rowData.student_name?.toUpperCase())}
                        filter
                        filterElement={inputFilterTemplate("student_name")}
                        showFilterMenu={false}
                    />

                    <Column
                        field="nis"
                        header="NIS"
                        body={(rowData) => (loading ? <Skeleton width="60%" height="1.5rem" /> : rowData.nis)}
                        filter
                        filterElement={inputFilterTemplate("nis")}
                        showFilterMenu={false}
                    />

                    <Column
                        field="nisn"
                        header="NISN"
                        body={(rowData) => (loading ? <Skeleton width="60%" height="1.5rem" /> : rowData.nisn)}
                        filter
                        filterElement={inputFilterTemplate("nisn")}
                        showFilterMenu={false}
                    />

                    <Column
                        field="gender"
                        header="Jenis Kelamin"
                        body={(rowData) =>
                            loading ? <Skeleton width="40%" height="1.5rem" />
                                : rowData.gender === "male" ? "Laki-Laki"
                                    : "Perempuan"
                        }
                        filter
                        filterElement={dropdownFilterTemplate("gender", listKelamin)}
                        showFilterMenu={false}
                    />

                    <Column
                        field="class_group_id"
                        header="Kelas"
                        body={(rowData) => (loading ? <Skeleton width="70%" height="1.5rem" /> : rowData.class_group?.class_name)}
                        filter
                        filterElement={dropdownFilterTemplate("class_group_id", listKelas)}
                        showFilterMenu={false}
                    />

                    <Column
                        field="is_active"
                        header="Status"
                        body={(rowData) =>
                            loading ? (
                                <Skeleton width="40%" height="1.5rem" />
                            ) : rowData.is_active === 1 ? (
                                "Aktif"
                            ) : (
                                "Tidak Aktif"
                            )
                        }
                        filter
                        filterElement={dropdownFilterTemplate("is_active", listStatus)}
                        showFilterMenu={false}
                    />
                    <Column
                        body={(rowData) =>
                            loading ? (
                                <div className="flex gap-2">
                                    <Skeleton width="2rem" height="2rem" shape="circle" />
                                    <Skeleton width="2rem" height="2rem" shape="circle" />
                                </div>
                            ) : hasAnyPermission(user, ["manage_students"]) ? (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-success p-button-rounded"
                                        tooltip="Edit"
                                        tooltipOptions={{ position: "top" }}
                                        onClick={() => {
                                            setTempEditStudentData(rowData);
                                            setEditStudentData(rowData);
                                            setShowEditDialog(true);
                                        }}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-danger p-button-rounded"
                                        tooltip="Hapus"
                                        tooltipOptions={{ position: "top" }}
                                        onClick={(e) => confirmDeleteStudent(e, rowData.id)}
                                    />
                                </div>
                            ) : null
                        }
                    />
                </DataTable>

                <Dialog visible={showAddDialog} style={{ width: '450px' }} onHide={() => closeDialog('add')} header="Penambahan Data Siswa" footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => closeDialog('add')} />
                        <Button label="Save" loading={saveLoading} disabled={!newStudentData.student_name ||
                            !newStudentData.nis ||
                            !newStudentData.nisn ||
                            !newStudentData.class_group_id ||
                            !newStudentData.gender ||
                            newStudentData.is_active === undefined} icon="pi pi-check" className="p-button-text" onClick={(event) => confirmAddStudent(event, newStudentData)} />
                    </div>
                } modal={true} className='p-fluid'>
                    <div className='field'>
                        <label htmlFor="nama">Nama  <span className='text-red-600'>*</span></label>
                        <InputText
                            id="nama"
                            placeholder='Masukkan Nama'
                            value={newStudentData.student_name}
                            onChange={(e) => setNewStudentData({ ...newStudentData, student_name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nis">NIS  <span className='text-red-600'>*</span></label>
                        <InputText
                            id="nis"
                            type='number'
                            placeholder='Masukkan NIS'
                            value={newStudentData.nis}
                            onChange={(e) => setNewStudentData({ ...newStudentData, nis: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nisn">NISN  <span className='text-red-600'>*</span></label>
                        <InputText
                            id="nisn"
                            type='number'
                            placeholder='Masukkan NISN'
                            value={newStudentData.nisn}
                            onChange={(e) => setNewStudentData({ ...newStudentData, nisn: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="kelas">Kelas  <span className='text-red-600'>*</span></label>
                        <Dropdown value={newStudentData.class_group_id} loading={loadingKelas} onChange={(e) => setNewStudentData({ ...newStudentData, class_group_id: e.value })} options={listKelas} optionLabel="label"
                            placeholder="Pilih Kelas" />
                    </div>
                    <div className='field'>
                        <label htmlFor="Jenis Kelamin">Jenis Kelamin  <span className='text-red-600'>*</span></label>
                        <Dropdown value={newStudentData.gender} onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.value })} options={listKelamin} optionLabel="label"
                            placeholder="Pilih Jenis Kelamin" />
                    </div>
                    <div className='field'>
                        <label htmlFor="status">Status Siswa  <span className='text-red-600'>*</span></label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value={1}
                                    onChange={(e) => setNewStudentData({ ...newStudentData, is_active: e.value })}
                                    checked={newStudentData.is_active === 1}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value={0}
                                    onChange={(e) => setNewStudentData({ ...newStudentData, is_active: e.value })}
                                    checked={newStudentData.is_active === 0}
                                />
                                <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={showEditDialog}
                    style={{ width: '450px' }}
                    onHide={() => closeDialog('update')}
                    header="Edit Data Siswa"
                    footer={
                        <div>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => closeDialog('update')}
                            />
                            <Button
                                label="Update"
                                loading={saveLoading}
                                icon="pi pi-check"
                                className="p-button-text"
                                disabled={JSON.stringify(tempEditStudentData) === JSON.stringify(editStudentData)}
                                onClick={(e) => {
                                    if (editStudentData) confirmUpdateStudent(e, editStudentData);
                                }}
                            />

                        </div>
                    }
                    modal
                    className="p-fluid"
                >
                    <div className="field">
                        <label htmlFor="edit-nama">Nama <span className='text-red-600'>*</span></label>
                        <InputText
                            id="edit-nama"
                            value={editStudentData?.student_name}
                            onChange={(e) =>
                                setEditStudentData({ ...editStudentData!, student_name: e.target.value })
                            }
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit-nis">NIS  <span className='text-red-600'>*</span></label>
                        <InputText
                            id="edit-nis"
                            type="number"
                            value={editStudentData?.nis}
                            onChange={(e) =>
                                setEditStudentData({ ...editStudentData!, nis: e.target.value })
                            }
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit-nisn">NISN  <span className='text-red-600'>*</span></label>
                        <InputText
                            id="edit-nisn"
                            type="number"
                            value={editStudentData?.nisn}
                            onChange={(e) =>
                                setEditStudentData({ ...editStudentData!, nisn: e.target.value })
                            }
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit-kelas">Kelas  <span className='text-red-600'>*</span></label>
                        <Dropdown
                            value={editStudentData?.class_group_id}
                            onChange={(e) => {
                                setEditStudentData({ ...editStudentData!, class_group: e.value, class_group_id: e.value });
                            }
                            }
                            options={listKelas}
                            optionLabel="label"
                            placeholder="Pilih Kelas"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="edit-gender">Jenis Kelamin  <span className='text-red-600'>*</span></label>
                        <Dropdown
                            value={editStudentData?.gender}
                            onChange={(e) =>
                                setEditStudentData({ ...editStudentData!, gender: e.value })
                            }
                            options={listKelamin}
                            placeholder="Pilih Jenis Kelamin"
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="status">Status Siswa  <span className='text-red-600'>*</span></label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value={1}
                                    onChange={(e) => setEditStudentData({ ...editStudentData!, is_active: e.value })}
                                    checked={editStudentData?.is_active === 1}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value={0}
                                    onChange={(e) => setEditStudentData({ ...editStudentData!, is_active: e.value })}
                                    checked={editStudentData?.is_active === 0}
                                />
                                <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    visible={showImportDialog}
                    header="Import Data Siswa"
                    onHide={handleImportDialogClose}

                >
                    <div className="p-fluid">
                        <h4>Langkah-Langkah Import Data Siswa:</h4>
                        <ol>
                            <li className='mb-2' >
                                <strong>Download Template:</strong> Klik tombol di bawah untuk mengunduh template.
                                <div className="mt-2">
                                    <a href="https://drive.google.com/uc?export=download&id=1r3UtGaCg5uGXg3eehuVJHmcoj8Qj5BS0" download="Template_Import_Siswa.xlsx">
                                        <Button label="Download Template" icon="pi pi-download" className="p-button-sm w-auto" />
                                    </a>
                                </div>
                            </li>
                            <li className='mb-2'>
                                <strong>Sesuaikan Data dengan Template:</strong> Pastikan data yang diinput sesuai dengan struktur yang ada di template.
                            </li>
                            <li className='mb-2'>
                                <strong>Upload File:</strong> Pilih file yang sudah diisi sesuai template.
                                <div className="mt-2 flex gap-2">
                                    <FileUpload
                                        ref={fileUploadRef}
                                        mode="basic"
                                        accept=".xlsx, .csv"
                                        maxFileSize={2000000}
                                        chooseLabel="Pilih File"
                                        customUpload
                                        onSelect={handleFileSelect}
                                        onClear={handleClearFile}
                                        auto={false}
                                    />
                                    <div>
                                        <Button severity='danger' disabled={fileUploadRef.current === null} onClick={handleClearFile} icon="pi pi-trash">
                                        </Button>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <strong>Import Data:</strong> Tekan tombol "Confirm Import" untuk memulai proses import.
                            </li>
                        </ol>

                        {selectedFile && (
                            <div className="mt-3">
                                <p><strong>File:</strong> {selectedFile.name}</p>
                                <a href={URL.createObjectURL(selectedFile)} download={selectedFile.name} className="w-auto p-button p-button-text">
                                    <i className="pi pi-download pr-2" />  Download Preview
                                </a>
                            </div>
                        )}

                        <div className="flex justify-content-end gap-2 mt-4">
                            <Button label="Batal" severity="secondary" icon="pi pi-times" onClick={handleImportDialogClose} disabled={importLoading} />
                            <Button label="Confirm Import" severity="success" disabled={fileUploadRef.current === null} icon="pi pi-check" onClick={confirmImport} loading={importLoading} />
                        </div>
                    </div>
                </Dialog>

            </div >
        </>
    );
};

export default SchoolStudentPage;
