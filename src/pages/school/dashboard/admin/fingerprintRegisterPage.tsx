/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { loginToADMSJS, enrollFingerprint, getFingerprintData } from '../../../../services/admsjsService';
import { useAuth } from '../../../../context/AuthContext';
import studentService from '../../../../services/studentService';
import { Password } from 'primereact/password';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import classGroupService from '../../../../services/classGroupService';
import attendanceSourceConnectionService, { EnrollConnectionPayload } from '../../../../services/attendanceSourceConnectionService';

const FingerprintPage = () => {
    const { user, checkAuth } = useAuth();
    const toast = useRef<Toast>(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStudentTable, setLoadingStudentTable] = useState(true);
    const [loadingStudentDropdown, setLoadingStudentDropdown] = useState(false);
    const [loadingKelas, setLoadingKelas] = useState(true);

    const [studentsDropdown, setStudentsDropdown] = useState<any[]>([]);
    const [studentsTableData, setStudentsTableData] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedClassTable, setSelectedClassTable] = useState<string | null>(null);
    const [selectedStudentFingerprint, setSelectedStudentFingerprint] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFingerprintStatus, setSelectedFingerprintStatus] = useState<string | null>(null);
    const [listKelas, setListKelas] = useState([]);


    const fingerprintStatusOptions = [
        { label: 'Semua', value: null },
        { label: 'Sudah Terdaftar', value: 'registered' },
        { label: 'Belum Terdaftar', value: 'notRegistered' }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);

    const [searchStudentDropdown, setSearchStudentDropdown] = useState("");
    const [searchStudentTable, setSearchStudentTable] = useState("");
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [selectedFinger, setSelectedFinger] = useState<number>(7);
    const retryCount = 2;
    const [machineNumber, setMachineNumber] = useState<string>('');
    const [registerLoading, setRegisterLoading] = useState(false);

    const msgs = useRef<Messages>(null);
    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'warn',
            detail: 'Hubungi Admin jika membutuhkan akun pendaftaran sidik jari.',
            closable: false,
        });
    });

    const fingerList = [
        { label: 'Kelingking Kiri', value: 1 },
        { label: 'Jari Manis Kiri', value: 2 },
        { label: 'Jari Tengah Kiri', value: 3 },
        { label: 'Telunjuk Kiri', value: 4 },
        { label: 'Jempol Kiri', value: 5 },
        { label: 'Jempol Kanan', value: 6 },
        { label: 'Telunjuk Kanan', value: 7 },
        { label: 'Jari Tengah Kanan', value: 8 },
        { label: 'Jari Manis Kanan', value: 9 },
        { label: 'Kelingking Kanan', value: 10 }
    ];

    const fingerOptions = [
        // { label: 'Kelingking Kiri', value: 1 },
        // { label: 'Jari Manis Kiri', value: 2 },
        // { label: 'Jari Tengah Kiri', value: 3 },
        { label: 'Telunjuk Kiri', value: 4 },
        { label: 'Jempol Kiri', value: 5 },
        { label: 'Jempol Kanan', value: 6 },
        { label: 'Telunjuk Kanan', value: 7 },
        // { label: 'Jari Tengah Kanan', value: 8 },
        // { label: 'Jari Manis Kanan', value: 9 },
        // { label: 'Kelingking Kanan', value: 10 }
    ];

    // useEffect(() => {
    //     const token = localStorage.getItem('admsjs_token');
    //     if (!token || token === 'undefined') {
    //         setIsLoggedIn(false);
    //     } else {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

    useEffect(() => {
        // const validateAuth = async () => {
        //     const isAuthenticated = await checkAuth();
        //     if (!isAuthenticated.success) {
        //         handleLogout();
        //     }
        // };

        // validateAuth();

        if (user) {
            fetchKelas();
            fetchStudentsWithFingerprintData(1, 20, undefined, undefined, 'table');
        }
    }, []);

    // useEffect(() => {
    //     let filtered = studentsTableData;

    //     switch (selectedFingerprintStatus) {
    //         case 'registered':
    //             filtered = filtered.filter(student =>
    //                 fingerprintData.some(fp => fp.pin === student.id.toString())
    //             );
    //             break;
    //         case 'notRegistered':
    //             filtered = filtered.filter(student =>
    //                 !fingerprintData.some(fp => fp.pin === student.id.toString())
    //             );
    //             break;
    //         default:
    //             break;
    //     }

    //     setStudentsTableDataFiltered(filtered);
    // }, []);


    const fetchStudentsWithFingerprintData = async (
        page = 1,
        perPage = 20,
        classGroupId?: number | string,
        search?: string,
        type: 'dropdown' | 'table' = 'table'
    ) => {
        if (!user?.school_id) return;

        const filter: Record<string, any> = {
            school_id: user.school_id,
        };

        if (classGroupId) {
            filter.class_group_id = classGroupId;
        }

        if (search) {
            filter.student_name = search;
        }

        if (type === 'table') {
            try {
                setLoadingStudentTable(true);
                setStudentsTableData([]);

                const response = await attendanceSourceConnectionService.getAllData({
                    page,
                    perPage,
                    filter,
                });

                const result = response?.data?.data ?? [];
                setStudentsTableData(result);
                setTotalRecords(response?.data?.total ?? 0);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal Memuat Data',
                    detail: 'Tidak dapat memuat data siswa & fingerprint.',
                    life: 3000,
                });
            } finally {
                setLoadingStudentTable(false);
            }

        } else if (type === 'dropdown') {
            setStudentsDropdown([]);

            if (!classGroupId && (!search || search.trim().length < 2)) return;

            try {
                setLoadingStudentDropdown(true);

                const response = await attendanceSourceConnectionService.getAllData({
                    page: 1,
                    perPage: 1000,
                    filter,
                });

                const result = response?.data?.data ?? [];
                setStudentsDropdown(result);
            } catch (error) {
                console.error("Error fetching studentsDropdown:", error);
            } finally {
                setLoadingStudentDropdown(false);
            }
        }
    };



    const getFingerprintStatus = (student: any) => {
        return student.has_credential ? 'registered' : 'notRegistered';
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchStudentDropdown(query);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (query.length >= 2 || selectedClass) {
            typingTimeoutRef.current = setTimeout(() => {
                fetchStudentsWithFingerprintData(1, 1000, selectedClass ?? undefined, query, 'dropdown');
            }, 500);
        } else {
            setStudentsDropdown([]);
        }
    };


    // const handleLogin = async () => {
    //     setLoading(true);
    //     try {
    //         const token = await loginToADMSJS(username, password);
    //         setIsLoggedIn(true);
    //         localStorage.setItem('admsjs_token', token);
    //         fetchKelas();
    //         fetchFingerprintData();
    //         fetchStudentsTable();
    //         toast.current?.show({ severity: 'success', summary: 'Login Berhasil', detail: 'Anda berhasil login.', life: 3000 });
    //     } catch (error) {
    //         toast.current?.show({ severity: 'error', summary: 'Login Gagal', detail: 'Periksa kembali kredensial Anda.', life: 3000 });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleLogout = async () => {
    //     setLoading(true);
    //     try {
    //         setIsLoggedIn(false);
    //         localStorage.removeItem('admsjs_token');
    //         toast.current?.show({ severity: 'success', summary: 'Logout Berhasil', detail: 'Anda berhasil logout.', life: 3000 });
    //     } catch (error) {
    //         toast.current?.show({ severity: 'error', summary: 'Logout Gagal', detail: 'Periksa kembali kredensial Anda.', life: 3000 });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleRegister = async () => {
        if (!selectedStudent || !machineNumber || !selectedFinger) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Data Tidak Lengkap',
                detail: 'Pilih siswa, sidik jari, dan masukkan nomor mesin.',
                life: 3000
            });
            return;
        }

        setRegisterLoading(true);
        try {
            const payload: EnrollConnectionPayload = {
                student_id: String(selectedStudent.id),
                finger_id: String(selectedFinger),
                retry: retryCount,
                machine_number: machineNumber,
                overwrite: true,
            };


            await attendanceSourceConnectionService.enroll(payload);

            toast.current?.show({
                severity: 'success',
                summary: 'Pendaftaran Berhasil',
                detail: 'Segera daftarkan sidik jari pada mesin.',
                life: 8000
            });
        } catch (error) {
            if ((error as any).response?.data?.message === "Failed to authenticate token") {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Unauthenticated',
                    detail: 'Sesi login Anda telah berakhir. Memuat ulang...',
                    life: 3000
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Pendaftaran Gagal',
                    detail: 'Gagal mendaftarkan sidik jari.',
                    life: 3000
                });
            }
        } finally {
            setRegisterLoading(false);
        }
    };



    const actionBodyTemplate = (rowData: any) => {
        return (
            <Button
                label="Lihat Sidik Jari"
                icon="pi pi-eye"
                className="p-button-text"
                onClick={() => {
                    setSelectedStudentFingerprint(rowData);
                    setModalVisible(true);
                }}
            />
        );
    };


    const studentItemTemplate = (option: any) => {
        const isRegistered = option.has_credential;
        return (
            <div className="flex align-items-center justify-content-between">
                <span>
                    {option.student_name?.toUpperCase()} - {option.class_group?.class_name || 'Tanpa Kelas'} - {option.id}
                </span>
                {isRegistered && <i className="ml-2 pi pi-check text-green-500"></i>}
            </div>
        );
    };

    const fetchKelas = async () => {
        try {
            if (!user?.school_id) return;
            setLoadingKelas(true);
            const response = await classGroupService.getClassGroups(1, 100, {}, user?.school_id);
            setListKelas(response.responseData.data.data.map((kelas: { id: number; class_name: string }) => ({
                label: kelas.class_name,
                value: kelas.id
            })));

        } catch (error) {
            console.error('Error fetching studentsDropdown:', error);
        } finally {
            setLoadingKelas(false);
        }
    };

    const [filters, setFilters] = useState({
        student_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'class_group.class_name': { value: null, matchMode: FilterMatchMode.EQUALS },
        fingerprint_status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const classBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.class_group.class_name} />;
    };


    const classRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={listKelas}
                onChange={(e: DropdownChangeEvent) => {
                    options.filterApplyCallback(e.value);
                    setCurrentPage(1);
                    setSelectedClassTable(e.value);
                    fetchStudentsWithFingerprintData(currentPage, rowsPerPage, e.value, searchStudentTable)
                }}
                optionLabel="label"
                placeholder="Pilih Kelas"
                className="p-column-filter"
                showClear
                style={{ minWidth: '12rem' }}
            />
        );
    };

    const fingerprintFilterTemplate = (options: any) => {
        return (
            <Dropdown
                value={options.value}
                options={fingerprintStatusOptions}
                onChange={(e) => {
                    setSelectedFingerprintStatus(e.value);
                    options.filterApplyCallback(e.value);
                }}
                placeholder={
                    fingerprintStatusOptions.find(option => option.value === selectedFingerprintStatus)?.label || 'Semua'
                }
                className="p-column-filter"
                showClear
            />
        );
    };

    const fingerprintBodyTemplate = (rowData: any) => {
        const status = getFingerprintStatus(rowData);
        return (
            <Tag severity={status === 'registered' ? 'success' : 'danger'}>
                {status === 'registered' ? 'Terdaftar' : 'Belum Terdaftar'}
            </Tag>
        );
    };

    const handleSearchFilterTable = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <InputText
                value={options.value || ""}
                onChange={(e) => {
                    const query = e.target.value;
                    options.filterApplyCallback(query);

                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    typingTimeoutRef.current = setTimeout(() => {
                        setCurrentPage(1);
                        fetchStudentsWithFingerprintData(1, rowsPerPage, selectedClassTable ?? undefined, query);
                    }, 500);

                    setSearchStudentTable(query);
                }}
                placeholder="Cari Nama Siswa"
                className="p-column-filter"
            />
        );
    };


    return (
        <>
            <div title="" className="card p-4">
                <Toast ref={toast} />

                <div className="p-fluid grid">
                    <div className="field col-12 ">
                        <label>Pilih Kelas</label>
                        <Dropdown
                            loading={loadingKelas}
                            value={selectedClass}
                            options={listKelas}
                            onChange={(e) => {
                                setSelectedClass(e.value);
                                fetchStudentsWithFingerprintData(1, 1000, e.value, searchStudentDropdown, 'dropdown');
                            }}
                            placeholder={loadingKelas ? "Sedang memuat data kelas..." : "Pilih Kelas"}
                            optionLabel="label"
                            showClear
                            filter
                        />
                    </div>
                    <div className="field col-12">
                        <label>Cari Siswa <span className="text-red-600">*</span></label>
                        <InputText
                            value={searchStudentDropdown}
                            onChange={handleSearchChange}
                            placeholder="Ketik minimal 2 huruf nama siswa untuk mencari siswa..."
                        />
                    </div>
                    <div className="field col-12 ">
                        <label>Pilih Siswa <span className="text-red-600">*</span></label>
                        <Dropdown
                            value={selectedStudent}
                            options={studentsDropdown}
                            onChange={(e) => setSelectedStudent(e.value)}
                            optionLabel="student_name"
                            placeholder={loadingStudentDropdown ? "Sedang mencari siswa..." : "Pilih siswa"}
                            loading={loadingStudentDropdown}
                            itemTemplate={studentItemTemplate}
                            emptyMessage={searchStudentDropdown ? `Tidak ada siswa dengan nama ${searchStudentDropdown}` : "Ketik nama siswa di kolom cari siswa"}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label>Pilih Jari <span className='text-red-600'>*</span></label>
                        <Dropdown
                            value={selectedFinger}
                            options={fingerOptions}
                            onChange={(e) => setSelectedFinger(e.value)}
                            optionLabel="label"
                            placeholder="Pilih Jari"
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Nomor Mesin <span className='text-red-600'>*</span></label>
                        <InputText
                            value={machineNumber}
                            onChange={(e) => setMachineNumber((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div className="col-12 text-center">
                        <Button
                            label="Daftarkan Sidik Jari"
                            onClick={handleRegister}
                            loading={registerLoading}
                            className="p-button-success"
                        />
                    </div>
                </div>

            </div>

            <div className='card'>
                <DataTable value={studentsTableData}
                    dataKey="id" className="mt-4"
                    filters={filters}
                    filterDisplay="row"
                    header={
                        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 className="m-0">Daftar Sidik Jari Siswa</h5>
                            <span className="text-sm text-secondary">Total Siswa: {totalRecords}</span>
                        </div>
                    }
                    emptyMessage={
                        loadingStudentTable ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data siswa...</span>
                            </div>
                        ) : Object.values(filters).some((filter) => filter.value !== null && filter.value !== undefined) ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-filter-slash text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Tidak ada siswa yang sesuai dengan pencarian Anda</span>
                            </div>
                        ) : (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Belum ada data siswa</span>
                                <small className="text-gray-400">Silakan tambahkan siswa melalui tombol siswa baru atau import.</small>
                            </div>
                        )
                    }
                    paginator
                    lazy
                    first={(currentPage - 1) * rowsPerPage}
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    onPage={(event) => {
                        const page = (event.page ?? 0) + 1;
                        setCurrentPage(page);
                        setRowsPerPage(event.rows);
                        fetchStudentsWithFingerprintData(page, event.rows, selectedClassTable ?? undefined, searchStudentTable);
                    }}

                    rowsPerPageOptions={[10, 20, 50, 100]}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} siswa"
                    stripedRows
                >
                    <Column
                        field="student_name"
                        header="Nama Siswa"
                        sortable
                        filter
                        filterPlaceholder="Cari Nama Siswa"
                        filterElement={handleSearchFilterTable}
                        showFilterMenu={false}
                    />
                    <Column field="class_group.class_name" header="Kelas" showFilterMenu={false} sortable body={classBodyTemplate} filter filterElement={classRowFilterTemplate}></Column>
                    <Column
                        header="Status Sidik Jari"
                        body={fingerprintBodyTemplate}
                        filter
                        filterElement={fingerprintFilterTemplate}
                        showFilterMenu={false}
                    />
                    <Column header="Aksi" body={actionBodyTemplate}></Column>
                </DataTable>
                <Dialog
                    visible={modalVisible}
                    header="Daftar Sidik Jari"
                    className=""
                    modal
                    onHide={() => setModalVisible(false)}
                >
                    <div style={{ padding: '20px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{selectedStudentFingerprint?.student_name}</h3>
                        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                            <strong>Kelas:</strong> {selectedStudentFingerprint?.class_group?.class_name}
                        </p>
                        <div style={{ fontWeight: '600', marginBottom: '15px' }}>Daftar Sidik Jari:</div>
                        {selectedStudentFingerprint?.credential_ids?.length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                {selectedStudentFingerprint.credential_ids.map((fid: any, index: number) => {
                                    const fingerLabel = fingerList.find(option => option.value === parseInt(fid))?.label || `Finger ID ${fid}`;
                                    return (
                                        <li
                                            key={index}
                                            className="bg-green-100 border-green-500 border-1"
                                            style={{
                                                padding: '8px',
                                                borderRadius: '5px',
                                                marginBottom: '8px',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <i className="pi pi-check-circle" style={{ marginRight: '10px', color: '#0077b6' }}></i>
                                            {fingerLabel}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div
                                style={{
                                    backgroundColor: '#e0f7fa',
                                    border: '1px solid #0077b6',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    color: '#0077b6',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <i className="pi pi-info-circle" style={{ marginRight: '10px' }}></i>
                                Belum ada sidik jari
                            </div>
                        )}
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default FingerprintPage;
