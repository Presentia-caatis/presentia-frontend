import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import ClientCreateSchoolModal from '../../../components/client/ClientCreateSchoolModal';
import AdminCreateSchoolModal from '../../../components/admin/AdminCreateSchoolModal';

type SchoolData = {
    id: number;
    name: string;
    plan: string;
    dueDate: string;
    owner: string;
    status: string;
};

const AdminSchoolPage = () => {
    const navigate = useNavigate();
    const [schoolList, setSchoolList] = useState<SchoolData[]>([
        { id: 1, name: 'SMK 8', plan: 'Free', dueDate: '-', owner: 'Zaky', status: 'Active' },
    ]);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleRowClick = () => {
        navigate(`/school/mainpage`);
    };

    const addSchool = (newSchool: SchoolData) => {
        setSchoolList((prev) => [...prev, newSchool]);
    };

    return (
        <div className="card">
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
                            <InputText className='py-2 pl-5' placeholder="Search..." />
                        </span>
                    </div>
                }
                rows={20}
                rowsPerPageOptions={[20, 50, 75, 100]}
                emptyMessage="Belum ada sekolah"
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                onRowClick={handleRowClick}
            >
                <Column sortable field="name" header="Nama Sekolah"></Column>
                <Column sortable field="plan" header="Paket"></Column>
                <Column sortable field="dueDate" header="Pembayaran Selanjutnya"></Column>
                <Column sortable field="owner" header="Owner"></Column>
                <Column sortable field="status" header="Status"></Column>
            </DataTable>

            <AdminCreateSchoolModal
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

export default AdminSchoolPage;
