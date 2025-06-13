/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import defaultLogoSekolah from "../../assets/defaultLogoSekolah.png";
import AttendanceService from '../../services/attendanceService';
import { Helmet } from 'react-helmet';
import { formatDateWithDay, formatTime } from '../../utils/formatTime';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import schoolService from '../../services/schoolService';
import { Calendar, CalendarProps } from 'primereact/calendar';
import { addHours } from 'date-fns';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import studentService from '../../services/studentService';

const PublicAttendancePage = () => {
    const navigate = useNavigate();
    const { schoolId } = useParams();
    const toast = useRef<Toast>(null);
    const [attendanceData, setAttendanceData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);
    const [startDate, setStartDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [endDate, setEndDate] = useState<Date>(() => {
        return new Date();
    });

    const [selectedStudent, setSelectedStudent] = useState<any>({ value: '', label: '', full: null });
    const [studentOptions, setStudentOptions] = useState<any[]>([]);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [studentLoading, setStudentLoading] = useState(false);
    const [debouncedStudentSearchTerm, setDebouncedStudentSearchTerm] = useState('');
    const [sortField, setSortField] = useState<string>('attendanceWindow.date');
    const [sortOrder, setSortOrder] = useState<1 | -1>(-1);

    const [school, setSchool] = useState<any>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedStudentSearchTerm(studentSearchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [studentSearchTerm]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (debouncedStudentSearchTerm.length < 3) {
                setStudentOptions([]);
                return;
            }

            setStudentLoading(true);
            try {
                const response = await studentService.getStudent(1, 20, undefined, debouncedStudentSearchTerm, undefined, schoolId);
                const students = response.data.data;

                const options = students.map((student: any) => ({
                    label: `${student.student_name.toUpperCase()} (${student.nis})`,
                    value: student.id,
                    full: student
                }));

                setStudentOptions(options);

            } catch (error) {
                console.error('Error fetching student options', error);
            } finally {
                setStudentLoading(false);
            }
        };

        fetchStudents();
    }, [debouncedStudentSearchTerm]);



    const fetchSchool = async (id: string | undefined) => {
        if (!id) return;
        try {
            const response = await schoolService.getById(parseInt(id));
            setSchool(response.data);
        } catch (error) {
            console.error("Failed to load school", error);
            navigate('/404');
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



    const fetchAttendance = async (page = 1, perPage = 20) => {
        if (!schoolId || !startDate || !endDate || !selectedStudent.value) return;


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

            if (selectedStudent) {
                params.filter.student_id = selectedStudent.value;
            }

            params[`sort[${sortField}]`] = sortOrder === -1 ? 'desc' : 'asc';


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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchool(schoolId);
    }, [schoolId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [startDate, endDate, sortOrder, sortField, selectedStudent]);


    useEffect(() => {
        if (!selectedStudent) return;
        fetchAttendance(currentPage, rowsPerPage);
    }, [
        selectedStudent,
        startDate,
        endDate,
        currentPage,
        rowsPerPage,
        sortField,
        sortOrder
    ]);

    if (!school) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }



    return (
        <div className='flex flex-column align-items-center'>
            <Toast ref={toast} />
            <Helmet>
                <title>{school ? school.name : "Presentia"}</title>
            </Helmet>
            <div className='flex h-8rem justify-content-center md:justify-content-between w-full px-4 gap-1'>
                <div className='my-auto hidden md:flex'>
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
                        loading="lazy" src={school?.logo_image_path || defaultLogoSekolah}
                        alt="Logo Sekolah"
                        className='w-4rem h-4rem '
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultLogoSekolah;
                        }}
                    />
                    <div className=' text-lg md:text-6xl font-bold text-black-alpha-90 my-auto hidden md:block'>{school ? school.name : "Loading..."}</div>
                </div>
                <div className='my-auto hidden md:block w-17rem'>

                </div>
            </div>
            <div className="w-full flex justify-content-center">
                <Card className="text-center shadow-1 col-12 py-0 w-10 overflow-auto mb-4">
                    <div className="text-center w-full lg:pl-3 ">
                        <h2 className='font-bold'>DAFTAR PRESENSI SISWA</h2>
                    </div>

                    <div>
                        <div className="grid mt-4 ">
                            <div className="col-12 md:col-6">
                                <h5>Pilih Tanggal Kehadiran <span className="text-red-600">*</span></h5>
                                <div className="flex gap-2 justify-content-center">
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
                                {startDate && endDate && (
                                    <div className="text-xl font-semibold mb-3 text-center pt-4">
                                        Menampilkan kehadiran{" "}
                                        {startDate.toDateString() === endDate.toDateString() ? (
                                            <span className="text-primary">{formatDateWithDay(startDate)}</span>
                                        ) : (
                                            <>
                                                dari <span className="text-primary">{formatDateWithDay(startDate)}</span> sampai{" "}
                                                <span className="text-primary">{formatDateWithDay(endDate)}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="col-12 md:col-6">
                                <h5 className='white-space-nowrap'>Cari Nama Siswa (min. 3 huruf) <span className="text-red-600">*</span></h5>
                                <div className='flex flex-column justify-content-center'>
                                    <div>
                                        <InputText
                                            value={studentSearchTerm}
                                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                                            placeholder="Ketik nama siswa"
                                            className="w-full mb-2"
                                        />
                                    </div>
                                    <div>
                                        <Dropdown
                                            value={selectedStudent.value}
                                            onChange={(e) => {
                                                const selectedId = e.value;

                                                const selected = studentOptions.find(opt => opt.value === selectedId);

                                                if (selected) {
                                                    setSelectedStudent(selected);
                                                    console.log(selected);
                                                }
                                            }}
                                            options={studentOptions}
                                            optionLabel="label"
                                            placeholder={studentSearchTerm.length < 3 ? 'Ketik min. 3 huruf untuk cari siswa' : studentOptions.length === 0 ? 'Tidak ada hasil' : 'Pilih siswa'}
                                            showClear
                                            disabled={studentSearchTerm.length < 3 || studentOptions.length === 0}
                                            className="w-full"
                                            loading={studentLoading}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {selectedStudent.value && (
                        <div className="mt-3 text-center">
                            <h5 className="">Menampilkan presensi siswa:</h5>
                            <div className="mt-2">
                                <Tag
                                    value={`${selectedStudent.full?.student_name} (${selectedStudent.full?.nis}) - ${selectedStudent.full?.class_group?.class_name ?? ''}`}
                                    className="p-3 text-xl"
                                    icon="pi pi-user"
                                    severity="info"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-3 overflow-x-auto w-full">
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
                                    {!selectedStudent.value ? (
                                        <small className="text-center text-red-500 font-semibold">
                                            Silakan cari dan pilih siswa terlebih dahulu untuk menampilkan data kehadiran.
                                        </small>
                                    ) : <small className="text-center text-gray-500 font-semibold">
                                        Siswa yang dipilih tidak ada data kehadiran
                                    </small>}
                                </div>
                            )}
                            paginator
                            lazy
                            onSort={(e) => {
                                setSortField(e.sortField);
                                setSortOrder(e.sortOrder === 1 || e.sortOrder === -1 ? e.sortOrder : -1);
                            }}
                            sortField={sortField}
                            sortOrder={sortOrder}
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
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} kehadiran">
                            <Column
                                field="attendanceWindow.date"
                                header="Tanggal"
                                sortable
                                headerStyle={{ width: "20%", minWidth: "140px" }}
                                bodyStyle={{ width: "20%", minWidth: "140px" }}
                                className='text-lg'
                                body={(rowData) =>
                                    loading
                                        ? <Skeleton width="100px" />
                                        : rowData.attendance_window?.date
                                            ? formatDateWithDay(rowData.attendance_window.date)
                                            : "-"
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
