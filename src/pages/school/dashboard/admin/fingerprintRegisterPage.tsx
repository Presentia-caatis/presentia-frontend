/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { loginToADMSJS, enrollFingerprint, getFingerprintData, logoutADMSJS } from '../../../../services/admsjsService';
import { useAuth } from '../../../../context/AuthContext';
import studentService from '../../../../services/studentService';
import { Password } from 'primereact/password';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';

const FingerprintPage = () => {
    const { user } = useAuth();
    const toast = useRef<Toast>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('admsjs_token'));

    const [fingerprintData, setFingerprintData] = useState<{ pin: string }[]>([]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    const [selectedFinger, setSelectedFinger] = useState<number>(7);
    const retryCount = 2;
    const [machineNumber, setMachineNumber] = useState<string>('BWXP191562265');
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

    const fingerOptions = [
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
    useEffect(() => {
        const token = localStorage.getItem('admsjs_token');
        if (!token || token === 'undefined') {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
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
            localStorage.removeItem('admsjs_token');
            console.error('Error fetching fingerprint data:', error);
        }
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

    const fetchStudents = async () => {
        try {
            if (!user?.school_id) return;
            const data = await studentService.getStudent(user.school_id);
            setStudents(data.data);
            setFilteredStudents(data.data);
        } catch (error) {
            console.error('Error fetching students:', error);
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
            const token = await logoutADMSJS();
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
            toast.current?.show({ severity: 'warn', summary: 'Data Tidak Lengkap', detail: 'Pilih siswa dan masukkan nomor mesin.', life: 3000 });
            return;
        }
        setRegisterLoading(true);
        try {
            await enrollFingerprint(selectedStudent, selectedFinger, retryCount, machineNumber);
            toast.current?.show({ severity: 'success', summary: 'Pendaftaran Berhasil', detail: 'Segera daftarkan sidik jari pada mesin.', life: 8000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Pendaftaran Gagal', detail: 'Gagal mendaftarkan sidik jari.', life: 3000 });
        } finally {
            setRegisterLoading(false);
        }
    };

    const studentItemTemplate = (option: any) => {
        const isRegistered = fingerprintData.some(fp => fp.pin === option.id.toString());
        return (
            <div className="flex align-items-center justify-content-between">
                <span>
                    {option.student_name} - {option.class_group?.class_name || 'Tanpa Kelas'}
                </span>
                {isRegistered && <i className="pi pi-check text-green-500"></i>}
            </div>
        );
    };

    const classOptions = Array.from(new Set(students.map(student => student.class_group?.class_name)))
        .map(className => ({ label: className, value: className }));

    return (
        <div title="" className="card p-4">
            <Toast ref={toast} />
            <div className='flex justify-content-between w-full my-2'>
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
                        <label>Pilih Siswa</label>
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
                        <label>Pilih Jari</label>
                        <Dropdown
                            value={selectedFinger}
                            options={fingerOptions}
                            onChange={(e) => setSelectedFinger(e.value)}
                            optionLabel="label"
                            placeholder="Pilih Jari"
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label>Nomor Mesin</label>
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
    );
};

export default FingerprintPage;
