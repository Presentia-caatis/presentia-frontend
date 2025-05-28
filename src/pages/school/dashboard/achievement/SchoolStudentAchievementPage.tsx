/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

type AchievementData = {
    id: number;
    name: string;
    description: string;
    code: string;
    score: number;
};

type StudentAchievementData = {
    achievement: AchievementData | null;
    student: StudentData[];
    description: string;
};

type StudentData = {
    name: string;
    nis: string;
    nisn: string;
    kelas: string;
    kelamin: string;
    status: string;
    achievement: AchievementData[];
};

const SchoolStudentAchievementPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showStudentAchievementDialog, setShowStudentAchievementDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [studentAchievementData, setStudentAchievementData] = useState<StudentAchievementData>({
        achievement: null,
        student: [],
        description: ''
    });
    const [selectedAchievement, setSelectedAchievement] = useState<AchievementData[] | undefined>(undefined);

    const [studentList, setStudentList] = useState<StudentData[]>([
        {
            name: 'John John John',
            nis: '12345',
            nisn: '67890',
            kelas: 'Kelas A',
            kelamin: 'Laki-Laki',
            status: 'Active',
            achievement: [
                { id: 1, name: 'Pencapaian A', description: "Menang", code: 'A28', score: 90 },
                { id: 2, name: 'Pencapaian B', description: "Menang", code: 'A29', score: 80 }
            ]
        },
        {
            name: 'Mon',
            nis: '12345',
            nisn: '67890',
            kelas: 'Kelas A',
            kelamin: 'Laki-Laki',
            status: 'Active',
            achievement: [
                { id: 3, name: 'Pencapaian C', description: "Lulus", code: 'A30', score: 85 }
            ]
        },
        {
            name: 'Staal',
            nis: '12345',
            nisn: '67890',
            kelas: 'Kelas A',
            kelamin: 'Laki-Laki',
            status: 'Active',
            achievement: []
        }
    ]);

    const [achievementList, setAchievementList] = useState<AchievementData[]>([
        { id: 1, name: 'Pencapaian A', description: "Menang", code: 'A28', score: 90 },
        { id: 2, name: 'Pencapaian B', description: "Menang", code: 'A29', score: 80 }
    ]);

    const selectedItemTemplate = (option: StudentData | undefined) => {
        if (!option) return null;
        return (
            <div className="inline-flex align-items-center py-1 px-2 bg-primary text-white border-round mr-2">
                <div>{option.name}</div>
            </div>
        );
    };

    const itemTemplate = (option: StudentData) => {
        return (
            <div>{`${option.name} - ${option.nisn} - ${option.kelas}`}</div>
        );
    };

    const calculateTotalScore = () => {
        return studentAchievementData.student[0]?.achievement.reduce((total, achievement) => total + (achievement.score || 0), 0) || 0;
    };

    return (
        <>
            <div className="card">
                <div className='flex justify-content-between p-4 card'>
                    <div className='flex gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Pencapaian Siswa' onClick={() => {
                            setShowAddDialog(true);
                        }} />
                    </div>
                    <Button icon="pi pi-upload" severity='help' label='Export' />
                </div>

                <DataTable dataKey="id"
                    value={studentList}
                    paginator header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Data Siswa SMK Telkom Bandung</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left ">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className='py-2 pl-5' placeholder="Search..." />
                            </span>
                        </div>
                    } rows={20} rowsPerPageOptions={[20, 50, 75, 100]} emptyMessage="Belum ada siswa" tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} siswa">
                    <Column sortable field="name" header="Nama"></Column>
                    <Column sortable field="nis" header="NIS"></Column>
                    <Column sortable field="nisn" header="NISN"></Column>
                    <Column sortable field="kelamin" header="Kelamin"></Column>
                    <Column sortable field="kelas" header="Kelas"></Column>
                    <Column
                        body={(rowData: StudentData) => (
                            <Button
                                icon="pi pi-search"
                                className="p-button-primary p-button-rounded"
                                tooltip="Lihat Pencapaian"
                                tooltipOptions={{ position: 'top' }}
                                onClick={() => {
                                    setStudentAchievementData({
                                        ...studentAchievementData,
                                        student: [rowData],
                                        achievement: rowData.achievement[0] || null
                                    });
                                    setShowStudentAchievementDialog(true);
                                }}
                            />
                        )}
                    />

                </DataTable>

                <Dialog visible={showAddDialog} style={{ width: '450px' }} onHide={() => {
                    setShowAddDialog(false); setStudentAchievementData({
                        achievement: null,
                        student: [],
                        description: ''
                    });
                }} header="Penambahan Data Pencapaian Siswa" footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => {
                            setShowAddDialog(false); setStudentAchievementData({
                                achievement: null,
                                student: [],
                                description: ''
                            });
                        }} />
                        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => { }} />
                    </div>
                } modal={true} className='p-fluid'>
                    <div className='field'>
                        <label htmlFor="achievement">Pencapaian</label>
                        <Dropdown
                            value={studentAchievementData.achievement}
                            onChange={(e) => setStudentAchievementData({ ...studentAchievementData, achievement: e.value })}
                            options={achievementList}
                            optionLabel="name"
                            placeholder="Pilih Pencapaian"
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="student">Siswa</label>
                        <MultiSelect
                            value={studentAchievementData.student}
                            onChange={(e) => setStudentAchievementData({ ...studentAchievementData, student: e.value })}
                            options={studentList}
                            optionLabel="name"
                            placeholder="Pilih Siswa"
                            filter
                            filterPlaceholder="Cari Siswa"
                            itemTemplate={itemTemplate}
                            selectedItemTemplate={selectedItemTemplate}
                            display="chip"
                        />
                    </div>
                    <div className='field '>
                        <label htmlFor="description">Deskripsi</label>
                        <InputTextarea
                            id="description"
                            value={studentAchievementData.description}
                            onChange={(e) => setStudentAchievementData({ ...studentAchievementData, description: e.target.value })}
                            required
                            autoFocus
                            autoResize
                        />
                    </div>
                </Dialog>

                <Dialog
                    visible={showStudentAchievementDialog}
                    style={{ width: '950px' }}
                    onHide={() => {
                        setShowStudentAchievementDialog(false); setStudentAchievementData({
                            achievement: null,
                            student: [],
                            description: ''
                        });
                    }}
                    header="Data Pencapaian"
                    modal
                    className="p-fluid"
                    footer={
                        <div>
                            <Button label="Close" icon="pi pi-times" className="p-button-text" onClick={() => {
                                setShowStudentAchievementDialog(false); setStudentAchievementData({
                                    achievement: null,
                                    student: [],
                                    description: ''
                                });
                            }} />
                        </div>
                    }
                >
                    <DataTable
                        dataKey="id"
                        value={studentAchievementData.student[0]?.achievement || []}
                        emptyMessage="Belum ada pencapaian"
                        tableStyle={{ minWidth: '50rem' }}

                        header={
                            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 className="m-0">Data Pencapaian SMAN 24</h5>
                                <span className="block mt-2 md:mt-0 p-input-icon-left">
                                    <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                    <InputText className='py-2 pl-5' placeholder="Search..." />
                                </span>
                            </div>
                        }
                        paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 75, 100]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} pencapaian"
                        footerColumnGroup={
                            <ColumnGroup>
                                <Row>
                                    <Column footer={`Total Score: ${calculateTotalScore()}`} />
                                    <Column colSpan={6} />
                                </Row>
                            </ColumnGroup>
                        }
                    >
                        <Column field="name" header="Name" sortable />
                        <Column field="code" header="Kode Pencapaian" sortable />
                        <Column field="description" header="Deskripsi" sortable />
                        <Column field="score" header="Score" sortable />
                        <Column field="timestamp" header="Timestamp" sortable />
                        <Column
                            header="Action"
                            body={(rowData: AchievementData) => (
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-warning mt-2"
                                    onClick={() => { }}
                                />
                            )}
                        />
                    </DataTable>
                </Dialog>

            </div>
        </>
    );
};

export default SchoolStudentAchievementPage;
