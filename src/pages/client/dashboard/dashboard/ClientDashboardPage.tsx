import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import ClientCreateSchoolModal from '../../../../components/client/ClientCreateSchoolModal';

type SchoolData = {
    id: number;
    name: string;
    plan: string;
    dueDate: string;
    role: string;
    status: string;
};

const ClientDashboardPage = () => {
    const navigate = useNavigate();
    const [schoolList, setSchoolList] = useState<SchoolData[]>([
        { id: 1, name: 'SMK 8', plan: 'Free', dueDate: '-', role: 'owner', status: 'Active' },
        { id: 2, name: 'SMA Negeri 1', plan: 'Premium', dueDate: '2024-12-31', role: 'Teacher', status: 'Inactive' },
    ]);
    const [isModalVisible, setModalVisible] = useState(false);

    const addSchool = (newSchool: SchoolData) => {
        setSchoolList((prev) => [...prev, newSchool]);
    };

    const handleAttendanceIn = (schoolId: number) => {
        navigate(`/school/${schoolId}/student/attendance/in`);
    };

    const handleAttendanceOut = (schoolId: number) => {
        navigate(`/school/${schoolId}/student/attendance/out`);
    };

    const handleDashboard = (schoolId: number) => {
        navigate(`/school/${schoolId}/mainpage`);
    };

    return (
        <div className="card">
            {/* Header Section */}
            <div className="flex justify-content-between p-4 card">
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-plus"
                        severity="success"
                        label="Sekolah Baru"
                        onClick={() => setModalVisible(true)}
                    />
                </div>
            </div>

            {/* Instruction Section */}
            <div className="p-4">
                <p className="text-sm text-secondary">
                    Klik salah satu sekolah di daftar berikut untuk membuka dashboard atau mengelola absensi.
                </p>
            </div>

            {/* School List DataTable */}
            <DataTable
                dataKey="id"
                value={schoolList}
                selectionMode="single"
                paginator
                header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 className="m-0">Daftar Sekolah</h5>
                        <span className="block mt-2 md:mt-0 p-input-icon-left ">
                            <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                            <InputText className="py-2 pl-5" placeholder="Search..." />
                        </span>
                    </div>
                }
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                emptyMessage="Belum ada sekolah"
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} schools"
                rowClassName={() => 'cursor-pointer hover:surface-200'}
            >
                {/* Columns */}
                <Column field="name" header="Nama Sekolah" sortable></Column>
                <Column field="plan" header="Paket" sortable></Column>
                <Column field="dueDate" header="Pembayaran Selanjutnya" sortable></Column>
                <Column field="role" header="Role" sortable></Column>
                <Column field="status" header="Status" sortable></Column>

                {/* Actions Column */}
                <Column
                    header="Aksi"
                    body={(rowData: SchoolData) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-home"
                                label="Dashboard"
                                className="p-button-text p-button-sm"
                                onClick={() => handleDashboard(rowData.id)}
                            />
                            <Button
                                icon="pi pi-sign-in"
                                label="Absen Masuk"
                                severity="info"
                                className="p-button-sm"
                                onClick={() => handleAttendanceIn(rowData.id)}
                            />
                            <Button
                                icon="pi pi-sign-out"
                                label="Absen Keluar"
                                severity="warning"
                                className="p-button-sm"
                                onClick={() => handleAttendanceOut(rowData.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            {/* Modal for Creating New School */}
            <ClientCreateSchoolModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(newSchool: SchoolData) => {
                    addSchool(newSchool);
                    setModalVisible(false);
                }}
            />
        </div>
    );
};

export default ClientDashboardPage;
