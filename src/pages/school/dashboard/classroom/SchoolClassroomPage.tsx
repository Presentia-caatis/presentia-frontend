/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Tooltip } from 'primereact/tooltip';

type ClassroomData = {
    id: number;
    name: string;
    status: string;
    studentCount: number;
    maleCount: number;
    femaleCount: number;
};

const SchoolClassroomPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [classroomData, setClassroomData] = useState<ClassroomData>({
        id: 0,
        name: '',
        status: '',
        studentCount: 0,
        maleCount: 0,
        femaleCount: 0,
    });
    const [selectedClassrooms, setSelectedClassrooms] = useState<ClassroomData[] | undefined>(undefined);
    const [classroomList, setClassroomList] = useState<ClassroomData[]>([
        { id: 1, name: 'Kelas A', status: 'Active', studentCount: 30, maleCount: 15, femaleCount: 15 },
        { id: 2, name: 'Kelas B', status: 'Inactive', studentCount: 20, maleCount: 10, femaleCount: 10 }
    ]);

    const renderStudentCount = (rowData: ClassroomData) => (
        <span
            className="student-count-tooltip"
            data-pr-tooltip={`Laki-Laki: ${rowData.maleCount}, Perempuan: ${rowData.femaleCount}`}
            data-pr-position="top"
        >
            {rowData.studentCount}
        </span>
    );

    return (
        <>
            <div className="card">
                <div className="flex justify-content-between p-4 card">
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" severity="success" label="Kelas Baru" onClick={() => setShowAddDialog(true)} />
                        <Button icon="pi pi-trash" severity="danger" label="Hapus" disabled={!selectedClassrooms?.length} />
                    </div>
                    <Button icon="pi pi-upload" severity="help" label="Export" />
                </div>

                <Tooltip className='p-1' target=".student-count-tooltip" />

                <DataTable
                    dataKey="id"
                    selection={selectedClassrooms!}
                    selectionMode="multiple"
                    onSelectionChange={(e) => setSelectedClassrooms(e.value)}
                    value={classroomList}
                    paginator
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Daftar Kelas</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className="py-2 pl-5" placeholder="Search..." />
                            </span>
                        </div>
                    }
                    rows={20}
                    rowsPerPageOptions={[20, 50, 75, 100]}
                    emptyMessage="No classes available"
                    tableStyle={{ minWidth: '30rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} classes"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="name" header="Name" sortable />
                    <Column field="status" header="Status" sortable />
                    <Column
                        field="studentCount"
                        header="Jumlah Murid"
                        sortable
                        body={renderStudentCount}
                    />
                    <Column
                        body={() => (
                            <div className='flex gap-2'>
                                <Button
                                    icon="pi pi-eye"
                                    className="p-button-info p-button-rounded"
                                    tooltip="Lihat daftar siswa"
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => alert('Open student list for this class')}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-success p-button-rounded"
                                    tooltip="Perbarui"
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
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={showAddDialog}
                    style={{ width: '450px' }}
                    onHide={() => setShowAddDialog(false)}
                    header="Tambah Kelas Baru"
                    footer={
                        <div>
                            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                            <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={() => { }} />
                        </div>
                    }
                    modal={true}
                    className="p-fluid"
                >
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="className"
                            value={classroomData.name}
                            onChange={(e) => setClassroomData({ ...classroomData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value="Active"
                                    onChange={(e) => setClassroomData({ ...classroomData, status: e.value })}
                                    checked={classroomData.status === 'Active'}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value="Inactive"
                                    onChange={(e) => setClassroomData({ ...classroomData, status: e.value })}
                                    checked={classroomData.status === 'Inactive'}
                                />
                                <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default SchoolClassroomPage;