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
import { useAuth } from '../../../../context/AuthContext';
import attendanceScheduleService from '../../../../services/attendanceScheduleService';
import { formatSchoolName } from '../../../../utils/formatSchoolName';
import { TabMenu } from 'primereact/tabmenu';
import { formatTime, parseToDate } from '../../../../utils/formatTime';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const countdownTime = 15;

const SchoolStudentAttendanceListPage = () => {
    const navigate = useNavigate();
    const [autoSwitch, setAutoSwitch] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem("autoSwitch") || "true");
    });
    const [pauseCountdown, setPauseCountdown] = useState<boolean>(false);
    const { school } = useSchool();
    const { user } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [countdown, setCountdown] = useState(countdownTime);
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString('id-ID');
    const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour12: false });
    const [entryStartTime, setEntryStartTime] = useState<Date | null>(null);
    const [entryEndTime, setEntryEndTime] = useState<Date | null>(null);
    const [exitStartTime, setExitStartTime] = useState<Date | null>(null);
    const [exitEndTime, setExitEndTime] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const items = [
        { label: 'Presensi Masuk', icon: 'pi pi-sign-in' },
        { label: 'Presensi Pulang', icon: 'pi pi-sign-out' },
    ];

    useEffect(() => {
        localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
    }, [autoSwitch]);

    const eventDetail = {
        isEvent: false,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    const fetchDefaultAttendanceSchedule = async () => {
        if (!user?.school_id) return;

        const dataType = { type: 'default' as const };
        setLoading(true);
        try {
            const response = await attendanceScheduleService.showScheduleByType(dataType);
            const schedule = response?.data?.data?.[0];

            if (schedule) {
                setEntryStartTime(parseToDate(schedule.check_in_start_time));
                setEntryEndTime(parseToDate(schedule.check_in_end_time));
                setExitStartTime(parseToDate(schedule.check_out_start_time));
                setExitEndTime(parseToDate(schedule.check_out_end_time));
            }
        } catch (error) {
            console.error('Failed to fetch default attendance schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        console.log(entryStartTime, exitStartTime);
        if (!entryStartTime || !exitStartTime) {
            return;
        }

        const now = new Date();
        if (autoSwitch) {
            if (now >= entryStartTime && now < exitStartTime) {
                setActiveIndex(0);
            } else if (now >= exitStartTime) {
                setActiveIndex(1);
            }
        }

        fetchAttendance(currentPage, rowsPerPage);
    };

    const fetchAttendance = async (page = 1, perPage = 10) => {
        if (!user?.school_id) {
            return;
        }
        try {
            setLoading(true);
            const params: any = {
                page,
                perPage
            };

            const dates = ([
                new Date(),
                new Date(),
            ]);

            if (dates && dates.length === 2 && dates[0] && dates[1]) {
                params.startDate = dates[0].toISOString().split("T")[0];
                params.endDate = dates[1].toISOString().split("T")[0];
            }

            const response: any = await AttendanceService.getAttendances(params);
            setAttendanceData(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error: any) {
            console.error("❌ Error fetching attendance data", error);
            if (error.response?.status === 401 || error.response?.data?.error === "Unauthenticated.") {
                localStorage.clear();
                navigate("/login");
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setCountdown(countdownTime);
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchDefaultAttendanceSchedule();
        };

        initialize();
    }, [])


    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (loading) return countdownTime;
                if (pauseCountdown) return prevCountdown;
                if (prevCountdown === 1) {
                    handleRefresh();
                    return countdownTime;
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
    }, [loading, pauseCountdown]);


    useEffect(() => {
        fetchAttendance(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);


    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <Card className="text-center shadow-1 col-12 py-0 w-10 overflow-auto mb-4">
                        <div className="flex justify-content-between align-items-center mb-4 gap-2 white-space-nowrap">
                            <div>
                                <h5>{formattedDate}</h5>
                                <p>{formattedTime}</p>
                            </div>
                            <div className="sm:block hidden text-center w-full lg:pl-3 ">
                                <h2>Daftar presensi masuk siswa</h2>
                                <p className="text-2xl font-bold text-black-alpha-90">
                                    Waktu presensi:  <br /> {entryStartTime ? entryStartTime.toLocaleTimeString('id-ID') : "Loading..."} - {entryEndTime ? entryEndTime.toLocaleTimeString('id-ID') : "Loading..."}
                                </p>
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
                            <h4>Daftar presensi siswa</h4>
                            <p className="text-base text-secondary">Waktu presensi: <br /> {entryStartTime ? entryStartTime.toLocaleTimeString('id-ID') : "Loading..."} - {entryEndTime ? entryEndTime.toLocaleTimeString('id-ID') : "Loading..."}</p>
                        </div>
                        <div className='mt-4'>
                            <DataTable
                                dataKey='id'
                                value={attendanceData}
                                emptyMessage={loading ? (
                                    <div className="flex flex-column align-items-center gap-3 py-4">
                                        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                        <span className="text-gray-500 font-semibold">Memuat data kehadiran...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-column align-items-center gap-3 py-4">
                                        <i className="pi pi-calendar-times text-gray-400" style={{ fontSize: "2rem" }} />
                                        <span className="text-gray-500 font-semibold">Belum ada data kehadiran</span>
                                        <small className="text-gray-400">Silakan lakukan presensi terlebih dahulu.</small>
                                    </div>
                                )}
                                paginator
                                lazy
                                first={(currentPage - 1) * rowsPerPage}
                                rows={rowsPerPage}
                                totalRecords={totalRecords}
                                onPage={(event) => {
                                    setCurrentPage((event.page ?? 0) + 1);
                                    setRowsPerPage(event.rows);
                                }}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                showGridlines
                                stripedRows
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students">
                                <Column field="student.student_name" header="Nama" sortable
                                    className="text-lg"
                                    headerStyle={{ width: '50%', minWidth: '200px' }}
                                    bodyStyle={{ width: '50%', minWidth: '200px' }}
                                />
                                <Column field="check_in_time" header="Waktu"
                                    body={(rowData) => formatTime(rowData.check_in_time)} sortable
                                    className="text-lg"
                                    headerStyle={{ width: '5%', whiteSpace: 'nowrap' }}
                                    bodyStyle={{ width: '5%', whiteSpace: 'nowrap' }}
                                />
                                <Column field="check_in_status.status_name" header="Status"
                                    className="text-lg"
                                    headerStyle={{ width: '5%', whiteSpace: 'nowrap' }}
                                    bodyStyle={{ width: '5%', whiteSpace: 'nowrap' }}
                                />
                            </DataTable>
                        </div>
                    </Card >
                );
            case 1:
                return (
                    <Card className="text-center shadow-1 col-12 py-0 w-10 overflow-auto mb-4">
                        <div className="flex justify-content-between align-items-center mb-4 gap-2 white-space-nowrap">
                            <div>
                                <h5>{formattedDate}</h5>
                                <p>{formattedTime}</p>
                            </div>
                            <div className="sm:block hidden text-center w-full lg:pl-3 ">
                                <h2>Daftar presensi pulang siswa</h2>
                                <p className="text-2xl font-bold text-black-alpha-90">
                                    Waktu presensi:  <br /> {exitStartTime ? exitStartTime.toLocaleTimeString('id-ID') : "Loading..."} - {exitEndTime ? exitEndTime.toLocaleTimeString('id-ID') : "Loading..."}
                                </p>
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
                            <h4>Daftar presensi pulang siswa</h4>
                            <p className="text-base text-secondary">Waktu presensi: <br /> {exitStartTime ? exitStartTime.toLocaleTimeString('id-ID') : "Loading..."} - {exitEndTime ? exitEndTime.toLocaleTimeString('id-ID') : "Loading..."}</p>
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
                                    attendanceData.map((attendance: any, index: number) => {
                                        const checkOutTime = attendance.check_out_time;
                                        const statusColor = checkOutTime ? 'green' : 'yellow';

                                        return (
                                            <li
                                                key={index}
                                                className={`flex justify-content-between bg-${statusColor}-100 align-items-center border-1 p-3 text-base md:text-2xl surface-border text-left`}
                                            >
                                                <div>
                                                    <span className="font-bold">{index + 1}. </span>
                                                    <span className="font-bold">{attendance.student.student_name}</span>
                                                </div>
                                                <span>{formatTime(checkOutTime)}</span>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="py-1 text-center text-xl text-secondary">Belum ada yang presensi</li>
                                )}
                            </ul>
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    };


    return (
        <div className='flex flex-column align-items-center'>
            <Helmet>
                <title>{school ? school.name : "Presentia"}</title>
            </Helmet>
            <div className='flex h-8rem justify-content-between w-full px-4 gap-1'>
                <div className='my-auto flex'>
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-plain"
                        onClick={() => school && navigate(`/school/${formatSchoolName(school.name)}/dashboard`)}
                        aria-label="Back"
                    />
                    <div className='my-auto'>
                        {school ? (school.name ? "Kembali ke Dashboard" : "Loading...") : "Loading..."}
                    </div>
                </div>

                <div className='my-auto text-center flex gap-3'>
                    <img
                        src={logo}
                        alt="Logo Sekolah"
                        className='w-4rem h-4rem '
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <div className=' text-lg md:text-6xl font-bold text-black-alpha-90 my-auto hidden md:block'>{school ? school.name : "Loading..."}</div>
                </div>
                <div className='my-auto'>
                    <div className='flex justify-content-center gap-2 align-content-end'>
                        <Tag
                            value={countdown.toString()}
                            severity="info"
                            className={`w-3rem text-xl cursor-pointer transition-all ${pauseCountdown ? 'opacity-50' : ''}`}
                            id="countdown-tooltip"
                            data-pr-tooltip={`Klik untuk ${pauseCountdown ? "Mengaktifkan" : "Menonaktifkan"} Countdown`}
                            rounded
                            style={{
                                border: '1px solid var(--blue-500)',
                                backgroundColor: pauseCountdown ? 'var(--gray-300)' : 'transparent',
                                color: pauseCountdown ? 'var(--gray-600)' : 'var(--blue-500)'
                            }}
                            onClick={() => setPauseCountdown(!pauseCountdown)}
                        />

                        <Button
                            label="Refresh"
                            icon="pi pi-refresh"
                            className="p-button p-button-primary"
                            onClick={() => handleRefresh()}
                            loading={loading}
                        />
                        <Tooltip target="#countdown-tooltip" position="left" />
                    </div>
                </div>
            </div>
            <div className='flex flex-column gap-2'>
                <div className="flex">
                    <div className="w-full">
                        <Button
                            label="Ganti Otomatis"
                            onClick={() => { setAutoSwitch(!autoSwitch); window.location.reload(); }}
                            id="auto-switch-tooltip"
                            data-pr-tooltip={`Otomatis ganti daftar kehadiran jika dinyalakan`}
                            className={autoSwitch ? "p-button-primary w-full pl-7" : "p-button-secondary w-full  pl-7"}
                            outlined
                        >
                            <InputSwitch
                                checked={autoSwitch}
                                className={autoSwitch ? "p-focus" : "p-button-secondary"}
                            />
                        </Button>
                        <Tooltip target="#auto-switch-tooltip" position="left" />
                    </div>
                </div>
                <TabMenu
                    model={items}
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                />
            </div>
            <div className="w-full flex justify-content-center">{renderContent()}</div>
        </div>

    );
};

export default SchoolStudentAttendanceListPage;
