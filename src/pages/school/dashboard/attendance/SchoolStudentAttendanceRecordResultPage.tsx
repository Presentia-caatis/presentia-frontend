/* eslint-disable @typescript-eslint/no-unused-vars */
import { Calendar } from "primereact/calendar"
import { useState } from "react";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";

const SchoolStudentAttendanceRecordResultPage = () => {
    const [listKelas, setListKelas] = useState([{ label: 'Kelas A', value: 'Kelas A' }, { label: 'Kelas B', value: 'Kelas B' }]);
    const [selectedKelas, setSelectedKelas] = useState();
    const [date, setDate] = useState(new Date());
    return (
        <>
            <div className="card">
                <h3>Silahkan Pilih Tanggal</h3>
                <Calendar id="date" value={date} className="w-8" />

            </div>
            <div className="card">
                <Toolbar start={<Button type="button" icon="pi pi-trash" label="Hapus" severity="danger" className="mb-2" disabled
                />} end={<Button type="button" icon="pi pi-upload" label="Export" severity='help' className="mb-2"
                />} className="mb-4" />

                <DataTable paginator header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 className="m-0">SMAN 24 Bandung</h5>
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

export default SchoolStudentAttendanceRecordResultPage;