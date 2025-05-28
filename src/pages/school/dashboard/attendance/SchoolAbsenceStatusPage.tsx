/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Tooltip } from 'primereact/tooltip';
import { absencePermitTypeService } from '../../../../services/absencePermitService';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { useMountEffect } from 'primereact/hooks';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { hasAnyPermission } from '../../../../utils/hasAnyPermissions';
import { useAuth } from '../../../../context/AuthContext';

const SchoolAbsenceStatusPage = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [permitTypeData, setPermitTypeData] = useState<any>({ permit_name: '', is_active: 1 });
    const [selectedPermits, setSelectedPermits] = useState<any[]>([]);
    const [loadingButton, setLoadingButton] = useState(false);
    const [permitList, setPermitList] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        fetchPermitTypes(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const fetchPermitTypes = async (page = 1, perPage = 20) => {
        try {
            setLoading(true);
            const response = await absencePermitTypeService.getAll(page, perPage);
            setPermitList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error("Error fetching permit types:", error);
            setPermitList([]);
        } finally {
            setLoading(false);
        }
    };

    const confirmSavePermitType = (event: React.MouseEvent) => {
        confirmPopup({
            target: event.currentTarget as HTMLElement,
            message: 'Apakah Anda yakin ingin menyimpan tipe izin ini?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleSave(),
            reject: () => {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Dibatalkan',
                    detail: 'Penyimpanan tipe izin dibatalkan.',
                    life: 3000,
                });
            },
        });
    };


    const handleSave = async () => {
        try {
            setLoadingButton(true);
            if (permitTypeData.id) {
                await absencePermitTypeService.update(permitTypeData.id, permitTypeData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Tipe izin berhasil diperbarui.',
                    life: 3000,
                });
            } else {
                await absencePermitTypeService.create(
                    permitTypeData
                );
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Tipe izin berhasil ditambahkan.',
                    life: 3000,
                });
            }
            setShowAddDialog(false);
            fetchPermitTypes();
        } catch (error) {
            console.error('Error saving permit type:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Terjadi kesalahan saat menyimpan tipe izin.',
                life: 3000,
            });
        } finally {
            setLoadingButton(false);
        }
    };

    const handleDelete = async (id: number) => {
        await absencePermitTypeService.delete(id);
        fetchPermitTypes();
    };

    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({
            id: '1',
            sticky: true,
            severity: 'info',
            detail: 'Status absensi yang aktif, dapat digunakan untuk menentukan status siswa yang tidak hadir.',
            closable: false,
        });
    });

    return (
        <div className="card">
            <h1>Daftar Status Absensi</h1>
            <Toast ref={toast} />
            <Messages ref={msgs} />
            <ConfirmPopup />
            {
                hasAnyPermission(user, ['manage_schools']) && (
                    <div className="flex justify-content-between p-4 card">
                        <div className="flex gap-2">
                            <Button icon="pi pi-plus" severity="success" label="Tambah Status" onClick={() => setShowAddDialog(true)} />
                            <Button icon="pi pi-trash" severity="danger" label="Hapus" disabled={!selectedPermits?.length} />
                        </div>
                        {/* <Button icon="pi pi-upload" severity="help" label="Export" /> */}
                    </div>
                )
            }


            <Tooltip className='p-1' target=".student-count-tooltip" />
            <DataTable
                dataKey="id"
                selection={selectedPermits!}
                selectionMode="multiple"
                onSelectionChange={(e) => setSelectedPermits(e.value)}
                value={permitList}
                paginator
                first={(currentPage - 1) * rowsPerPage
                }
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPage={(event) => {
                    setCurrentPage((event.page ?? 0) + 1);
                    setRowsPerPage(event.rows);
                }}
                rowsPerPageOptions={[10, 20, 50, 100]}
                tableStyle={{ minWidth: "50rem" }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} status absensi"
                emptyMessage={
                    loading ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data status absensi...</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Belum ada data status absensi</span>
                            <small className="text-gray-400">Silakan tambahkan status absensi melalui tombol tambah status.</small>
                        </div>
                    )
                }
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="permit_name" body={(rowData) =>
                    loading ? <Skeleton width="80%" height="1rem" /> : rowData.permit_name
                } header="Nama Status" sortable />
                <Column field="is_active" body={(rowData) =>
                    loading ? <Skeleton width="60%" height="1rem" /> : rowData.is_active ? "Aktif" : "Tidak Aktif"
                } header="Status" sortable />
                <Column
                    body={(rowData: any) => (
                        loading ? (
                            <div className="flex gap-2">
                                <Skeleton shape="circle" size="2rem" />
                                <Skeleton shape="circle" size="2rem" />
                            </div>
                        ) : hasAnyPermission(user, ['manage_schools']) ? (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-success p-button-rounded"
                                    tooltip="Perbarui"
                                    loading={loadingButton}
                                    onClick={() => {
                                        setPermitTypeData(rowData);
                                        setShowAddDialog(true);
                                    }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-rounded"
                                    tooltip="Hapus"
                                    onClick={() => handleDelete(rowData.id)}
                                />
                            </div>
                        ) : null
                    )}
                />

            </DataTable>

            <Dialog
                visible={showAddDialog}
                style={{ width: '450px' }}
                onHide={() => setShowAddDialog(false)}
                header="Tambah Status Baru"
                footer={
                    <div>
                        <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={() => setShowAddDialog(false)} />
                        <Button label="Simpan" loading={loadingButton} disabled={!permitTypeData.permit_name} icon="pi pi-check" onClick={(e) => confirmSavePermitType(e)} />
                    </div>
                }
                modal
                className="p-fluid"
            >
                <div className="field">
                    <label htmlFor="permit_name">Nama</label>
                    <InputText
                        id="permit_name"
                        value={permitTypeData.permit_name}
                        placeholder='Masukkan nama status absen'
                        onChange={(e) => setPermitTypeData({ ...permitTypeData, permit_name: e.target.value })}
                        required
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label htmlFor="is_active">Status</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status1"
                                name="is_active"
                                value={1}
                                onChange={(e) => setPermitTypeData({ ...permitTypeData, is_active: e.value })}
                                checked={permitTypeData.is_active === 1}
                            />
                            <label htmlFor="status1" className="ml-2">Aktif</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton
                                inputId="status2"
                                name="is_active"
                                value={0}
                                onChange={(e) => setPermitTypeData({ ...permitTypeData, is_active: e.value })}
                                checked={permitTypeData.is_active === 0}
                            />
                            <label htmlFor="status2" className="ml-2">Tidak Aktif</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default SchoolAbsenceStatusPage;
