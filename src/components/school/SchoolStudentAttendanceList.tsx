/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import AttendanceService from '../../services/attendanceService';
import { formatTime } from '../../utils/formatTime';
import { useAuth } from '../../context/AuthContext';

const SchoolStudentAttendanceList = ({ onAttendanceUpdate }: { onAttendanceUpdate: (total: number) => void }) => {
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();
    const { user } = useAuth();

    const eventDetail = {
        isEvent: false,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    const fetchAttendance = async () => {
        if (!user?.school_id) {
            return;
        }

        try {
            setLoading(true);
            const response = await AttendanceService.getAttendances(user.school_id!);
            setAttendanceData(response.data);
            onAttendanceUpdate(response.data.length);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            onAttendanceUpdate(0);
        } finally {
            setLoading(false);
            setCountdown(30);
        }
    };

    useEffect(() => {
        fetchAttendance();

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    fetchAttendance();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(timer);
        };
    }, []);

    return (
        <Card className="text-center shadow-1 col-12 py-0">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h5>{formattedDate}</h5>
                    <p>{formattedTime}</p>
                </div>
                <div className="sm:block hidden">
                    <h4>Presensi Masuk Siswa</h4>
                    <p className="text-sm text-secondary">Waktu Presensi masuk: 07:00 - 08:00</p>
                </div>
                <div>
                    {eventDetail.isEvent ? (
                        <Tag
                            value="Sedang Event"
                            severity="info"
                            id="event-tooltip"
                            data-pr-tooltip={`Event: ${eventDetail.name}\nJam Masuk: ${eventDetail.startTime}\nJam Keluar: ${eventDetail.endTime}`}
                        />
                    ) : (
                        <Tag value="Tidak Ada Event" severity="secondary" />
                    )}
                    <Tooltip target="#event-tooltip" position="left" />
                </div>
            </div>
            <div className="sm:hidden block mb-2">
                <h4>Daftar Presensi Masuk Siswa</h4>
                <p className="text-sm text-secondary">Waktu Presensi masuk: 07:00 - 08:00</p>
            </div>
            <ul className="list-none p-2 m-0" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {loading ? (
                    <li className="py-1 text-center text-sm text-secondary">Loading...</li>
                ) : attendanceData.length > 0 ? (
                    attendanceData.map((attendance: any, index: number) => (
                        <li
                            key={index}
                            className="py-1 flex justify-content-between align-items-center text-sm surface-border"
                        >
                            <span className="font-bold">{index + 1}. {attendance.student.student_name}</span>
                            <span>
                                {formatTime(attendance.check_in_time)}
                            </span>
                        </li>
                    ))
                ) : (
                    <li className="py-1 text-center text-sm text-secondary">Belum ada yang presensi</li>
                )}
            </ul>
            <div className="flex justify-content-center gap-2 mt-4">
                <Tag
                    value={countdown.toString()}
                    severity="info"
                    id="countdown-tooltip"
                    rounded
                    className='w-3rem'
                    style={{
                        border: '1px solid var(--blue-500)',
                        backgroundColor: 'transparent',
                        color: 'var(--blue-500)',
                    }}
                />
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    className="p-button p-button-primary"
                    onClick={fetchAttendance}
                    loading={loading}
                />
                <Tooltip target="#countdown-tooltip" position="left" />
            </div>
        </Card>
    );
};

export default SchoolStudentAttendanceList;
