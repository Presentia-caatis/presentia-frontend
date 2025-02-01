/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { loginToADMSJS, enrollFingerprint, getFingerprintData, logoutADMSJS } from '../../../../services/admsjsService';
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

const FingerprintPage = () => {
    const { user, checkAuth } = useAuth();
    const toast = useRef<Toast>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('admsjs_token'));

    const [fingerprintData, setFingerprintData] = useState<{
        fid: number; pin: string
    }[]>([]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(true);

    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [filteredStudentsTable, setFilteredStudentsTable] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedClassTable, setSelectedClassTable] = useState<string | null>(null);
    const [selectedStudentFingerprint, setSelectedStudentFingerprint] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFingerprintStatus, setSelectedFingerprintStatus] = useState<string | null>(null);

    const fingerprintStatusOptions = [
        { label: 'Semua', value: null },
        { label: 'Sudah Terdaftar', value: 'registered' },
        { label: 'Belum Terdaftar', value: 'notRegistered' }
    ];


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
            detail: 'Hubungin admin jika lupa dengan akun untuk mendaftarkan sidik jari.',
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

    useEffect(() => {
        const token = localStorage.getItem('admsjs_token');
        if (!token || token === 'undefined') {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const validateAuth = async () => {
            console.log("tes");
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                handleLogout();
            }
        };

        validateAuth();
    }, []);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchStudents();
            fetchFingerprintData();
        }
    }, [isLoggedIn, user]);

    const fetchFingerprintData = async () => {
        try {
            const response = await getFingerprintData();
            setFingerprintData(response.data);
        } catch (error) {
            if ((error as any).response?.data?.message === "Failed to authenticate token") {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Unauthenticated',
                    detail: 'Sesi login Anda telah berakhir. Memuat ulang...',
                    life: 3000
                });

                localStorage.removeItem('admsjs_token');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Data fingerprint gagal dimuat',
                    detail: 'Gagal mendapatkan data fingerprint.',
                    life: 3000
                });
            }
        }
    };

    const getFingerprintStatus = (studentId: any) => {
        return fingerprintData.some(fp => fp.pin === studentId.toString()) ? 'registered' : 'notRegistered';
    };

    useEffect(() => {
        if (selectedClass) {
            setFilteredStudents(
                students.filter(student => student.class_group?.class_name === selectedClass)
            );
        } else {
            setFilteredStudents(students);
        }
    }, [selectedClass, students]);

    useEffect(() => {
        let filtered = students;

        if (selectedClassTable) {
            filtered = filtered.filter(student => student.class_group?.class_name === selectedClassTable);
        }

        switch (selectedFingerprintStatus) {
            case 'registered':
                filtered = filtered.filter(student =>
                    fingerprintData.some(fp => fp.pin === student.id.toString())
                );
                break;
            case 'notRegistered':
                filtered = filtered.filter(student =>
                    !fingerprintData.some(fp => fp.pin === student.id.toString())
                );
                break;
            default:
                break;
        }

        setFilteredStudentsTable(filtered);
    }, [selectedClassTable, selectedFingerprintStatus, students, fingerprintData]);


    const fetchStudents = async () => {
        try {
            if (!user?.school_id) return;
            const data = await studentService.getStudent();
            setStudents(data.data);
            setFilteredStudents(data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoadingTable(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const token = await loginToADMSJS(username, password);
            setIsLoggedIn(true);
            localStorage.setItem('admsjs_token', token);
            toast.current?.show({ severity: 'success', summary: 'Login Berhasil', detail: 'Anda berhasil login.', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Login Gagal', detail: 'Periksa kembali kredensial Anda.', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            setIsLoggedIn(false);
            localStorage.removeItem('admsjs_token');
            toast.current?.show({ severity: 'success', summary: 'Logout Berhasil', detail: 'Anda berhasil logout.', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Logout Gagal', detail: 'Periksa kembali kredensial Anda.', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!selectedStudent || !machineNumber) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Data Tidak Lengkap',
                detail: 'Pilih siswa dan masukkan nomor mesin.',
                life: 3000
            });
            return;
        }

        setRegisterLoading(true);
        try {
            const studentId = selectedStudent.id;
            await enrollFingerprint(studentId, selectedFinger, retryCount, machineNumber);
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

                localStorage.removeItem('admsjs_token');
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
        const isRegistered = fingerprintData.some(fp => fp.pin === option.id.toString());
        return (
            <div className="flex align-items-center justify-content-between">
                <span>
                    {option.student_name} - {option.class_group?.class_name || 'Tanpa Kelas'} - {option.id}
                </span>
                {isRegistered && <i className="ml-2 pi pi-check text-green-500"></i>}
            </div>
        );
    };

    const classOptions = Array.from(new Set(students.map(student => student.class_group?.class_name)))
        .map(className => ({ label: className, value: className }));


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
                options={classOptions}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
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
        const status = getFingerprintStatus(rowData.id);
        return (
            <Tag severity={status === 'registered' ? 'success' : 'danger'}>
                {status === 'registered' ? 'Terdaftar' : 'Belum Terdaftar'}
            </Tag>
        );
    };


    return (
        <>
            <div title="" className="card p-4">
                <Toast ref={toast} />
                <div className='flex flex-column md:flex-row justify-content-between w-full my-2'>
                    <div>
                        <h1>{!isLoggedIn ? "Login untuk mendaftaran Sidik Jari" : "Pendaftaran Sidik Jari"}</h1>
                    </div>
                    {isLoggedIn ?
                        <div>
                            <Button label="Logout" onClick={handleLogout} loading={loading} className="p-button-danger" />
                        </div>
                        : null
                    }
                </div>
                {!isLoggedIn ? <div> <Messages ref={msgs} /> </div> : ""}
                {!isLoggedIn ? (
                    <div className='w-full'>
                        <div className="flex flex-column gap-2 mb-4 w-17rem">
                            <label>Username</label>
                            <InputText value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="flex flex-column gap-2 mb-4">
                            <label>Password</label>
                            <Password className='' toggleMask feedback={false} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button label="Login" onClick={handleLogin} loading={loading} className="p-button-primary w-full" />
                    </div>
                ) : (
                    <div className="p-fluid grid">
                        <div className="field col-12 md:col-6">
                            <label>Pilih Kelas</label>
                            <Dropdown
                                value={selectedClass}
                                options={classOptions}
                                onChange={(e) => setSelectedClass(e.value)}
                                placeholder="Pilih Kelas"
                                showClear
                                filter
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label>Pilih Siswa <span className='text-red-600'>*</span></label>
                            <Dropdown
                                value={selectedStudent}
                                options={filteredStudents}
                                onChange={(e) => setSelectedStudent(e.value)}
                                optionLabel="student_name"
                                placeholder="Pilih Siswa"
                                filter
                                filterBy="student_name"
                                itemTemplate={studentItemTemplate}
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
                )}
            </div>

            {isLoggedIn ? <div className='card'>
                <DataTable value={filteredStudentsTable} paginator rows={10} dataKey="id" className="mt-4" filters={filters} filterDisplay="row" header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 className="m-0">Daftar Sidik Jari Siswa</h5>
                    </div>
                } rowsPerPageOptions={[10, 50, 75, 100]} emptyMessage={
                    loadingTable ? (
                        <div className="flex flex-column align-items-sm-start">
                            <div className="py-1 text-start text-sm text-secondary">Loading...</div>
                        </div>
                    ) : "Belum ada siswa"
                } tableStyle={{ minWidth: '50rem' }}>
                    <Column
                        field="student_name"
                        header="Nama Siswa"
                        sortable
                        filter
                        filterPlaceholder="Cari Nama Siswa"
                        filterField="student_name"
                        showFilterMenu={true}
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

                        {fingerprintData.filter((fp) => fp.pin === selectedStudentFingerprint?.id.toString()).length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                {fingerprintData
                                    .filter((fp) => fp.pin === selectedStudentFingerprint?.id.toString())
                                    .map((fp, index) => {
                                        const fingerLabel =
                                            fingerList.find((option) => option.value === fp.fid)?.label || "Unknown";
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
                                                <i
                                                    className="pi pi-check-circle"
                                                    style={{ marginRight: '10px', color: '#0077b6' }}
                                                ></i>
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


            </div> : ""}
        </>
    );
};

export default FingerprintPage;
