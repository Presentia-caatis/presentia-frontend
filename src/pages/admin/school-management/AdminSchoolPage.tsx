/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import AdminCreateSchoolModal from '../../../components/admin/AdminCreateSchoolModal';
import SchoolService from '../../../services/schoolService';
import { ProgressSpinner } from 'primereact/progressspinner';
import defaultSchoolLogo from '../../../assets/defaultLogoSekolah.png';
import { useAuth } from '../../../context/AuthContext';
import { formatSchoolName } from '../../../utils/formatSchoolName';
import { useSchool } from '../../../context/SchoolContext';

interface SchoolData {
    id: number;
    name: string;
    plan: string;
    dueDate: string;
    address: string;
    logo: string;
}



const AdminSchoolPage = () => {
    const navigate = useNavigate();
    const [schoolList, setSchoolList] = useState<SchoolData[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, updateUser } = useAuth();
    const { school, schoolLoading } = useSchool();

    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedFilter, setDebouncedFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);

    const addSchool = (newSchool: SchoolData) => {
        setSchoolList((prev) => [...prev, newSchool]);
    };

    const fetchSchools = async (currentPage: number, rowsPerPage: number) => {
        try {
            setLoading(true);
            setSchoolList([]);
            const response = await SchoolService.getAll(rowsPerPage, currentPage);
            const schoolListFromApi = response.data.data;
            const mappedSchoolList: SchoolData[] = schoolListFromApi.map((school: any) => ({
                id: school.id,
                name: school.name,
                plan: school.subscription_plan_id === 1 ? 'Free' : 'Premium',
                dueDate: school.latest_subscription,
                address: school.address,
                logo: school.logo_image_path
            }));

            setTotalRecords(response.data.total);
            setSchoolList(mappedSchoolList);
        } catch (error) {
            console.error('Failed to fetch schools:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
        if (
            user?.roles.includes('super_admin') &&
            !schoolLoading &&
            school
        ) {
            const targetName = localStorage.getItem("targetSchoolName");
            if (targetName) {
                navigate(`/school/${targetName}/dashboard`);
                localStorage.removeItem("targetSchoolId");
                localStorage.removeItem("targetSchoolName");
            }
        }
    }, [user, schoolLoading, school, navigate]);

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
                emptyMessage={
                    loading ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data sekolah...</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Belum ada data sekolah</span>
                            <small className="text-gray-400">Silakan tambahkan sekolah melalui tombol tambah sekolah.</small>
                        </div>
                    )
                }
                paginator
                lazy
                first={(currentPage - 1) * rowsPerPage}
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPage={(event) => {
                    setCurrentPage((event.page ?? 0) + 1);
                    setRowsPerPage(event.rows);
                }}
                rowsPerPageOptions={[10, 20, 50, 100]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} sekolah"
                stripedRows
            >
                <Column
                    field="logo_image_path"
                    body={(rowData: any) => (
                        <img
                            src={rowData.logo}
                            alt={rowData.name}
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = defaultSchoolLogo;
                            }}
                        />
                    )}
                />
                <Column sortable field="name" header="Nama Sekolah"></Column>
                <Column sortable field="plan" header="Paket"></Column>
                <Column sortable field="dueDate" header="Pembayaran Selanjutnya"></Column>
                <Column sortable field="address" header="Alamat"></Column>
                <Column
                    header="Aksi"
                    body={(rowData) => (
                        <Button
                            icon="pi pi-sign-in"
                            label="Masuk"
                            loading={schoolLoading}
                            onClick={async () => {
                                try {
                                    localStorage.setItem("targetSchoolId", rowData.id);
                                    localStorage.setItem("targetSchoolName", formatSchoolName(rowData.name));
                                    updateUser({ school_id: rowData.id });
                                } catch (error) {
                                    console.error("Gagal masuk ke sekolah:", error);
                                }
                            }}
                        />

                    )}
                />

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
