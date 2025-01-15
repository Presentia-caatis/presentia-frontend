import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';


const SchoolStudentAttendanceList = () => {
    const eventDetail = {
        isEvent: true,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    const studentAttendance = [
        // { name: 'John Doe', time: '08:10' },
        // { name: 'Jane Smith', time: '08:20' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
        // { name: 'Alice Johnson', time: '08:30' },
    ];
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();

    return (
        <Card className="text-center shadow-1 col-12 py-0 ">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h5>{formattedDate}</h5>
                    <p>{formattedTime}</p>
                </div>
                <div className="sm:block hidden">
                    <h4>Daftar Absen Masuk Siswa</h4>
                    <p className="text-sm text-secondary">Batas waktu absen masuk: 07:00</p>
                </div>
                <div>
                    {eventDetail?.isEvent ? (
                        <Tag
                            value="Sedang Event"
                            severity="info"
                            id="event-tooltip"
                            className=""
                            data-pr-tooltip={`Event: ${eventDetail.name}\nJam Masuk: ${eventDetail.startTime}\nJam Keluar: ${eventDetail.endTime}`}
                        />
                    ) : (
                        <Tag value="Tidak Ada Event" severity="secondary" />
                    )}
                    <Tooltip target="#event-tooltip" position="left" />
                </div>
            </div>
            <div className="sm:hidden block mb-2">
                <h4>Daftar Absen Masuk Siswa</h4>
                <p className="text-sm text-secondary">Batas waktu absen masuk: 07:00</p>
            </div>
            <ul
                className="list-none p-2 m-0"
                style={{ maxHeight: '180px', overflowY: 'auto' }}
            >
                {studentAttendance.length > 0 ? (
                    studentAttendance.map((student, index) => (
                        <li
                            key={index}
                            className="py-1 flex justify-content-between align-items-center text-sm surface-border"
                        >
                            <span className="font-bold">{index + 1}. {student.name}</span>
                            <span>{student.time}</span>
                        </li>
                    ))
                ) : (
                    <li className="py-1 text-center text-sm text-secondary">Belum ada yang absen</li>
                )}
            </ul>
            <div className='flex justify-content-center gap-2 mt-4'>
                <Tag
                    value="12"
                    severity="info"
                    id="countdown-tooltip"
                    className="w-3rem"
                    data-pr-tooltip={`Countdown`}
                    rounded
                    style={{
                        border: '1px solid var(--blue-500)',
                        backgroundColor: 'transparent',
                        color: 'var(--blue-500)'
                    }}
                />
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    className="p-button p-button-primary"
                />
                <Tooltip target="#countdown-tooltip" position="left" />
            </div>

        </Card>
    );
};

export default SchoolStudentAttendanceList;
