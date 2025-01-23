/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../../../context/SchoolContext';
import logo from "../../../../assets/Logo-SMK-10-Bandung.png"
import AttendanceService from '../../../../services/attendanceService';
import { Helmet } from 'react-helmet';
import { formatTime } from '../../../../utils/formatTime';
import { useAuth } from '../../../../context/AuthContext';


const SchoolStudentAttendanceListPage = () => {
    const navigate = useNavigate();
    const { schoolData } = useSchool();
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(30);
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString('id-ID');
    const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour12: false });

    const eventDetail = {
        isEvent: false,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    const isWithinTimeRange = (time: string): boolean => {
        const [hours, minutes] = time.split(':').map(Number);
        const attendanceTime = hours * 60 + minutes;
        const startTime = 7 * 60;
        const endTime = 8 * 60;
        return attendanceTime >= startTime && attendanceTime <= endTime;
    };


    const fetchAttendance = async () => {
        if (!user?.school_id) {
            return;
        }
        try {
            setLoading(true);
            const response: any = await AttendanceService.getAttendances(user.school_id);
            setAttendanceData(response.data);
        } catch (error: any) {
            console.error("Error fetching attendance data", error);
            if (error.response?.status === 401 || error.response?.data?.error === "Unauthenticated.") {
                localStorage.clear();

                navigate("/login");
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setCountdown(30);
            setLoading(false);
        }
    };



    // const studentAttendance = [
    //     { name: 'John Doe', time: '08:10' },
    //     { name: 'Jane Smith', time: '08:20' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'John Doe', time: '08:10' },
    //     { name: 'Jane Smith', time: '08:20' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    //     { name: 'Alice Johnson', time: '08:30' },
    // ];


    useEffect(() => {
        fetchAttendance();

        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 1) {
                    fetchAttendance();
                    return 30;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(timer);
        };
    }, []);




    return (
        <div className='flex flex-column align-items-center'>
            <Helmet>
                <title>{schoolData ? schoolData.name : "Presentia"}</title>
            </Helmet>
            <div className='flex h-8rem justify-content-between w-full px-4 gap-1'>
                <div className='my-auto flex'>
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-plain "
                        onClick={() => navigate(`/school/${schoolData.id}/dashboard`)}
                        aria-label="Back"
                    />
                    <div className='my-auto'>Kembali ke Dashboard</div>
                </div>
                <div className='my-auto text-center flex gap-3'>
                    <img
                        src={logo}
                        alt="Logo Sekolah"
                        className='w-4rem h-4rem hidden lg:block'
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <div className=' text-lg lg:text-6xl font-bold text-black-alpha-90 my-auto'>{schoolData ? schoolData.name : "Loading..."}</div>
                </div>
                <div className='my-auto'>
                    <div className='flex justify-content-center gap-2 align-content-end'>
                        <Tag
                            value={countdown.toString()}
                            severity="info"
                            id="countdown-tooltip"
                            className="w-3rem text-xl"
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
                            onClick={() => fetchAttendance()}
                            loading={loading}
                        />
                        <Tooltip target="#countdown-tooltip" position="left" />
                    </div>
                </div>
            </div>
            <Card className="text-center shadow-1 col-12 py-0 w-10 overflow-auto mb-4">
                <div className="flex justify-content-between align-items-center mb-4 gap-2 white-space-nowrap">
                    <div>
                        <h5>{formattedDate}</h5>
                        <p>{formattedTime}</p>
                    </div>
                    <div className="sm:block hidden text-center w-full lg:pl-3">
                        <h3>Daftar presensi masuk siswa</h3>
                        <p className="text-base text-secondary">Waktu presensi masuk: 07:00 - 08:00</p>
                    </div>
                    <div>
                        {eventDetail?.isEvent ? (
                            <div className="flex flex-column align-items-center gap-2">
                                <Tag value="Sedang Event" severity="info" />
                                <div
                                    className="text-sm text-secondary border-round px-2 py-1 text-left"
                                    style={{
                                        backgroundColor: 'var(--blue-50)',
                                        border: '1px solid var(--blue-300)',
                                    }}
                                >
                                    Event: {eventDetail.name} <br />
                                </div>
                            </div>
                        ) : (
                            <Tag value="Tidak Ada Event" severity="secondary" />
                        )}
                    </div>
                </div>
                <div className="sm:hidden block mb-2">
                    <h4>Daftar presensi masuk siswa</h4>
                    <p className="text-base text-secondary">Waktu presensi masuk: <br /> 07:00 - 08:00</p>
                </div>
                <div className='mt-4'>
                    <div className='flex justify-content-between py-2 px-3 border-bottom-1 surface-border'>
                        <span className='font-bold text-lg'>Nama</span>
                        <span className='font-bold text-lg'>Waktu</span>
                    </div>
                    <ul
                        className="list-none p-2 m-0 h-full max-h-full lg:max-h-70vh"
                        style={{ overflowY: 'auto' }}
                    >
                        {loading ? (
                            <li className="py-1 text-center text-xl text-secondary">Loading...</li>
                        ) : attendanceData.length > 0 ? (
                            attendanceData.map((attendance: any, index: any) => {
                                const checkInTime = formatTime(attendance.check_in_time);
                                const isOnTime = isWithinTimeRange(checkInTime);
                                const bgColor = isOnTime ? 'bg-green-100' : 'bg-red-100';

                                return (
                                    <li
                                        key={index}
                                        className={`flex justify-content-between ${bgColor} align-items-center border-1 p-3 text-base md:text-2xl surface-border text-left`}
                                    >
                                        <div>
                                            <span className="font-bold">{index + 1}. </span>
                                            <span className="font-bold">{attendance.student.student_name}</span>
                                        </div>
                                        <span>{checkInTime}</span>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="py-1 text-center text-xl text-secondary">Belum ada yang presensi</li>
                        )}
                    </ul>

                </div>

            </Card>
        </div>

    );
};

export default SchoolStudentAttendanceListPage;
