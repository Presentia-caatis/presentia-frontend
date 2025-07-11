/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import caatisLogo from '../../../../../assets/caatisLogo.png';
import telkomLogo from '../../../../../assets/telkomuniversityLogo.png';
import defaultLogoSekolah from "../../../../../assets/defaultLogoSekolah.png";
import { useSchool } from '../../../../../context/SchoolContext';
import { useAuth } from '../../../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import attendanceService from '../../../../../services/attendanceService';
import { useToastContext } from '../../../../../layout/ToastContext';
import { Button } from 'primereact/button';

const SchoolStudentAttendanceInPage = () => {
    const { school, schoolLoading } = useSchool();
    const { checkAuth } = useAuth();
    const navigate = useNavigate();
    const [nis, setNis] = useState("");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToastContext();
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    useEffect(() => {
        const authenticate = async () => {
            await checkAuth();
        };

        authenticate();
    }, []);

    useEffect(() => {
        if (!school && !schoolLoading) {
            navigate('/404');
        }
    }, [school, schoolLoading, navigate]);

    const handleManualAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nis) return;

        setLoading(true);
        try {
            const res = await attendanceService.manualAttendance(Number(nis));
            const { status, message, data } = res;

            const firstStudentKey = Object.keys(data)[0];
            const attendanceResult = data[firstStudentKey]["0"];
            const finalStatus = attendanceResult?.status ?? status;
            const finalMessage = attendanceResult?.message ?? message;

            if (finalStatus === "success") {
                callToast(showToast, 'success', 'Sukses', finalMessage);
            } else if (finalStatus === "warning") {
                callToast(showToast, 'warn', 'Peringatan', finalMessage);
            } else {
                callToast(showToast, 'error', 'Gagal', finalMessage);
            }

            setNis("");
        } catch (err: any) {
            console.error(err);

            const responseData = err?.response?.data;
            const message = responseData?.message || err?.message || 'Presensi gagal.';
            const errorDetail = responseData?.error || '';

            if (
                message === 'Resource not found' ||
                errorDetail.includes('No query results for model [App\\Models\\Student]')
            ) {
                callToast(showToast, 'error', 'Siswa Tidak Ditemukan', 'NIS tidak terdaftar. Pastikan sudah benar.');
            } else {
                callToast(showToast, 'error', 'Gagal', message);
            }
        } finally {
            setLoading(false);
        }
    };




    if (!school) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }



    return (
        <div className="flex flex-column w-full h-full pt-4 px-2 pb-4 align-items-center justify-content-center">
            <div>
                <a className='logo react' target='_blank' rel="noopener noreferrer">
                    <img loading="lazy" src={school?.logoImagePath || defaultLogoSekolah} className='w-6rem md:w-8rem lg:w-11rem' alt="SMK Telkom Logo" />
                </a>
            </div>
            <h1 className="text-center lg:text-6xl">Presensi<br />{school ? school.name : "Loading..."}</h1>
            <Card className="w-full lg:w-6 flex flex-column">
                <form className='px-2' onSubmit={handleManualAttendance}>
                    <InputText
                        value={nis}
                        onChange={(e) => setNis(e.target.value)}
                        className="w-full text-center py-4 text-2xl border border-1 border-gray-400"
                        placeholder="Masukkan NIS"
                    />
                    <div className="flex justify-content-center pt-3 pb-3">
                        <Button
                            type="submit"
                            label="Presensi"
                            icon="pi pi-check"
                            className="p-button-lg"
                            disabled={!nis || loading}
                            loading={loading}
                        />

                    </div>
                </form>
                <div className="flex flex-column align-items-center pt-1">
                    <label htmlFor="">Created And Supported By</label>
                    <div className="flex gap-2 pt-4 justify-content-center">
                        <a href="https://telkomuniversity.ac.id" target='_blank'>
                            <img src={telkomLogo} alt="Telkom Logo" className="w-6rem lg:w-8rem  h-auto" />
                        </a>
                        <a href="https://caatis.matradipti.org/" target='_blank'>
                            <img src={caatisLogo} alt="Caatis Logo" className="w-6rem lg:w-8rem h-auto" />
                        </a>
                    </div>
                </div>
            </Card>
            {/* 
            <Card className="flex flex-column w-full lg:w-6 mt-4">
                <h2 className="text-center">Attendance Leaderboard</h2>
                <div className="flex flex-column lg:flex-row justify-content-around pt-2 gap-3">
                    <div className="flex flex-column w-full lg:w-1/2 border-2">
                        <h4 className="text-center pt-1">Top Students</h4>
                        <ol className="list-decimal pl-5">
                            {topStudents.map((student, index) => (
                                <li key={index} className="py-1">{student.name} - {student.time}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="flex flex-column w-full lg:w-1/2 border-2">
                        <h4 className="text-center pt-1">Latest Students</h4>
                        <ol className="list-decimal pl-5">
                            {latestStudents.map((student, index) => (
                                <li key={index} className="py-1">{student.name} - {student.time}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </Card> */}

            <style>{`
                .logo {
                    will-change: filter;
                    transition: filter 300ms;
                }

                .logo:hover {
                    filter: drop-shadow(0 0 2em #646cffaa);
                }

                .logo.react:hover {
                    filter: drop-shadow(0 0 2em #61dafbaa);
                }
            `}</style>
        </div>
    );
};

export default SchoolStudentAttendanceInPage;
