import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';

const SchoolSetAttendanceTimePage = () => {
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const toast = useRef<Toast>(null);

    const handleSave = () => {
        if (startTime && endTime) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Default attendance time saved!' });
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please set both start and end times.' });
        }
    };

    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({ id: '1', sticky: true, severity: 'info', detail: 'Waktu yang ditentukan akan menjadi default waktu presensi', closable: false });
    });

    const today = new Date();
    const todayString = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });


    return (
        <div className="p-grid p-justify-center p-align-center p-mt-4">
            <div className="card">
                <div className='flex justify-content-between'>
                    <div>
                        <h1>Konfigurasi Waktu Presensi</h1>
                    </div>
                    <div className='my-auto'>
                        <h3 className=''>{todayString}</h3>
                    </div>
                </div>
                <Messages ref={msgs} />
                <div className="mt-5">
                    <h5>Jam Masuk</h5>
                    <Calendar
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.value as Date)}
                        timeOnly
                        hourFormat="24"
                        showIcon
                    />
                </div>

                <div className="mt-3">
                    <h5>Jam Keluar</h5>
                    <Calendar
                        id="start-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.value as Date)}
                        timeOnly
                        hourFormat="24"
                        showIcon
                    />
                </div>

                <div className="mt-3">
                    <h5>Terakhir diperbarui</h5>
                    <Calendar
                        id="last-update-time"
                        value={endTime}
                        timeOnly
                        hourFormat="24"
                        disabled
                    />
                </div>

                <Divider />

                <Button label="Save" icon="pi pi-save" onClick={handleSave} className="p-mt-3" />
                <Toast ref={toast} />
            </div>
        </div>
    );
};

export default SchoolSetAttendanceTimePage;
