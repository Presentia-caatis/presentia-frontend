/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar } from "primereact/calendar"
import { Dropdown } from 'primereact/dropdown';
import { useState } from "react";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

const SchoolStudentAttendanceRecordPage = () => {
    const [listKelas, setListKelas] = useState([{ label: 'Kelas A', value: 'Kelas A' }, { label: 'Kelas B', value: 'Kelas B' }]);
    const [selectedKelas, setSelectedKelas] = useState();
    const [date, setDate] = useState(new Date());
    return (
        <>
            <div className="card">
                <h1>Rekam Presensi SMAN24 Bandung</h1>
                <div className="grid mt-4">
                    <div className="col-12 xl:col-6">
                        <h5>Silahkan Pilih Tanggal Presensi Dan Generate</h5>
                        <Calendar id="date" value={date} className="w-8" />
                    </div>
                    <div className="col-12 xl:col-6">
                        <h5>Silahkan Pilih Kelas</h5>
                        <Dropdown placeholder="Silahkan Pilih Kelas" value={selectedKelas} options={listKelas} onChange={(e) => {
                            setSelectedKelas(e.value);
                        }} optionLabel="label" className="w-4" />
                    </div>
                </div>
                <h3>Generate siswa yang tidak melakukan presensi (Absen)</h3>
                <Button icon="pi pi-upload" label="Generate" />
            </div>
            <div className="card">
                <DataTable paginator header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <div className="text-align-left flex gap-2">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined mb-2"
                            />
                            <Button type="button" icon="pi pi-upload" label="Export" className="p-button-outlined mb-2"
                            />
                        </div>
                        <span className="block mt-2 md:mt-0 p-input-icon-left ">
                            <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                            <InputText className='py-2 pl-5' placeholder="Search..." />
                        </span>
                    </div>
                } rows={20} rowsPerPageOptions={[20, 50, 75, 100]} emptyMessage="Belum ada data" tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students">
                    <Column sortable field="nama" header="Nama"></Column>
                    <Column sortable field="nis" header="NIS"></Column>
                    <Column sortable field="nisn" header="NISN"></Column>
                    <Column sortable field="kelamin" header="Kelamin"></Column>
                    <Column sortable field="kelas" header="Kelas"></Column>
                    <Column sortable field="status" header="Status"></Column>
                    <Column></Column>
                </DataTable>
            </div>
        </>
    )
}

export default SchoolStudentAttendanceRecordPage;