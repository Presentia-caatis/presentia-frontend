/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Tooltip } from 'primereact/tooltip';
import { InputNumber } from 'primereact/inputnumber';

type AchievementData = {
    id: number;
    name: string;
    description: string;
    code: string;
    grade: number | null;
    status: string;
};

const SchoolViolationPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [achievementData, setAchievementData] = useState<AchievementData>({
        id: 0,
        name: '',
        description: '',
        code: '',
        grade: 0,
        status: 'Active',
    });
    const [selectedAchievement, setSelectedAchievement] = useState<AchievementData[] | undefined>(undefined);
    const [achievementList, setAchievementList] = useState<AchievementData[]>([
        { id: 1, name: 'Pelanggaran A', description: "menang", code: 'A28', grade: 90, status: 'Active' },
        { id: 2, name: 'Pelanggaran B', description: "menang", code: 'A28', grade: 90, status: 'Active' }
    ]);

    return (
        <>
            <div className="card">
                <div className="flex justify-content-between p-4 card">
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" severity="success" label="Pelanggaran" onClick={() => setShowAddDialog(true)} />
                        <Button icon="pi pi-trash" severity="danger" label="Hapus" disabled={!selectedAchievement?.length} />
                    </div>
                    <Button icon="pi pi-upload" severity="help" label="Export" />
                </div>

                <Tooltip className='p-1' target=".student-count-tooltip" />

                <DataTable
                    dataKey="id"
                    selection={selectedAchievement!}
                    selectionMode="multiple"
                    onSelectionChange={(e) => setSelectedAchievement(e.value)}
                    value={achievementList}
                    paginator
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Daftar Pelanggaran</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className="py-2 pl-5" placeholder="Search..." />
                            </span>
                        </div>
                    }
                    rows={20}
                    rowsPerPageOptions={[20, 50, 75, 100]}
                    emptyMessage="No achivement available"
                    tableStyle={{ minWidth: '30rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} classes"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column field="name" header="Name" sortable />
                    <Column field="description" header="Deskripsi" sortable />
                    <Column field="code" header="Kode Pelanggaran" sortable />
                    <Column field="grade" header="Nilai" sortable />
                    <Column field="status" header="Status" sortable />
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
                    onHide={() => {
                        setShowAddDialog(false); setAchievementData({
                            id: 0,
                            name: '',
                            description: '',
                            code: '',
                            grade: 0,
                            status: 'Active',
                        });
                    }}
                    header="Tambah Pelanggaran Baru"
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
                            id="name"
                            value={achievementData.name}
                            onChange={(e) => setAchievementData({ ...achievementData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <InputText
                            id="description"
                            value={achievementData.description}
                            onChange={(e) => setAchievementData({ ...achievementData, description: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="code">Kode Pelanggaran</label>
                        <InputText
                            id="code"
                            value={achievementData.code}
                            onChange={(e) => setAchievementData({ ...achievementData, code: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="grade">Nilai</label>
                        <InputNumber
                            id="grade"
                            value={achievementData.grade}
                            onChange={(e) => setAchievementData({ ...achievementData, grade: e.value })}
                            required
                            autoFocus
                            min={0}
                            max={100}
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
                                    onChange={(e) => setAchievementData({ ...achievementData, status: e.value })}
                                    checked={achievementData.status === 'Active'}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value="Inactive"
                                    onChange={(e) => setAchievementData({ ...achievementData, status: e.value })}
                                    checked={achievementData.status === 'Inactive'}
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

export default SchoolViolationPage;
