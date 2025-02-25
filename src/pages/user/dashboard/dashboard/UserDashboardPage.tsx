/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Panel } from 'primereact/panel';
import UserCreateSchoolModal from '../../../../components/user/UserCreateSchoolModal';
import { useAuth } from '../../../../context/AuthContext';
import { formatSchoolName } from '../../../../utils/formatSchoolName';
import { Skeleton } from 'primereact/skeleton';
import { useSchool } from '../../../../context/SchoolContext';
import defaultLogoSekolah from '../../../../assets/defaultLogoSekolah.png';

const UserDashboardPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    const { school, schoolLoading } = useSchool();

    useEffect(() => {
        if (!user) {
            localStorage.removeItem("token");
            localStorage.clear();
            navigate("/login");
        }
    }, [user, navigate]);

    const handleDashboard = () => {
        if (school) navigate(`/school/${formatSchoolName(school.name)}/dashboard`);
    };

    const handleAttendanceIn = () => {
        if (school) navigate(`/school/attendance`);
    };

    return (
        <div className="grid gap-4">
            <div className="col-12">
                {schoolLoading ? (
                    <Panel header={<Skeleton width="60%" height="2rem" />}>
                        <div className="grid grid-nogutter">
                            <div className="col-12 md:col-6 p-6">
                                <div className="flex gap-4 items-center">
                                    <Skeleton shape="circle" size="4rem" />
                                    <Skeleton width="60%" height="2rem" />
                                </div>
                                <div className="mt-4 text-lg">
                                    <div className="mb-3 flex">
                                        <i className="pi pi-info-circle text-xl mr-2"></i>
                                        <Skeleton width="40%" height="1.5rem" />
                                    </div>
                                    <div className="mb-3 flex">
                                        <i className="pi pi-map-marker text-xl mr-2"></i>
                                        <Skeleton width="60%" height="1.5rem" />
                                    </div>
                                    <div className="mb-3 flex">
                                        <i className="pi pi-calendar text-xl mr-2"></i>
                                        <Skeleton width="50%" height="1.5rem" />
                                    </div>
                                    <div className="mb-3 flex">
                                        <i className="pi pi-calendar-times text-xl mr-2"></i>
                                        <Skeleton width="50%" height="1.5rem" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 md:col-6 p-4">
                                <div className="grid h-full">
                                    <div className="col-12 flex flex-column gap-3">
                                        <div className="grid gap-4 h-full">
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <Skeleton shape="circle" size="3rem" />
                                                <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                            </Card>
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <Skeleton shape="circle" size="3rem" />
                                                <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                            </Card>
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <Skeleton shape="circle" size="3rem" />
                                                <Skeleton width="50%" className='mx-auto' height="2rem" />
                                                <Skeleton width="80%" className='mx-auto mt-3' height="1.5rem" />
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Divider />
                        <div className="flex gap-3 sm:flex-row flex-column">
                            <Skeleton width="30%" height="2.5rem" />
                            <Skeleton width="30%" height="2.5rem" />
                        </div>
                    </Panel>
                ) : school ? (
                    <Panel header="Sekolah yang dikelola">
                        <div className="grid grid-nogutter">
                            <div className="col-12 md:col-6 p-6">
                                <div className="flex gap-4 items-center">
                                    <img
                                        loading="lazy"
                                        src={school?.logoImagePath || defaultLogoSekolah}
                                        alt={`${school?.name ?? "Loading..."} logo`}
                                        className="h-4rem  w-4rem object-cover rounded-full"
                                    />
                                    <h1 className="text-4xl font-bold my-auto">{school?.name ?? "Loading..."}</h1>
                                </div>
                                <div className="mt-4 text-lg">
                                    <div className="mb-3 flex">
                                        <i className="pi pi-map-marker text-xl mr-2"></i>
                                        <div className='flex sm:flex-row flex-column'>
                                            <strong className='mr-2 white-space-nowrap'>Alamat:</strong>
                                            <span>{school?.address ?? "Loading..."}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 flex">
                                        <i className="pi pi-calendar text-xl mr-2"></i>
                                        <div className='flex sm:flex-row flex-column'>
                                            <strong className='mr-2 white-space-nowrap'>Terdaftar Sejak:</strong>
                                            <span>{school ? new Date(school.registeredAt).toLocaleDateString("id-ID") : "Loading..."}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 flex">
                                        <i className="pi pi-calendar-times text-xl mr-2"></i>
                                        <div className="flex sm:flex-row flex-column">
                                            <strong className="mr-2 whitespace-nowrap">Terakhir Berlangganan:</strong>
                                            <span>
                                                {school?.latest_subscription
                                                    ? new Date(school.latest_subscription).toLocaleDateString("id-ID")
                                                    : "Loading..."}
                                                {" "}
                                                /{" "}
                                                {school
                                                    ? school.is_subscription_packet_active
                                                        ? "✅ Aktif"
                                                        : "Tidak Aktif"
                                                    : "Loading..."}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <i className="pi pi-box text-xl mr-2"></i>
                                        <strong>Berlangganan:</strong>
                                        <Tag
                                            id="package-tooltip"
                                            value={school?.plan}
                                            severity="info"
                                            className="cursor-pointer text-lg ml-2"
                                            data-pr-tooltip={
                                                "Fitur yang Didapatkan:\n" +
                                                "- Manajemen Presensi Siswa\n" +
                                                "- Rekap Data Kehadiran\n" +
                                                "- Dashboard Statistik\n" +
                                                "- Laporan Otomatis"
                                            }
                                        />
                                        <Tooltip target="#package-tooltip" position="right" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12  md:col-6 p-4">
                                <div className="grid h-full">
                                    <div className="col-12 flex flex-column gap-3">
                                        <div className="grid gap-4 h-full">
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <i className="pi pi-users text-blue-500 text-4xl"></i>
                                                <p className="text-3xl font-bold">{school?.totalActiveStudents ?? "Loading..."}</p>
                                                <label className="text-lg">Jumlah siswa aktif</label>
                                            </Card>
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <i className="pi pi-address-book text-green-500 text-4xl"></i>
                                                <p className="text-3xl font-bold">{school?.totalPresenceToday ?? "Loading..."}</p>
                                                <label className="text-lg">Jumlah presensi hari ini</label>
                                            </Card>
                                            <Card className="flex flex-column shadow-1 text-center justify-content-center align-items-center gap-2 p-3 col">
                                                <i className="pi pi-user-minus text-orange-500 text-4xl"></i>
                                                <p className="text-3xl font-bold">{school?.totalAbsenceToday ?? "Loading..."}</p>
                                                <label className="text-lg">Jumlah absensi hari ini</label>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Divider />
                        <div className="flex gap-3 sm:flex-row flex-column">
                            <Button
                                label="Dashboard Sekolah"
                                icon="pi pi-home"
                                className="p-button p-button-primary"
                                onClick={handleDashboard}
                            />
                            <Button
                                label="Daftar Presensi Hari Ini"
                                icon="pi pi-sign-in"
                                className="p-button p-button-success"
                                onClick={handleAttendanceIn}
                            />
                            {/* <Button
                                    label="Absen Masuk"
                                    icon="pi pi-sign-in"
                                    className="p-button p-button-success"
                                    onClick={handleAttendanceIn}
                                />
                                <Button
                                    label="Absen Keluar"
                                    icon="pi pi-sign-out"
                                    className="p-button p-button-warning"
                                    onClick={handleAttendanceOut}
                                /> */}
                        </div>
                    </Panel>
                ) : <Card className='shadow-1' title="Selamat Datang di Presentia">
                    <p className="text-sm mb-4">
                        Anda belum memiliki sekolah yang terdaftar. Buat sekolah untuk memulai pengelolaan presensi.
                    </p>
                    <Button
                        icon="pi pi-plus"
                        label="Buat Sekolah"
                        className="p-button-success"
                        onClick={() => setModalVisible(true)}
                    />
                </Card>}
            </div>
            {/* <UserCreateSchoolModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(newSchool: SchoolData) => {
                    setSchoolData(newSchool);
                    setModalVisible(false);
                }}
            /> */}
        </div>
    );
};

export default UserDashboardPage;
