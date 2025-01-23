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
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [listKelas, setListKelas] = useState([]);
    const [listKelamin, setListKelamin] = useState([{ label: 'Laki-Laki', value: 'male' }, { label: 'Perempuan', value: 'female' }]);
    const [studentData, setStudentData] = useState<StudentData[]>([]);
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


    const { schoolData } = useSchool();
    const { user } = useAuth();
    useEffect(() => {
        fetchStudents();
        fetchKelas();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            if (!user?.school_id) return;
            const response = await studentService.getStudent(user.school_id);
            setStudentData(response.data);

        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchKelas = async () => {
        try {
            if (!user?.school_id) return;
            const response = await classGroupService.getClassGroups(user.school_id);
            setListKelas(response.responseData.data);

        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleAddStudent = async (selectedStudent: StudentData) => {
        try {
            setSaveLoading(true);
            const payload = {
                student_name: selectedStudent.student_name,
                nis: selectedStudent.nis,
                nisn: selectedStudent.nisn,
                gender: selectedStudent.gender,
                is_active: selectedStudent.is_active,
                class_group_id: (selectedStudent.class_group_id as any).id,
                school_id: user?.school_id
            };

            console.log(payload);
            if (user?.school_id !== undefined) {
                if (user?.school_id !== null) {
                    const response = await studentService.addStudent(user.school_id, payload);
                    setSaveLoading(false);
                } else {
                    throw new Error('School ID is null');
                }
            } else {
                throw new Error('School ID is undefined');
            }
            fetchStudents();
            toast.current?.show({ severity: 'success', summary: 'Siswa berhasil ditambahkan', detail: 'Anda berhasil menambahkan siswa.', life: 3000 });
            setShowAddDialog(false);
            setSaveLoading(false);
        } catch (error) {
            setSaveLoading(false);
            console.error('Error Add student:', error);
        }
    };

    const handleUpdateStudent = async (selectedStudent: StudentData) => {
        try {
            const payload = {
                student_name: selectedStudent.student_name,
                nis: selectedStudent.nis,
                nisn: selectedStudent.nisn,
                gender: selectedStudent.gender,
                is_active: selectedStudent.is_active,
                class_group_id: selectedStudent.class_group_id
            };

            // const response = await studentService.updateStudent(selectedStudent.id, payload);
            fetchStudents();
            setShowAddDialog(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const [selectedStudents, setSelectedStudents] = useState<StudentData[] | undefined>(undefined);

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <div className='flex justify-content-between p-4 card'>
                    <div className='flex gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Siswa Baru' onClick={() => {
                            setShowAddDialog(true);
                        }} />
                        <Button icon="pi pi-plus" severity='success' label='Import Excel' />
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedStudents?.length} />
                    </div>
                    <Button icon="pi pi-upload" severity='help' label='Export' />
                </div>

                <DataTable dataKey="id"
                    selection={selectedStudents!}
                    selectionMode="multiple"
                    onSelectionChange={(e) => setSelectedStudents(e.value)} paginator header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Data Siswa {schoolData ? schoolData.name : "Loading"}</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left ">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className='py-2 pl-5' placeholder="Search..." />
                            </span>
                        </div>
                    } rows={10} rowsPerPageOptions={[10, 50, 75, 100]} emptyMessage={
                        loading ? (
                            <div className="flex flex-column align-items-sm-start">
                                <div className="py-1 text-start text-sm text-secondary">Loading...</div>
                            </div>
                        ) : "Belum ada siswa"
                    } tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students" stripedRows
                    value={studentData} >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column
                        field="student_name"
                        header="Nama"
                        body={(rowData) =>
                            loading ? <Skeleton width="80%" height="1.5rem" /> : rowData.student_name
                        }
                    ></Column>
                    <Column
                        field="nis"
                        header="NIS"
                        body={(rowData) =>
                            loading ? <Skeleton width="60%" height="1.5rem" /> : rowData.nis
                        }
                    ></Column>
                    <Column
                        field="nisn"
                        header="NISN"
                        body={(rowData) =>
                            loading ? <Skeleton width="60%" height="1.5rem" /> : rowData.nisn
                        }
                    ></Column>
                    <Column
                        field="gender"
                        header="Gender"
                        body={(rowData) =>
                            loading ? <Skeleton width="40%" height="1.5rem" /> : rowData.gender
                        }
                    ></Column>
                    <Column
                        field="class_group.class_name"
                        header="Kelas"
                        body={(rowData) =>
                            loading ? <Skeleton width="70%" height="1.5rem" /> : rowData.class_group?.class_name
                        }
                    ></Column>
                    <Column
                        field="is_active"
                        header="Status"
                        body={(rowData) =>
                            loading ? (
                                <Skeleton width="40%" height="1.5rem" />
                            ) : rowData.is_active === 1 ? (
                                'Aktif'
                            ) : (
                                'Tidak Aktif'
                            )
                        }
                    ></Column>
                    <Column
                        body={(rowData) =>
                            loading ? (
                                <div className="flex gap-2">
                                    <Skeleton width="2rem" height="2rem" shape="circle" />
                                    <Skeleton width="2rem" height="2rem" shape="circle" />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-success p-button-rounded"
                                        tooltip="Edit"
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={() => alert('Open student list for this class')}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-danger p-button-rounded"
                                        tooltip="Hapus"
                                        tooltipOptions={{ position: 'top' }}
                                        onClick={() => alert('Open student list for this class')}
                                    />
                                </div>
                            )
                        }
                    ></Column>
                </DataTable>

                <Dialog visible={showAddDialog} style={{ width: '450px' }} onHide={() => { setShowAddDialog(false) }} header="Penambahan Data Siswa" footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="Save" loading={saveLoading} icon="pi pi-check" className="p-button-text" onClick={() => { handleAddStudent(newStudentData) }} />
                    </div>
                } modal={true} className='p-fluid'>
                    <div className='field'>
                        <label htmlFor="nama">Nama</label>
                        <InputText
                            id="nama"
                            value={newStudentData.student_name}
                            onChange={(e) => setNewStudentData({ ...newStudentData, student_name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nis">NIS</label>
                        <InputText
                            id="nis"
                            type='number'
                            value={newStudentData.nis}
                            onChange={(e) => setNewStudentData({ ...newStudentData, nis: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nisn">NISN</label>
                        <InputText
                            id="nisn"
                            type='number'
                            value={newStudentData.nisn}
                            onChange={(e) => setNewStudentData({ ...newStudentData, nisn: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="kelas">Kelas</label>
                        <Dropdown value={newStudentData.class_group_id} onChange={(e) => setNewStudentData({ ...newStudentData, class_group_id: e.value })} options={listKelas} optionLabel="class_name"
                            placeholder="Pilih Kelas" />
                    </div>
                    <div className='field'>
                        <label htmlFor="kelamin">Kelamin</label>
                        <Dropdown value={newStudentData.gender} onChange={(e) => setNewStudentData({ ...newStudentData, gender: e.value })} options={listKelamin} optionLabel="label"
                            placeholder="Pilih Kelamin" />
                    </div>
                    <div className='field'>
                        <label htmlFor="status">Status Siswa</label>
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
            </div >
        </>
    );
};

export default SchoolStudentPage;
