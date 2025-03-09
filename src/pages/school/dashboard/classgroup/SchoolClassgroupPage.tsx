/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import classGroupService from '../../../../services/classGroupService';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { useSchool } from '../../../../context/SchoolContext';
import { FilterMatchMode } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';
import studentService from '../../../../services/studentService';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';

type ClassgroupData = {
    id?: number;
    class_name: string;
    students_count?: number;
};

const SchoolClassgroupPage = () => {
    const toast = useRef<Toast>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [classgroupData, setClassgroupData] = useState<ClassgroupData>({
        class_name: ''
    });
    const [tempClassgroupData, setTempClassgroupData] = useState<ClassgroupData>({
        class_name: ''
    });
    const [classgroupList, setClassgroupList] = useState<any[]>([]);
    const [selectedClassgroups, setSelectedClassgroups] = useState<any[]>([]);
    const [activatedClassGroup, setActivatedClassGroup] = useState<ClassgroupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);
    const { school } = useSchool();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const [studentCurrentPage, setStudentCurrentPage] = useState(1);
    const [studentRowsPerPage, setStudentRowsPerPage] = useState(20);
    const [studentTotalRecords, setStudentTotalRecords] = useState(0);

    const [showStudentDialog, setShowStudentDialog] = useState(false);
    const [students, setStudents] = useState([]);

    const [filters, setFilters] = useState({
        class_name: { value: '' },
    });

    const [filtersStudent, setFiltersStudent] = useState({
        student_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nis: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nisn: { value: null, matchMode: FilterMatchMode.CONTAINS },
        gender: { value: null, matchMode: FilterMatchMode.EQUALS },
        class_group_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const listKelamin = [
        { label: 'Laki-Laki', value: 'male' },
        { label: 'Perempuan', value: 'female' }];

    const inputFilterTemplateStudent = (field: keyof typeof filtersStudent) => (
        <InputText
            value={filtersStudent[field]?.value || ""}
            onChange={(e) => setFiltersStudent({
                ...filtersStudent,
                [field]: { value: e.target.value }
            })}
            placeholder="Filter..."
            className="p-column-filter"
        />
    );

    const dropdownFilterTemplateStudent = (field: keyof typeof filtersStudent, options: any) => (
        <Dropdown
            value={filtersStudent[field].value}
            options={options}
            onChange={(e) =>
                setFiltersStudent({ ...filtersStudent, [field]: { value: e.value, matchMode: FilterMatchMode.EQUALS } })
            }
            placeholder="Pilih..."
            showClear
            className="p-column-filter"
        />
    );

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters]);

    useEffect(() => {
        fetchClassgroups(currentPage, rowsPerPage, debouncedFilters);
    }, [currentPage, rowsPerPage, debouncedFilters]);

    const fetchClassgroups = async (page = 1, perPage = 20, filters?: Record<string, any>) => {
        try {
            setLoading(true);
            setClassgroupList([]);
            const { responseData } = await classGroupService.getClassGroups(page, perPage, filters);
            setClassgroupList(responseData.data.data);
            setTotalRecords(responseData.data.total);
        } catch (error: any) {
            console.error('Failed to fetch classgroups:', error);
        } finally {
            setLoading(false);
        }
    };

    const openStudentDialog = (classGroup: any) => {
        setShowStudentDialog(true);
        setStudentCurrentPage(1);
        setStudentRowsPerPage(10);
        setActivatedClassGroup(classGroup);
        fetchStudents(1, studentRowsPerPage, classGroup.id);
    };

    const fetchStudents = async (page = 1, perPage = 20, classGroupId: number) => {
        try {
            setStudentLoading(true);
            setStudents([]);
            const response = await studentService.getStudent(page, perPage, classGroupId);
            setStudents(response.data.data);
            setStudentTotalRecords(response.data.total);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setStudentLoading(false);
        }
    };

    const inputFilterTemplate = (field: keyof typeof filters) => (
        <InputText
            value={filters[field].value || ""}
            onChange={(e) =>
                setFilters({ ...filters, [field]: { value: e.target.value } })
            }
            placeholder="Filter..."
            className="p-column-filter"
        />
    );


    const handleCreateClassgroup = async () => {
        try {
            if (!school) return;
            setSaveLoading(true);
            const payload = {
                school_id: school.id,
                class_name: classgroupData.class_name,
            }
            await classGroupService.createClassGroup(payload);

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: `Berhasil membuat kelas baru ${payload.class_name}!`,
                life: 3000
            });

            closeDialog('create')
            fetchClassgroups();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal menambahkan kelas',
                detail: `Nama kelas tidak boleh sama dengan yang sudah terdaftar!`,
                life: 3000
            });
            console.error('Failed to create classgroups:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEditClassgroup = async () => {
        try {
            if (!school) return;
            setSaveLoading(true);
            const payload = {
                school_id: school.id,
                class_name: classgroupData.class_name
            }
            if (classgroupData.id !== undefined) {
                await classGroupService.updateClassGroup(classgroupData.id, payload);
            } else {
                throw new Error('Classgroup ID is undefined');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: `Berhasil memperbarui kelas ${tempClassgroupData.class_name} menjadi ${payload.class_name}!`,
                life: 3000
            });

            closeDialog('edit')
            fetchClassgroups();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Gagal memperbarui kelas!`,
                life: 3000
            });
            console.error('Failed to edit classgroups:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteClassgroup = async (classgroup: any) => {
        try {
            setDeleteLoading(true);
            toast.current?.show({
                severity: 'info',
                summary: 'Menghapus...',
                detail: `Menghapus kelas ${classgroup.class_name}`,
                life: 2000
            });

            await classGroupService.deleteClassGroup(classgroup.id);

            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: `Kelas ${classgroup.class_name} telah dihapus!`,
                life: 3000
            });

            fetchClassgroups();
        } catch (error) {
            console.error('Gagal menghapus kelas:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Gagal menghapus kelas',
                life: 3000
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteMultipleClassgroups = async () => {
        if (!selectedClassgroups.length) return;

        try {
            setDeleteLoading(true);
            toast.current?.show({
                severity: 'info',
                summary: 'Menghapus...',
                detail: `Menghapus ${selectedClassgroups.length} kelas`,
                life: 2000
            });

            await Promise.all(selectedClassgroups.map(classgroup =>
                classGroupService.deleteClassGroup(classgroup.id)
            ));

            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: `${selectedClassgroups.length} kelas telah dihapus!`,
                life: 3000
            });

            setSelectedClassgroups([]);
            fetchClassgroups();
        } catch (error) {
            console.error('Gagal menghapus kelas:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Gagal menghapus beberapa kelas',
                life: 3000
            });
        } finally {
            setDeleteLoading(false);
        }
    };



    const confirmCreateClassgroup = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menambahkan kelas ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleCreateClassgroup(),
            reject: () => { },
        });
    };

    const confirmEditClassgroup = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin memperbarui kelas ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleEditClassgroup(),
        });
    };

    const confirmDeleteClassgroup = (event: React.MouseEvent, classgroup?: any) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: classgroup
                ? `Apakah Anda yakin ingin menghapus kelas "${classgroup.class_name}"?`
                : `Apakah Anda yakin ingin menghapus ${selectedClassgroups.length} kelas?`,
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => classgroup ? handleDeleteClassgroup(classgroup) : handleDeleteMultipleClassgroups(),
        });
    };


    const closeDialog = (type: string) => {
        if (type === 'edit') {
            setClassgroupData({
                class_name: ''
            });
            setTempClassgroupData({
                class_name: ''
            });
            setShowEditDialog(false);
        } else {
            setClassgroupData({
                class_name: ''
            });
            setShowCreateDialog(false);
        }

    }

    const renderStudentCount = (rowData: ClassgroupData) => (
        <span
            className=""
        >
            {rowData.students_count}
        </span>
    );



    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Daftar Kelas {school ? school.name : "Loading"}</h1>
                <div className="flex justify-content-between p-4 card">
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" severity="success" label="Kelas Baru" onClick={() => setShowCreateDialog(true)} />
                        <Button icon="pi pi-trash" loading={deleteLoading} severity="danger" label="Hapus" disabled={!selectedClassgroups?.length} onClick={(e) => {
                            confirmDeleteClassgroup(e)
                        }} />
                    </div>
                    {/* <Button icon="pi pi-upload" severity="help" label="Export" /> */}
                </div>

                <DataTable
                    dataKey="id"
                    selection={selectedClassgroups!}
                    selectionMode="multiple"
                    onSelectionChange={(e) => setSelectedClassgroups(e.value)}
                    value={classgroupList}
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Daftar Kelas</h5>
                        </div>
                    }
                    emptyMessage={
                        loading ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data kelas...</span>
                            </div>
                        ) : Object.values(filters).some((filter) => filter.value !== null && filter.value !== undefined) ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-filter-slash text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Tidak ada kelas yang sesuai dengan pencarian Anda</span>
                            </div>
                        ) : (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Belum ada data kelas</span>
                                <small className="text-gray-400">Silakan tambahkan kelas melalui tombol kelas baru atau import.</small>
                            </div>
                        )
                    }
                    lazy
                    paginator
                    first={(currentPage - 1) * rowsPerPage}
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    onPage={(event) => {
                        setCurrentPage((event.page ?? 0) + 1);
                        setRowsPerPage(event.rows);
                    }}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} kelas"
                    stripedRows
                    filterDisplay="row"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="class_name" header="Nama" sortable filter
                        filterElement={inputFilterTemplate("class_name")}
                        showFilterMenu={false} />
                    <Column
                        field="students_count"
                        header="Jumlah Murid"
                        sortable
                        body={renderStudentCount}
                    />
                    <Column
                        body={(rowData) => (
                            <div className='flex gap-2'>
                                <Button
                                    icon="pi pi-eye"
                                    className="p-button-info p-button-rounded"
                                    tooltip="Lihat daftar siswa"
                                    tooltipOptions={{ position: 'top' }}
                                    disabled={deleteLoading}
                                    onClick={() => openStudentDialog(rowData)}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-success p-button-rounded"
                                    tooltip="Perbarui"
                                    disabled={deleteLoading}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => { setShowEditDialog(true); setTempClassgroupData(rowData); setClassgroupData(rowData); }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-rounded"
                                    tooltip="Hapus"
                                    tooltipOptions={{ position: 'top' }}
                                    loading={deleteLoading}
                                    onClick={(e) => confirmDeleteClassgroup(e, rowData)}
                                />
                            </div>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={showCreateDialog}
                    style={{ width: '450px' }}
                    onHide={() => {
                        closeDialog('create')
                    }}
                    header="Tambah Kelas Baru"
                    footer={
                        <div>
                            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => {
                                closeDialog('create')
                            }} />
                            <Button label="Simpan" icon="pi pi-check" className="p-button-text" loading={saveLoading} disabled={classgroupData.class_name === ''} onClick={(e) => { confirmCreateClassgroup(e) }} />
                        </div>
                    }
                    modal={true}
                    className="p-fluid"
                >
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="className"
                            placeholder='masukkan nama kelas'
                            value={classgroupData.class_name}
                            onChange={(e) => setClassgroupData({ ...classgroupData, class_name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                </Dialog>

                <Dialog
                    visible={showEditDialog}
                    style={{ width: '450px' }}
                    onHide={() => {
                        closeDialog('edit')
                    }}
                    header="Tambah Kelas Baru"
                    footer={
                        <div>
                            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => closeDialog('edit')} />
                            <Button label="Simpan" icon="pi pi-check" loading={saveLoading} disabled={tempClassgroupData.class_name === classgroupData.class_name} className="p-button-text" onClick={(e) => confirmEditClassgroup(e)} />
                        </div>
                    }
                    modal={true}
                    className="p-fluid"
                >
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="className"
                            value={classgroupData.class_name}
                            onChange={(e) => setClassgroupData({ ...classgroupData, class_name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                </Dialog>
                <Dialog
                    visible={showStudentDialog}
                    style={{ minWidth: "50vw", maxWidth: "90vw" }}
                    onHide={() => {
                        setShowStudentDialog(false);
                        setStudentCurrentPage(1);
                        setStudentRowsPerPage(10);
                        setStudents([]);
                    }}
                    header={`Daftar Siswa Kelas ${activatedClassGroup?.class_name || ''}`}
                >
                    {loading ? (
                        <div className="flex justify-content-center align-items-center">
                            <ProgressSpinner />
                        </div>
                    ) : (
                        <DataTable paginator
                            lazy
                            filterDisplay='row'
                            first={(studentCurrentPage - 1) * studentRowsPerPage}
                            rows={studentRowsPerPage}
                            totalRecords={studentTotalRecords}
                            onPage={(event) => {
                                setStudentCurrentPage((event.page ?? 0) + 1);
                                setStudentRowsPerPage(event.rows);
                                if (activatedClassGroup && activatedClassGroup.id !== undefined) {
                                    fetchStudents(event.page, event.rows, activatedClassGroup.id);
                                }
                            }}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} siswa"
                            stripedRows value={students} emptyMessage={
                                studentLoading ? (
                                    <div className="flex flex-column align-items-center gap-3 py-4">
                                        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                        <span className="text-gray-500 font-semibold">Memuat data siswa...</span>
                                    </div>
                                ) : Object.values(filters).some((filter) => filter.value !== null && filter.value !== undefined) ? (
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
                            }>
                            <Column
                                field="nis"
                                header="NIS"
                                body={(rowData) => (loading ? <Skeleton width="60%" height="1.5rem" /> : rowData.nis)}
                                filter
                                filterElement={inputFilterTemplateStudent("nis")}
                                showFilterMenu={false}
                            />
                            <Column
                                field="student_name"
                                header="Nama"
                                body={(rowData) => (loading ? <Skeleton width="80%" height="1.5rem" /> : rowData.student_name?.toUpperCase())}
                                filter
                                filterElement={inputFilterTemplateStudent("student_name")}
                                showFilterMenu={false} />
                            <Column
                                field="gender"
                                header="Jenis Kelamin"
                                body={(rowData) =>
                                    studentLoading ? <Skeleton width="40%" height="1.5rem" />
                                        : rowData.gender === "male" ? "Laki-Laki"
                                            : "Perempuan"
                                }
                                filter
                                filterElement={dropdownFilterTemplateStudent("gender", listKelamin)}
                                showFilterMenu={false}
                            />
                            <Column field="class_group.class_name" header="Kelas" body={(rowData) => (loading ? <Skeleton width="70%" height="1.5rem" /> : rowData.class_group?.class_name)}
                            />
                        </DataTable>
                    )}
                </Dialog>
            </div>
        </>
    );
};

export default SchoolClassgroupPage;
