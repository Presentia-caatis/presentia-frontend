/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';


type StudentData = {
    name: string;
    nis: string;
    nisn: string;
    kelas: string;
    kelamin: string;
    status: string;
};

const SchoolStudentPage = () => {

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listKelas, setListKelas] = useState([{ label: 'Kelas A', value: 'Kelas A' }, { label: 'Kelas B', value: 'Kelas B' }]);
    const [listKelamin, setListKelamin] = useState([{ label: 'Laki-Laki', value: 'Laki-Laki' }, { label: 'Perempuan', value: 'Perempuan' }]);
    const [studentData, setStudentData] = useState<StudentData>({
        name: '',
        nis: '',
        nisn: '',
        kelas: '',
        kelamin: '',
        status: ''
    });

    const [selectedStudents, setSelectedStudents] = useState<StudentData[] | undefined>(undefined);

    return (
        <>
            <div className="card">
                <div className='flex justify-content-between p-4 card'>
                    <div className='flex gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Siswa Baru' onClick={() => {
                            setShowAddDialog(true);
                        }} />
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled={!selectedStudents?.length} />
                    </div>
                    <Button icon="pi pi-upload" severity='help' label='Export' />
                </div>

                <DataTable dataKey="id"
                    selection={selectedStudents!}
                    selectionMode="multiple"
                    onSelectionChange={(e) => setSelectedStudents(e.value)} paginator header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Data Siswa SMK Telkom Bandung</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left ">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className='py-2 pl-5' placeholder="Search..." />
                            </span>
                        </div>
                    } rows={20} rowsPerPageOptions={[20, 50, 75, 100]} emptyMessage="Belum ada siswa" tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students">
                    <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
                    <Column sortable field="nama" header="Nama"></Column>
                    <Column sortable field="nis" header="NIS"></Column>
                    <Column sortable field="nisn" header="NISN"></Column>
                    <Column sortable field="kelamin" header="Kelamin"></Column>
                    <Column sortable field="kelas" header="Kelas"></Column>
                    <Column sortable field="status" header="Status"></Column>
                    <Column body={() => (
                        <div className='flex gap-2'>
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
                    )} />
                </DataTable>

                <Dialog visible={showAddDialog} style={{ width: '450px' }} onHide={() => { setShowAddDialog(false) }} header="Penambahan Data Siswa" footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => { }} />
                    </div>
                } modal={true} className='p-fluid'>
                    <div className='field'>
                        <label htmlFor="nama">Nama</label>
                        <InputText
                            id="nama"
                            value={studentData.name}
                            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nis">NIS</label>
                        <InputText
                            id="nis"
                            type='number'
                            value={studentData.nis}
                            onChange={(e) => setStudentData({ ...studentData, nis: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="nisn">NISN</label>
                        <InputText
                            id="nisn"
                            type='number'
                            value={studentData.nis}
                            onChange={(e) => setStudentData({ ...studentData, nisn: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="kelas">Kelas</label>
                        <Dropdown value={studentData.kelas} onChange={(e) => setStudentData({ ...studentData, kelas: e.value })} options={listKelas} optionLabel="label"
                            placeholder="Pilih Kelas" />
                    </div>
                    <div className='field'>
                        <label htmlFor="kelamin">Kelamin</label>
                        <Dropdown value={studentData.kelamin} onChange={(e) => setStudentData({ ...studentData, kelamin: e.value })} options={listKelamin} optionLabel="label"
                            placeholder="Pilih Kelamin" />
                    </div>
                    <div className='field'>
                        <label htmlFor="status">Status Siswa</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value="1"
                                    onChange={(e) => setStudentData({ ...studentData, status: e.value })}
                                    checked={studentData.status === '1'}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value="0"
                                    onChange={(e) => setStudentData({ ...studentData, status: e.value })}
                                    checked={studentData.status === '0'}
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

export default SchoolStudentPage;
