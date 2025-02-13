/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';
import attendanceScheduleService from '../../../../services/attendanceScheduleService';
import { useAuth } from '../../../../context/AuthContext';
import { parseToDate } from '../../../../utils/formatTime';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from 'primereact/skeleton';

const SchoolSetAttendanceTimePage = () => {
    const [entryStartTime, setEntryStartTime] = useState<Date | null>(null);
    const [entryEndTime, setEntryEndTime] = useState<Date | null>(null);
    const [exitStartTime, setExitStartTime] = useState<Date | null>(null);
    const [exitEndTime, setExitEndTime] = useState<Date | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [entryError, setEntryError] = useState<string>('');
    const [exitError, setExitError] = useState<string>('');
    const [scheduleId, setScheduleId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const { user } = useAuth();

    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);

    const validateTimes = (): boolean => {
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

    const getDefaultAttendance = async () => {
        if (!user?.school_id) return;

        const dataType = {
            type: 'default' as const,
        };

        try {
            setLoading(true);
            const response = await attendanceScheduleService.showScheduleByType(dataType);
            const schedule = response?.data.data?.[0];

            if (schedule) {
                setEntryStartTime(parseToDate(schedule.check_in_start_time));
                setEntryEndTime(parseToDate(schedule.check_in_end_time));
                setExitStartTime(parseToDate(schedule.check_out_start_time));
                setExitEndTime(parseToDate(schedule.check_out_end_time));
                setLastUpdated(new Date(schedule.updated_at));
                setScheduleId(schedule.id);
                setInitialData({
                    entryStartTime: parseToDate(schedule.check_in_start_time),
                    entryEndTime: parseToDate(schedule.check_in_end_time),
                    exitStartTime: parseToDate(schedule.check_out_start_time),
                    exitEndTime: parseToDate(schedule.check_out_end_time),
                    lastUpdated: new Date(schedule.updated_at)
                });
            }
        } catch (error) {
            console.error('Failed to fetch default attendance schedule:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getDefaultAttendance();
    }, []);

    const resetForm = () => {
        if (initialData) {
            setEntryStartTime(initialData.entryStartTime);
            setEntryEndTime(initialData.entryEndTime);
            setExitStartTime(initialData.exitStartTime);
            setExitEndTime(initialData.exitEndTime);
        }
    };


    const handleSave = async () => {
        if (!validateTimes()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Perhatian',
                detail: 'Waktu jam masuk dan pulang harus diisi dengan benar.',
            });
            return;
        }

        const formatDate = (date: Date | null): string => {
            if (!date) return '';
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        };

        const scheduleData = {
            name: 'Default Attendance',
            type: 'default' as const,
            check_in_start_time: formatDate(entryStartTime),
            check_in_end_time: formatDate(entryEndTime),
            check_out_start_time: formatDate(exitStartTime),
            check_out_end_time: formatDate(exitEndTime),
        };

        try {
            setLoading(true);
            if (!user?.school_id || !scheduleId) return;
            await attendanceScheduleService.updateSchedule(scheduleId, scheduleData);

            toast.current?.show({
                severity: 'success',
                summary: 'Sukses',
                detail: 'Jam default absensi berhasil diperbarui!',
            });

            setInitialData({
                entryStartTime: entryStartTime,
                entryEndTime: entryEndTime,
                exitStartTime: exitStartTime,
                exitEndTime: exitEndTime
            });

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to update schedule:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Gagal memperbarui jam absensi.',
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmSave = () => {
        setConfirmDialogVisible(true);
    };

    const handleConfirmSave = () => {
        handleSave();
        setConfirmDialogVisible(false);
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
    const todayString = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-grid p-justify-center p-align-center p-mt-4">
            <Toast ref={toast} />
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

                <div>
                    <div className="mt-5">
                        <h5>Jam Masuk</h5>
                        <div className="flex gap-3">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="entry-start-time">Mulai jam masuk</label>
                                {loading ? <Skeleton width="17rem" height="2.5rem" /> : (
                                    <Calendar value={entryStartTime} onChange={(e) => setEntryStartTime(e.value as Date)} timeOnly hourFormat="24" showIcon />
                                )}
                            </div>
                            <div className="align-self-center mt-4">-</div>
                            <div className="flex flex-column gap-2">
                                <label htmlFor="entry-end-time">Selesai jam masuk</label>
                                {loading ? <Skeleton width="17rem" height="2.5rem" /> : (
                                    <Calendar value={entryEndTime} onChange={(e) => setEntryEndTime(e.value as Date)} timeOnly hourFormat="24" showIcon />
                                )}
                            </div>
                        </div>
                        {entryError && <small className="p-error">{entryError}</small>}
                    </div>

                    <div className="mt-4">
                        <h5>Jam Pulang</h5>
                        <div className="flex gap-3">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="exit-start-time">Mulai jam pulang</label>
                                {loading ? <Skeleton width="17rem" height="2.5rem" /> : (
                                    <Calendar value={exitStartTime} onChange={(e) => setExitStartTime(e.value as Date)} timeOnly hourFormat="24" showIcon />
                                )}
                            </div>
                            <div className="align-self-center mt-4">-</div>
                            <div className="flex flex-column gap-2">
                                <label htmlFor="exit-end-time">Selesai jam pulang</label>
                                {loading ? <Skeleton width="17rem" height="2.5rem" /> : (
                                    <Calendar value={exitEndTime} onChange={(e) => setExitEndTime(e.value as Date)} timeOnly hourFormat="24" showIcon />
                                )}
                            </div>
                        </div>
                        {exitError && <small className="p-error">{exitError}</small>}
                    </div>

                    <div className="mt-3">
                        <h5>Terakhir diperbarui</h5>
                        {loading ? <Skeleton width="15rem" height="2rem" /> : <Calendar value={lastUpdated} disabled showTime />}
                    </div>
                    <Divider />
                </div>
                <div className="p-d-flex p-ai-center">
                    <Button label="Reset" icon="pi pi-refresh" disabled={
                        !initialData ||
                        (entryStartTime?.getTime() === initialData.entryStartTime?.getTime() &&
                            entryEndTime?.getTime() === initialData.entryEndTime?.getTime() &&
                            exitStartTime?.getTime() === initialData.exitStartTime?.getTime() &&
                            exitEndTime?.getTime() === initialData.exitEndTime?.getTime())
                    } onClick={resetForm} className="mr-2" />
                    <Button
                        label="Save"
                        icon="pi pi-save"
                        disabled={
                            !initialData ||
                            (entryStartTime?.getTime() === initialData.entryStartTime?.getTime() &&
                                entryEndTime?.getTime() === initialData.entryEndTime?.getTime() &&
                                exitStartTime?.getTime() === initialData.exitStartTime?.getTime() &&
                                exitEndTime?.getTime() === initialData.exitEndTime?.getTime())
                        }
                        onClick={confirmSave}
                    />
                </div>
                <Dialog
                    visible={confirmDialogVisible}
                    style={{ width: '450px' }}
                    header="Konfirmasi"
                    modal
                    onHide={() => setConfirmDialogVisible(false)}
                    footer={
                        <>
                            <Button label="Batal" icon="pi pi-times" onClick={() => setConfirmDialogVisible(false)} />
                            <Button label="Ya" icon="pi pi-check" onClick={handleConfirmSave} />
                        </>
                    }
                >
                    <p>Apakah Anda yakin ingin menyimpan perubahan?</p>
                </Dialog>
            </div>
        </div>
    );
};

export default SchoolSetAttendanceTimePage;
