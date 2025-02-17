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
import { Checkbox } from 'primereact/checkbox';

type EventData = {
    name: string;
    date: Date;
    entryStart: Date;
    entryEnd: Date;
    exitStart: Date;
    exitEnd: Date;
    status: number;
};

const SchoolCustomEventPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [eventList, setEventList] = useState<EventData[]>([]);
    const [eventData, setEventData] = useState<EventData>({
        name: '',
        date: new Date(),
        entryStart: new Date(new Date().setHours(7, 15)),
        entryEnd: new Date(new Date().setHours(8, 0)),
        exitStart: new Date(new Date().setHours(15, 30)),
        exitEnd: new Date(new Date().setHours(16, 0)),
        status: 1
    });
    const [selectedEvents, setSelectedEvents] = useState<EventData[]>([]);
    const [errors, setErrors] = useState({
        name: '',
        date: '',
        entryStart: '',
        entryEnd: '',
        exitStart: '',
        exitEnd: '',
        status: ''
    });
    const [editMode, setEditMode] = useState(false);

    const msgs = useRef<Messages>(null);

    const validateEventData = (): boolean => {
        let valid = true;
        const newErrors = { name: '', date: '', entryStart: '', entryEnd: '', exitStart: '', exitEnd: '', status: '' };

        if (!eventData.name) {
            newErrors.name = 'Nama event harus diisi.';
            valid = false;
        }
        if (eventData.entryStart >= eventData.entryEnd) {
            newErrors.entryStart = 'Jam mulai masuk harus lebih kecil dari jam selesai masuk.';
            valid = false;
        }
        if (eventData.exitStart >= eventData.exitEnd) {
            newErrors.exitStart = 'Jam mulai keluar harus lebih kecil dari jam selesai keluar.';
            valid = false;
        }
        if (!eventData.status) {
            newErrors.status = 'Status harus dipilih.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID');
    };

    const handleTimeChange = (key: keyof EventData, value: Date) => {
        const hours = value.getHours();
        const minutes = value.getMinutes();
        setEventData((prev) => ({
            ...prev,
            [key]: new Date(new Date().setHours(hours, minutes, 0, 0)),
        }));
    };

    const handleSave = () => {
        if (validateEventData()) {
            if (editMode) {
                setEventList((prev) =>
                    prev.map((event) => (event === selectedEvents[0] ? { ...eventData } : event))
                );
                msgs.current?.show({ severity: 'success', summary: 'Success', detail: 'Event berhasil diperbarui!' });
            } else {
                setEventList([...eventList, { ...eventData }]);
                msgs.current?.show({ severity: 'success', summary: 'Success', detail: 'Event berhasil disimpan!' });
            }
            resetForm();
        }
    };

    const resetForm = () => {
        setShowAddDialog(false);
        setEditMode(false);
        setSelectedEvents([]);
        setEventData({
            name: '',
            date: new Date(),
            entryStart: new Date(new Date().setHours(7, 15)),
            entryEnd: new Date(new Date().setHours(8, 0)),
            exitStart: new Date(new Date().setHours(15, 30)),
            exitEnd: new Date(new Date().setHours(16, 0)),
            status: 1
        });
        setErrors({ name: '', date: '', entryStart: '', entryEnd: '', exitStart: '', exitEnd: '', status: '' });
    };

    const handleEdit = (event: EventData) => {
        setEventData({ ...event });
        setEditMode(true);
        setShowAddDialog(true);
    };

    const handleDelete = () => {
        setEventList(eventList.filter((event) => !selectedEvents.includes(event)));
        setSelectedEvents([]);
        msgs.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Event berhasil dihapus!' });
    };

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Event akan mengubah jadwal absensi masuk dan keluar sesuai jam yang ditentukan',
            closable: false
        });
    });

    return (
        <>
            <div className="card">
                <h1>Buat Event Sekolah</h1>
                <Messages ref={msgs} />
                <div className='flex justify-content-between p-4 card mt-4'>
                    <div className='flex gap-2'>
                        <Button icon="pi pi-plus" severity='success' label='Event Baru' onClick={() => setShowAddDialog(true)} />
                        <Button icon="pi pi-trash" severity='danger' label='Hapus' onClick={handleDelete} disabled={!selectedEvents.length} />
                    </div>
                </div>

                <DataTable
                    value={eventList}
                    paginator
                    selection={selectedEvents}
                    selectionMode={'multiple'}
                    onSelectionChange={(e) => setSelectedEvents(e.value)}
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Daftar Event</h5>
                            <span className="block mt-2 md:mt-0 p-input-icon-left">
                                <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                                <InputText className='py-2 pl-5' placeholder="Search..." />
                            </span>
                        </div>
                    }
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    emptyMessage="No events found"
                    tableStyle={{ minWidth: '50rem' }}
                    dataKey="name"
                >
                    <Column selectionMode="multiple" style={{ width: '3em' }} />
                    <Column field="name" header="Nama" sortable />
                    <Column field="date" header="Tanggal" body={(rowData) => formatDate(rowData.date)} sortable />
                    <Column field="entryStart" header="Jam Masuk Mulai" body={(rowData) => formatTime(rowData.entryStart)} sortable />
                    <Column field="entryEnd" header="Jam Masuk Selesai" body={(rowData) => formatTime(rowData.entryEnd)} sortable />
                    <Column field="exitStart" header="Jam Keluar Mulai" body={(rowData) => formatTime(rowData.exitStart)} sortable />
                    <Column field="exitEnd" header="Jam Keluar Selesai" body={(rowData) => formatTime(rowData.exitEnd)} sortable />
                    <Column field="status" header="Status" sortable />
                    <Column
                        body={(rowData) => (
                            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
                        )}
                        headerStyle={{ width: '4rem' }}
                    />
                </DataTable>

                <Dialog
                    visible={showAddDialog}
                    style={{ width: '450px' }}
                    onHide={resetForm}
                    header={editMode ? 'Edit Event' : 'Buat Event Baru'}
                    footer={
                        <div>
                            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={resetForm} />
                            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
                        </div>
                    }
                    modal={true}
                    className="p-fluid"
                >
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <InputText
                            id="name"
                            value={eventData.name}
                            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="date">Tanggal</label>
                        <Calendar
                            id="date"
                            value={eventData.date}
                            onChange={(e) => setEventData({ ...eventData, date: e.value! })}
                            dateFormat="dd/mm/yy"
                        />
                        {errors.date && <small className="p-error">{errors.date}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="entryStart">Jam Masuk Mulai</label>
                        <Calendar
                            id="entryStart"
                            value={eventData.entryStart}
                            onChange={(e) => handleTimeChange('entryStart', e.value!)}
                            timeOnly
                        />
                        {errors.entryStart && <small className="p-error">{errors.entryStart}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="entryEnd">Jam Masuk Selesai</label>
                        <Calendar
                            id="entryEnd"
                            value={eventData.entryEnd}
                            onChange={(e) => handleTimeChange('entryEnd', e.value!)}
                            timeOnly
                        />
                        {errors.entryEnd && <small className="p-error">{errors.entryEnd}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="exitStart">Jam Keluar Mulai</label>
                        <Calendar
                            id="exitStart"
                            value={eventData.exitStart}
                            onChange={(e) => handleTimeChange('exitStart', e.value!)}
                            timeOnly
                        />
                        {errors.exitStart && <small className="p-error">{errors.exitStart}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="exitEnd">Jam Keluar Selesai</label>
                        <Calendar
                            id="exitEnd"
                            value={eventData.exitEnd}
                            onChange={(e) => handleTimeChange('exitEnd', e.value!)}
                            timeOnly
                        />
                        {errors.exitEnd && <small className="p-error">{errors.exitEnd}</small>}
                    </div>
                    <div className="field">
                        <label>Status</label>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status1"
                                    name="status"
                                    value={1}
                                    onChange={(e) => setEventData({ ...eventData, status: e.value })}
                                    checked={eventData.status === 1}
                                />
                                <label htmlFor="status1" className="ml-2">
                                    Aktif
                                </label>
                            </div>
                            <div className="field-radiobutton col-6">
                                <RadioButton
                                    inputId="status2"
                                    name="status"
                                    value={0}
                                    onChange={(e) => setEventData({ ...eventData, status: e.value })}
                                    checked={eventData.status === 0}
                                />
                                <label htmlFor="status2" className="ml-2">
                                    Tidak Aktif
                                </label>
                            </div>
                        </div>
                        {errors.status && <small className="p-error">{errors.status}</small>}
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default SchoolCustomEventPage;
