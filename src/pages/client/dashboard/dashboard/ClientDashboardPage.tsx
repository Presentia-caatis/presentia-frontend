import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { useNavigate } from 'react-router-dom';
import ClientCreateSchoolModal from '../../../../components/client/ClientCreateSchoolModal';

const ClientDashboardPage = () => {
    const navigate = useNavigate();
    const [school, setSchool] = useState<{
        id: number;
        name: string;
        plan: string;
        dueDate: string;
        role: string;
        status: string;
        packageDetails?: {
            name: string;
            pricePerMonth: number;
            pricePerYear: number;
            features: string[];
        };
    } | null>({
        id: 1,
        name: 'SMK Negeri 1',
        plan: 'Premium',
        dueDate: '2024-12-31',
        role: 'Owner',
        status: 'Active',
        packageDetails: {
            name: "Premium",
            pricePerMonth: 500000,
            pricePerYear: 5000000,
            features: ["Priority Support", "100GB Storage", "Custom Reports"],
        },
    });
    const [isModalVisible, setModalVisible] = useState(false);

    const handleDashboard = () => {
        if (school) navigate(`/school/${school.id}/mainpage`);
    };

    const handleAttendanceIn = () => {
        if (school) navigate(`/school/${school.id}/student/attendance/in`);
    };

    const handleAttendanceOut = () => {
        if (school) navigate(`/school/${school.id}/student/attendance/out`);
    };

    const addSchool = (newSchool: {
        id: number;
        name: string;
        plan: string;
        dueDate: string;
        role: string;
        status: string;
        packageDetails?: {
            name: string;
            pricePerMonth: number;
            pricePerYear: number;
            features: string[];
        };
    }) => {
        setSchool(newSchool);
        setModalVisible(false);
    };

    return (
        <div className="p-4">
            <h2 className="mb-3 text-center">Dashboard Sekolah</h2>
            <Divider />

            {!school ? (
                <div className="flex align-items-center justify-content-center flex-column gap-3">
                    <p className="text-center text-secondary">Anda belum memiliki sekolah terdaftar.</p>
                    <Button
                        icon="pi pi-plus"
                        label="Tambah Sekolah"
                        severity="success"
                        onClick={() => setModalVisible(true)}
                        className="p-button-lg"
                    />
                </div>
            ) : (
                <div className="flex flex-column align-items-center">
                    <Card
                        title={school.name}
                        subTitle={<span><strong>Paket:</strong> {school.plan}</span>}
                        style={{ width: '90%', maxWidth: '600px' }}
                        className="mb-3 shadow-2"
                        footer={
                            <div className="flex justify-content-center gap-2">
                                <Button
                                    icon="pi pi-home"
                                    label="Dashboard"
                                    className="p-button-outlined"
                                    onClick={handleDashboard}
                                />
                                <Button
                                    icon="pi pi-sign-in"
                                    label="Absen Masuk"
                                    severity="info"
                                    className="p-button-outlined"
                                    onClick={handleAttendanceIn}
                                />
                                <Button
                                    icon="pi pi-sign-out"
                                    label="Absen Keluar"
                                    severity="warning"
                                    className="p-button-outlined"
                                    onClick={handleAttendanceOut}
                                />
                            </div>
                        }
                    >
                        <div className="flex flex-column gap-3">
                            <div className="flex justify-content-between align-items-center">
                                <div>
                                    <p><strong>Pembayaran Selanjutnya:</strong> {school.dueDate || '-'}</p>
                                    <p><strong>Role:</strong> {school.role}</p>
                                </div>
                                <Tag
                                    value={school.status}
                                    severity={school.status === 'Active' ? 'success' : 'danger'}
                                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                                />
                            </div>

                            {school.packageDetails && (
                                <div className="surface-50 p-3 border-round">
                                    <h4 className="text-primary">Detail Paket</h4>
                                    <p><strong>Nama Paket:</strong> {school.packageDetails.name}</p>
                                    <p><strong>Harga per Bulan:</strong> Rp{school.packageDetails.pricePerMonth.toLocaleString()}</p>
                                    <p><strong>Harga per Tahun:</strong> Rp{school.packageDetails.pricePerYear.toLocaleString()}</p>
                                    <p><strong>Fitur:</strong></p>
                                    <ul className="pl-3">
                                        {school.packageDetails.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            <ClientCreateSchoolModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(newSchool) => addSchool(newSchool)}
            />
        </div>
    );
};

export default ClientDashboardPage;
