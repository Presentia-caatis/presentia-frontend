import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import caatisLogo from '../../../../../assets/caatisLogo.png';
import telkomLogo from '../../../../../assets/telkomuniversityLogo.png';
import smkTelkomLogo from '../../../../../assets/logo-smk-telkom-bdg.png';

const SchoolStudentAttendanceOutPage = () => {
    const topStudents = [
        { name: 'Ahmad Ali', time: '08:00' },
        { name: 'Budi Santoso', time: '08:05' },
        { name: 'Citra Dewi', time: '08:10' },
        { name: 'Dewi Lestari', time: '08:15' },
        { name: 'Eko Prabowo', time: '08:20' },
    ];

    const latestStudents = [
        { name: 'Fajar Ramadhan', time: '08:25' },
        { name: 'Gina Sari', time: '08:30' },
        { name: 'Hendra Jaya', time: '08:35' },
        { name: 'Indah Permata', time: '08:40' },
        { name: 'Joko Susilo', time: '08:50' },
    ];

    return (
        <div className="flex flex-column w-full h-full pt-4 px-2 pb-4 align-items-center justify-content-center">
            <div>
                <a href="https://sman24bdg.sch.id/" className='logo react' target='_blank' rel="noopener noreferrer">
                    <img src={smkTelkomLogo} className='w-6rem md:w-8rem lg:w-11rem' alt="SMK Telkom Logo" />
                </a>
            </div>
            <h1 className="text-center lg:text-6xl">Presensi Keluar<br />SMK Telkom Bandung</h1>
            <Card className="w-full lg:w-6 flex flex-column">
                <form className='px-2' action="">
                    <InputText className="w-full text-center py-4 text-2xl border border-2 border-black-alpha-90" placeholder="Masukkan NIS" />
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
            </Card>

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

export default SchoolStudentAttendanceOutPage;
