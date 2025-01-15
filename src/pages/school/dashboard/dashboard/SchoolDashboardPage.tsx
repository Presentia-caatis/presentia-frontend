/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Chart } from 'primereact/chart';
import { ToggleButton } from 'primereact/togglebutton';
// import { useParams } from 'react-router-dom';
import { useSchool } from '../../../../context/SchoolContext';

interface DashboardData {
    student_active: number;
    student_nonactive: number;
    student_gender_male: number;
    student_gender_female: number;
    student_violation: number;
    student_achievement: number;
    attandence_notlate: number;
    attandence_islate: number;
    active_package: string;
    package_expiry: string;
}

const SchoolDashboardPage = () => {
    // const { schoolId } = useParams();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const { schoolData } = useSchool();

    const dummyData: DashboardData = {
        student_active: 150,
        student_nonactive: 50,
        student_gender_male: 80,
        student_gender_female: 70,
        student_violation: 20,
        student_achievement: 130,
        attandence_notlate: 120,
        attandence_islate: 30,
        active_package: 'Free',
        package_expiry: '02-Mei-2025',
    };

    const [dataHome] = useState<DashboardData>(dummyData);

    const [isFingerprintOn, setIsFingerprintOn] = useState(true);
    // const [isFaceRecognitionOn, setIsFaceRecognitionOn] = useState(false);

    const [studentActiveChart] = useState({
        labels: ['Siswa Aktif', 'Siswa Tidak Aktif'],
        datasets: [
            {
                data: [dummyData.student_active, dummyData.student_nonactive],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400'),
                    documentStyle.getPropertyValue('--purple-400'),
                ],
            },
        ],
    });

    const [studentActiveChartOption] = useState({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                },
            },
        },
    });

    const [studentGenderChart] = useState({
        labels: ['Laki-Laki', 'Perempuan'],
        datasets: [
            {
                data: [dummyData.student_gender_male, dummyData.student_gender_female],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400'),
                    documentStyle.getPropertyValue('--purple-400'),
                ],
            },
        ],
    });

    const [studentGenderChartOption] = useState({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                },
            },
        },
    });

    // const [studentAchVlnChart] = useState({
    //     labels: ['Pelanggaran Siswa', 'Pencapaian Siswa'],
    //     datasets: [
    //         {
    //             data: [dummyData.student_violation, dummyData.student_achievement],
    //             backgroundColor: [
    //                 documentStyle.getPropertyValue('--indigo-500'),
    //                 documentStyle.getPropertyValue('--purple-500'),
    //             ],
    //             hoverBackgroundColor: [
    //                 documentStyle.getPropertyValue('--indigo-400'),
    //                 documentStyle.getPropertyValue('--purple-400'),
    //             ],
    //         },
    //     ],
    // });

    // const [studentAchVlnChartOption] = useState({
    //     plugins: {
    //         legend: {
    //             labels: {
    //                 usePointStyle: true,
    //                 color: textColor,
    //             },
    //         },
    //     },
    // });

    const [studentAttendanceChart] = useState({
        labels: ['Tepat Waktu', 'Terlambat'],
        datasets: [
            {
                data: [dummyData.attandence_notlate, dummyData.attandence_islate],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'),
                    documentStyle.getPropertyValue('--purple-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--indigo-400'),
                    documentStyle.getPropertyValue('--purple-400'),
                ],
            },
        ],
    });

    const [studentAttendanceChartOption] = useState({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                },
            },
        },
    });

    return (
        <>
            <div className="card">
                <h1>{`Selamat Datang Di Dashboard ${schoolData ? schoolData.school_name : 'Loading...'}`}</h1>
                <p>{schoolData ? schoolData.address : 'Loading...'}</p>
            </div>
            <div className="grid">
                <div className="col-12 lg:col-4 p-3">
                    <div className="card h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Siswa Aktif</span>
                                <div className="text-900 font-medium text-xl">{dataHome.student_active}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-users text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-4 p-3">
                    <div className="card  h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Absen Hari Ini</span>
                                <div className="text-900 font-medium text-xl">{dataHome.student_active}</div>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-4 p-3">
                    <div className="card">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Paket Aktif</span>
                                <div className="text-900 font-medium text-xl">{dataHome.active_package}</div>
                                <span className="block text-500 font-small">Berlaku hingga: {dataHome.package_expiry}</span>
                            </div>
                            <div
                                className="flex align-items-center justify-content-center bg-green-100 border-round"
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                <i className="pi pi-check-circle text-green-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 xl:col-4 p-3">
                    <div className="card h-full flex flex-column align-items-center gap-4">
                        <h5 className="text-left w-full">Fitur absensi</h5>
                        {/* <div className="w-full text-center flex gap-3 justify-content-between">
                            <span className="block text-500 font-medium mb-3 my-auto">Face Recognition</span>
                            <ToggleButton
                                checked={isFaceRecognitionOn}
                                onChange={(e) => setIsFaceRecognitionOn(e.value)}
                                onIcon="pi pi-power-on"
                                offIcon="pi pi-power-off"
                                onLabel="ON"
                                offLabel="OFF"
                                style={{ width: '10rem' }}
                            />
                        </div> */}
                        <div className="w-full text-center flex gap-3 justify-content-between">
                            <span className="block text-500 font-medium mb-3 my-auto">Fingerprint</span>
                            <ToggleButton
                                checked={isFingerprintOn}
                                onChange={(e) => setIsFingerprintOn(e.value)}
                                onIcon="pi pi-power-on"
                                offIcon="pi pi-power-off"
                                onLabel="ON"
                                offLabel="OFF"
                                style={{ width: '10rem' }}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Daftar Pencapaian</span>
                                <div className="text-900 font-medium text-xl">{dataHome.student_active}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Daftar Pelanggaran</span>
                                <div className="text-900 font-medium text-xl">{dataHome.student_active}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-comment text-purple-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="col-12 xl:col-8">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Perbandingan Kehadiran</h5>
                        {dataHome.attandence_notlate === 0 ? (
                            <h3>Tidak Ada Kehadiran Hari Ini</h3>
                        ) : (
                            <Chart type="pie" data={studentAttendanceChart} options={studentAttendanceChartOption} />
                        )}
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Perbandingan Keaktifan status siswa</h5>
                        <Chart type="pie" data={studentActiveChart} options={studentActiveChartOption} />
                    </div>
                </div>
                <div className="col-12 xl:col-6 ">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Perbandingan Gender Siswa</h5>
                        <Chart type="doughnut" data={studentGenderChart} options={studentGenderChartOption} />
                    </div>
                </div>
                {/* <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Perbandingan pencapaian dan pelanggaran</h5>
                        <Chart type="doughnut" data={studentAchVlnChart} options={studentAchVlnChartOption} />
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default SchoolDashboardPage;
