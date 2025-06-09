/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import defaultLogoSekolah from "../../assets/defaultLogoSekolah.png";
import AttendanceService from '../../services/attendanceService';
import { Helmet } from 'react-helmet';
import { formatSchoolName } from '../../utils/formatSchoolName';
import { TabMenu } from 'primereact/tabmenu';
import { formatTime } from '../../utils/formatTime';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import schoolService from '../../services/schoolService';
import { Calendar, CalendarProps } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { addHours } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { absencePermitTypeService } from '../../services/absencePermitService';
import checkInStatusService from '../../services/checkInStatusService';
import classGroupService from '../../services/classGroupService';
import { Toast } from 'primereact/toast';

const countdownTime = 15;

const PublicAttendancePage = () => {
    const navigate = useNavigate();
    const { schoolId } = useParams();
    const [autoSwitch] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem("autoSwitch") || "true");
    });
    const [pauseCountdown, setPauseCountdown] = useState<boolean>(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(countdownTime);
    const [currentTime, setCurrentTime] = useState(new Date());
    const formattedDate = currentTime.toLocaleDateString('id-ID');
    const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour12: false });
    const [entryStartTime, setEntryStartTime] = useState<Date | null>(null);
    const [entryEndTime, setEntryEndTime] = useState<Date | null>(null);
    const [exitStartTime, setExitStartTime] = useState<Date | null>(null);
    const [exitEndTime, setExitEndTime] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const [listKelas, setListKelas] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(true);
    const [loadingStatusPresensi, setLoadingStatusPresensi] = useState(true);
    const [listStatusPresensi, setListStatusPresensi] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState<number[]>([]);
    const [selectedStatusPresensi, setSelectedStatusPresensi] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [searchName, setSearchName] = useState('');
    const [debouncedSearchName, setDebouncedSearchName] = useState('');
    const [debouncedSelectedKelas, setDebouncedSelectedKelas] = useState<number[]>([]);
    const [loadingStatusAbsensi, setLoadingStatusAbsensi] = useState(true);
    const [listStatusAbsensi, setListStatusAbsensi] = useState<{ label: string; value: number }[]>([]);
    const isFirstLoad = useRef(true);
    const isFilterChanging = useRef(false);



    const [school, setSchool] = useState<any>(null);
    const [schoolLoading, setSchoolLoading] = useState(true);

    const fetchSchool = async (id: string | undefined) => {
        if (!id) return;
        setSchoolLoading(true);
        try {
            const response = await schoolService.getById(parseInt(id));
            setSchool(response.data);
        } catch (error) {
            console.error("Failed to load school", error);
            navigate('/404');
        } finally {
            setSchoolLoading(false);
        }
    };


    const handleStartDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setStartDate(localDate);

            if (endDate && localDate > endDate) {
                setEndDate(localDate);
            }
        }
    };

    const handleEndDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setEndDate(localDate);
        }
    };


    const handleRefresh = async () => {
        fetchAttendance(currentPage, rowsPerPage);
    };

    const fetchAttendance = async (page = 1, perPage = 20) => {
        if (!schoolId || !startDate || !endDate) return;

        try {
            setLoading(true);

            const params: any = {
                page,
                perPage,
                school_id: schoolId,
                simplify: "1",
                filter: {}
            };

            if (startDate) {
                params.startDate = startDate.toISOString().slice(0, 10);
            }
            if (endDate) {
                params.endDate = endDate.toISOString().slice(0, 10);
            }

            if (debouncedSelectedKelas.length > 0) {
                params.classGroup = debouncedSelectedKelas.join(',');
            }


            if (selectedStatusPresensi.length > 0) {
                params.filter.check_in_status_id = selectedStatusPresensi.join(',');
            }

            if (debouncedSearchName.trim()) {
                params.filter['student.student_name'] = debouncedSearchName;
            }

            const response: any = await AttendanceService.getAttendances(params);

            const total = response.data.total;
            const startNumber = total - (page - 1) * perPage;

            const formattedData = response.data.data.map((item: any, index: number) => ({
                ...item,
                indexNumber: startNumber - index
            }));

            setAttendanceData(formattedData);
            setTotalRecords(total);
        } catch (error: any) {
            console.error("Error fetching attendance data", error);
        } finally {
            setCountdown(countdownTime);
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchName]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSelectedKelas(selectedKelas);
        }, 500);

        return () => clearTimeout(timeout);
    }, [selectedKelas]);


    useEffect(() => {
        fetchKelas();
        // fetchStatusPresensi();
        // fetchStatusAbsensi();
    }, []);

    useEffect(() => {
        fetchSchool(schoolId);
    }, [schoolId]);

    useEffect(() => {
        isFilterChanging.current = true;
        setCurrentPage(1);
    }, [debouncedSearchName, debouncedSelectedKelas, selectedStatusPresensi, startDate, endDate]);


    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }

        if (isFilterChanging.current && currentPage !== 1) {
            return;
        }

        fetchAttendance(currentPage, rowsPerPage);

        isFilterChanging.current = false;
    }, [
        debouncedSearchName,
        debouncedSelectedKelas,
        selectedStatusPresensi,
        startDate,
        endDate,
        currentPage,
        rowsPerPage
    ]);

    useEffect(() => {
        localStorage.setItem("autoSwitch", JSON.stringify(autoSwitch));
    }, [autoSwitch]);

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


    const fetchKelas = async () => {
        try {
            setLoadingKelas(true);
            if (!schoolId) return;
            const response = await classGroupService.getClassGroups(1, 100, {}, Number(schoolId));
            setListKelas(response.responseData.data.data.map((kelas: { id: number; class_name: string }) => ({
                label: kelas.class_name,
                value: kelas.id
            })));

        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoadingKelas(false);
        }
    };

    // const fetchStatusPresensi = async () => {
    //     try {
    //         setLoadingStatusPresensi(true);
    //         const { responseData } = await checkInStatusService.getAll(1, 100);
    //         setListStatusPresensi(responseData.data.data.map((status: { id: number; status_name: string, late_duration: number }) => ({
    //             label: status.status_name,
    //             late_duration: status.late_duration,
    //             value: status.id
    //         })));
    //     } catch (error) {
    //         console.error('Error fetching check-in status:', error);
    //         setListStatusPresensi([]);
    //     } finally {
    //         setLoadingStatusPresensi(false);
    //     }
    // };


    // const fetchStatusAbsensi = async () => {
    //     try {
    //         setLoadingStatusAbsensi(true);
    //         const responseData = await absencePermitTypeService.getAll(1, 100);
    //         setListStatusAbsensi(responseData.data.data.map((permit: { id: number; permit_name: string }) => ({
    //             label: permit.permit_name,
    //             value: permit.id
    //         })));
    //     } catch (error) {
    //         console.error('Error fetching absence permit type', error);
    //         setListStatusAbsensi([]);
    //     } finally {
    //         setLoadingStatusAbsensi(false);
    //     }
    // };

    if (!school) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }

    const eventDetail = {
        isEvent: false,
        name: 'Pekan Kreativitas',
        startTime: '08:00',
        endTime: '12:00',
    };

    // const fetchLeaderboard = async () => {
    //     try {
    //         const response = await AttendanceService.getAttendances({
    //             type: "in",
    //             sortBy: "time",
    //             order: "asc",
    //             limit: 3
    //         });

    //         setTopThree(response.data.data);
    //     } catch (error) {
    //         console.error("Failed to fetch leaderboard", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchLeaderboard();
    // }, []);



    return (
        <div className='flex flex-column align-items-center'>
            <Toast ref={toast} />
            <Helmet>
                <title>{school ? school.name : "Presentia"}</title>
            </Helmet>
            <div className='flex h-8rem justify-content-between w-full px-4 gap-1'>
                <div className='my-auto flex'>
                    <Button
                        icon="pi pi-copy"
                        severity="secondary"
                        label="Salin Tautan Kehadiran"
                        tooltip="Tautan digunakan untuk membagikan halaman kehadiran"
                        onClick={() => {
                            const publicLink = `${window.location.origin}/kehadiran/${schoolId}`;
                            navigator.clipboard.writeText(publicLink).then(() => {
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Berhasil',
                                    detail: 'Tautan kehadiran berhasil disalin!',
                                    life: 3000
                                });
                            }).catch(() => {
                                toast.current?.show({
                                    severity: 'error',
                                    summary: 'Gagal',
                                    detail: 'Gagal menyalin tautan.',
                                    life: 3000
                                });
                            });
                        }}
                    />
                </div>

                <div className='my-auto text-center flex gap-3'>
                    <img
                        loading="lazy" src={school?.logoImagePath || defaultLogoSekolah}
                        alt="Logo Sekolah"
                        className='w-4rem h-4rem '
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultLogoSekolah;
                        }}
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
            <div className="w-full flex justify-content-center">        <Card className="text-center shadow-1 col-12 py-0 w-10 overflow-auto mb-4">
                <div className="flex justify-content-between align-items-center mb-4 gap-2 white-space-nowrap">
                    <div>
                        <h5>{formattedDate}</h5>
                        <p>{formattedTime}</p>
                    </div>
                    <div className="sm:block hidden text-center w-full lg:pl-3 ">
                        <h2>Daftar presensi masuk siswa</h2>
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
                <div>
                    <div className="grid mt-4">
                        <div className="col-12 md:col-6 xl:col-3">
                            <h5>Pilih Tanggal Kehadiran <span className="text-red-600">*</span></h5>
                            <div className="flex gap-2">
                                <div>
                                    <Calendar
                                        id="startDate"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        maxDate={endDate ?? undefined}
                                        readOnlyInput
                                        className="w-full"
                                        placeholder="Tanggal Awal"
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                                <div className="my-auto">
                                    -
                                </div>
                                <div>
                                    <Calendar
                                        id="endDate"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        minDate={startDate ?? undefined}
                                        readOnlyInput
                                        className="w-full"
                                        placeholder="Tanggal Akhir"
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3">
                            <h5>Pilih Kelas</h5>
                            <MultiSelect filter placeholder="Silahkan Pilih Kelas" showClear loading={loadingKelas} value={selectedKelas} options={listKelas} onChange={(e) => {
                                setSelectedKelas(e.value);
                            }} optionLabel="label" className="w-full" />
                        </div>
                        <div className="col-12 md:col-6 xl:col-3">
                            <h5>Cari Nama Siswa</h5>
                            <InputText
                                className="w-full"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Contoh: Budi, Sari, dll"
                            />
                        </div>
                        <div className="col-12 md:col-6 xl:col-3">
                            <h5>Pilih Status Presensi</h5>
                            <MultiSelect filter placeholder="Silahkan Pilih Status Presensi" showClear loading={loadingStatusPresensi} value={selectedStatusPresensi} options={listStatusPresensi} onChange={(e) => {
                                setSelectedStatusPresensi(e.value);
                            }} optionLabel="label" className="w-full " />
                        </div>
                    </div>
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
                            if (loading) return;
                            setCurrentPage((event.page ?? 0) + 1);
                            setRowsPerPage(event.rows);
                        }}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        showGridlines
                        stripedRows
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} siswa">
                        <Column field="indexNumber" header="Nomor" style={{ width: "1%" }}
                            body={(rowData) => loading ? <Skeleton width="20px" /> : rowData.indexNumber}
                        />
                        <Column field="student.student_name" header="Nama"
                            className="text-lg"
                            headerStyle={{ width: "40%", minWidth: "200px" }}
                            bodyStyle={{ width: "40%", minWidth: "200px" }}
                            body={(rowData) => loading ? <Skeleton width="80%" /> : rowData.student?.student_name?.toUpperCase()}
                        />
                        <Column field="student.class_group.class_name" header="Kelas"
                            className="text-lg"
                            headerStyle={{ width: "10%", minWidth: "60px" }}
                            bodyStyle={{ width: "10%", minWidth: "60px" }}
                            body={(rowData) => loading ? <Skeleton width="80%" /> : rowData.student?.class_group.class_name?.toUpperCase()}
                        />
                        <Column
                            field="check_in_time"
                            header="Tanggal"
                            headerStyle={{ width: "10%", minWidth: "60px" }}
                            bodyStyle={{ width: "10%", minWidth: "60px" }}
                            className='text-lg'
                            body={(rowData) => loading ? <Skeleton width="100px" /> :
                                rowData.attendance_window.date ? rowData.attendance_window.date : "-"
                            }
                        />
                        <Column field="check_in_time" header="Waktu Masuk"
                            className="text-lg"
                            headerStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            bodyStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            body={(rowData) => loading ? <Skeleton width="50px" /> : formatTime(rowData.check_in_time)}
                        />
                        <Column field="check_out_time" header="Waktu Pulang"
                            className="text-lg"
                            headerStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            bodyStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            body={(rowData) => loading ? <Skeleton width="50px" /> : formatTime(rowData.check_out_time)}
                        />
                        <Column field="check_in_status.status_name" header="Keterangan"
                            className="text-lg"
                            headerStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            bodyStyle={{ width: "5%", whiteSpace: "nowrap" }}
                            body={(rowData) => loading ? <Skeleton width="60px" /> : rowData.check_in_status?.status_name}
                        />
                    </DataTable>
                </div>
            </Card ></div>
        </div>

    );
};

export default PublicAttendancePage;
