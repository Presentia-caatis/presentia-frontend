/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';

type EventData = {
    name: string;
    date: Date;
    startHour: Date;
    endHour: Date;
    status: string;
};

const SchoolCustomEventPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [eventStatusOptions, setEventStatusOptions] = useState([{ label: 'Active', value: '1' }, { label: 'Inactive', value: '0' }]);
    const [eventData, setEventData] = useState<EventData>({
        name: '',
        date: new Date(),
        startHour: new Date(new Date().setHours(7, 15)),
        endHour: new Date(new Date().setHours(16, 0)),
        status: ''
    });

    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({ id: '1', sticky: true, severity: 'info', detail: 'Custom Event akan mengubah jadwal absensi masuk dan keluar sesuai jam yang ditentukan', closable: false });
    });

    return (
        <>
            <div className="card">
                <h1>Custom Event Baru</h1>
                <Messages ref={msgs} />
                <div className='flex justify-content-between p-4 card mt-4'>
                    <div className='flex gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Event Baru' onClick={() => {
                            setShowAddDialog(true);
                        }} />
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' disabled />
                    </div>
                </div>

                <DataTable paginator header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 className="m-0">Daftar Custom Event</h5>
                        <span className="block mt-2 md:mt-0 p-input-icon-left ">
                            <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                            <InputText className='py-2 pl-5' placeholder="Search..." />
                        </span>
                    </div>
                } rows={20} rowsPerPageOptions={[20, 50, 75, 100]} emptyMessage="No events found" tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events">
                    <Column sortable field="name" header="Nama"></Column>
                    <Column sortable field="date" header="Tanggal"></Column>
                    <Column sortable field="hour" header="Jam"></Column>
                    <Column sortable field="minute" header="Menit"></Column>
                    <Column sortable field="status" header="Status"></Column>
                    <Column></Column>
                </DataTable>

                <Dialog visible={showAddDialog} style={{ width: '450px' }} onHide={() => { setShowAddDialog(false) }} header="Buat Event Baru" footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => { }} />
                    </div>
                } modal={true} className='p-fluid'>
                    <div className='field'>
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="name"
                            value={eventData.name}
                            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="date">Tanggal</label>
                        <Calendar id="date" value={date} />
                    </div>
                    <div className='field'>
                        <label htmlFor="startHour">Jam Masuk</label>
                        <Calendar id="startHour" value={eventData.startHour} onChange={(e) => setEventData({ ...eventData, startHour: e.value! })} timeOnly />
                    </div>
                    <div className='field'>
                        <label htmlFor="endHour">Jam Keluar</label>
                        <Calendar id="endHour" value={eventData.endHour} onChange={(e) => setEventData({ ...eventData, endHour: e.value! })} timeOnly />
                    </div>

                    <div className='field'>
                        <label htmlFor="status">Status</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value="1"
                                    onChange={(e) => setEventData({ ...eventData, status: e.value })}
                                    checked={eventData.status === '1'}
                                />
                                <label htmlFor="status1" className="ml-2">Aktif</label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value="0"
                                    onChange={(e) => setEventData({ ...eventData, status: e.value })}
                                    checked={eventData.status === '0'}
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

export default SchoolCustomEventPage;
