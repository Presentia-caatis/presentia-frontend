import React, { useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';

const SchoolSetAttendanceTimePage = () => {
    const [entryStartTime, setEntryStartTime] = useState<Date | null>(null);
    const [entryEndTime, setEntryEndTime] = useState<Date | null>(null);
    const [exitStartTime, setExitStartTime] = useState<Date | null>(null);
    const [exitEndTime, setExitEndTime] = useState<Date | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [entryError, setEntryError] = useState<string>('');
    const [exitError, setExitError] = useState<string>('');

    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);

    const validateTimes = () => {
        let valid = true;

        if (!entryStartTime || !entryEndTime) {
            setEntryError('Jam masuk harus diisi lengkap.');
            valid = false;
        } else if (entryStartTime >= entryEndTime) {
            setEntryError('Jam mulai masuk harus sebelum jam selesai masuk.');
            valid = false;
        } else {
            setEntryError('');
        }

        if (!exitStartTime || !exitEndTime) {
            setExitError('Jam pulang harus diisi lengkap.');
            valid = false;
        } else if (exitStartTime >= exitEndTime) {
            setExitError('Jam mulai pulang harus sebelum jam selesai pulang.');
            valid = false;
        } else if (
            entryStartTime &&
            entryEndTime &&
            (exitStartTime < entryEndTime && exitEndTime > entryStartTime)
        ) {
            setExitError('Rentang jam pulang tidak boleh bertumpang tindih dengan rentang jam masuk.');
            valid = false;
        } else {
            setExitError('');
        }

        return valid;
    };


    const handleSave = () => {
        if (!validateTimes()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Perhatian',
                detail: 'Waktu jam masuk dan pulang harus diisi dengan benar.',
            });
            return;
        }

        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Jam default absensi sudah ditentukan!',
        });
        setLastUpdated(new Date());
    };

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Waktu yang ditentukan akan menjadi default waktu presensi.',
            closable: false,
        });
    });

    const today = new Date();
    const todayString = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-grid p-justify-center p-align-center p-mt-4">
            <div className="card">
                <div className="flex justify-content-between">
                    <div>
                        <h1>Konfigurasi Waktu Presensi</h1>
                    </div>
                    <div className="my-auto">
                        <h3>{todayString}</h3>
                    </div>
                </div>
                <Messages ref={msgs} />
                <div className="mt-5">
                    <h5>Jam Masuk</h5>
                    <div className="flex gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="entry-start-time">Mulai jam masuk</label>
                            <Calendar
                                id="entry-start-time"
                                value={entryStartTime}
                                onChange={(e) => setEntryStartTime(e.value as Date)}
                                timeOnly
                                hourFormat="24"
                                showIcon
                            />
                        </div>
                        <div className="align-self-center mt-4">-</div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="entry-end-time">Selesai jam masuk</label>
                            <Calendar
                                id="entry-end-time"
                                value={entryEndTime}
                                onChange={(e) => setEntryEndTime(e.value as Date)}
                                timeOnly
                                hourFormat="24"
                                showIcon
                            />
                        </div>
                    </div>
                    {entryError && <small className="p-error">{entryError}</small>}
                </div>

                <div className="mt-4">
                    <h5>Jam Pulang</h5>
                    <div className="flex gap-3">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="exit-start-time">Mulai jam pulang</label>
                            <Calendar
                                id="exit-start-time"
                                value={exitStartTime}
                                onChange={(e) => setExitStartTime(e.value as Date)}
                                timeOnly
                                hourFormat="24"
                                showIcon
                            />
                        </div>
                        <div className="align-self-center mt-4">-</div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="exit-end-time">Selesai jam pulang</label>
                            <Calendar
                                id="exit-end-time"
                                value={exitEndTime}
                                onChange={(e) => setExitEndTime(e.value as Date)}
                                timeOnly
                                hourFormat="24"
                                showIcon
                            />
                        </div>

                    </div>
                    {exitError && <small className="p-error">{exitError}</small>}
                </div>

                <div className="mt-3">
                    <h5>Terakhir diperbarui</h5>
                    <Calendar
                        id="last-update-time"
                        value={lastUpdated}
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
