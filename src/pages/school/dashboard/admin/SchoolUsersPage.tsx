/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import userService from "../../../../services/userService";
import { hasAnyPermission } from "../../../../utils/hasAnyPermissions";
import { useSchool } from "../../../../context/SchoolContext";
import { useAuth } from "../../../../context/AuthContext";
import roleService from "../../../../services/roleService";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import schoolInviationService from "../../../../services/schoolInviationService";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Badge } from "primereact/badge";
import { statusLabels } from "../../../../utils/statusLabel";



const SchoolUsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [allRoles, setAllRoles] = useState<{ label: string; value: any }[]>([]);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterRole, setFilterRole] = useState<string | null>(null);
    const toast = useRef<Toast>(null);
    const { school } = useSchool();
    const { user } = useAuth();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const roleNameToId = useRef<Map<string, number>>(new Map());
    const roleIdToName = useRef<Map<number, string>>(new Map());
    const [totalPendingInvitations, setTotalPendingInvitations] = useState(0);
    const [showInvitationDialog, setShowInvitationDialog] = useState(false);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loadingInvitations, setLoadingInvitations] = useState(false);
    const [invitationStatusFilter, setInvitationStatusFilter] = useState<string | null>(null);
    const [invitationPage, setInvitationPage] = useState(1);
    const [invitationPerPage, setInvitationPerPage] = useState(10);
    const [totalInvitations, setTotalInvitations] = useState(0);



    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3) {
                setDebouncedQuery(searchQuery);
            } else {
                setDebouncedQuery('');
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setSearchLoading(true);
                const response = await userService.getUnassignedUsers(debouncedQuery);
                if (response.status === 200) {
                    setSearchResults(response.responseData.data.data);
                }
            } catch {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Gagal memuat pengguna',
                });
            } finally {
                setSearchLoading(false);
            }
        };

        if (debouncedQuery) fetchResults();
    }, [debouncedQuery]);

    const fetchPendingInvitations = async () => {
        try {
            const response = await schoolInviationService.index(1, {
                filter: { status: "pending" },
            });

            setTotalPendingInvitations(response.data.data.total);
        } catch (error) {
            console.error("Gagal memuat undangan:", error);
        }
    };



    useEffect(() => {
        const fetchInvitations = async () => {
            setLoadingInvitations(true);
            setInvitations([]);
            try {
                const params: any = {
                    sort: {
                        created_at: 'desc',
                    },
                };

                if (invitationStatusFilter && invitationStatusFilter !== 'semua') {
                    params.filter = {
                        status: invitationStatusFilter,
                    };
                }


                const response = await schoolInviationService.index(invitationPage, params);

                setInvitations(response.data.data.data);
                setTotalInvitations(response.data.data.total);

            } catch (error) {
                console.error("Gagal memuat undangan:", error);
            } finally {
                setLoadingInvitations(false);
            }
        };

        fetchInvitations();
    }, [invitationPage, invitationPerPage, invitationStatusFilter]);






    useEffect(() => {
        fetchPendingInvitations();
    }, []);



    const resetDialogForm = () => {
        setSelectedUser(null);
        setSelectedRole(null);
        setSearchQuery('');
        setSearchResults([]);
    };


    const handleSendInvitation = async () => {
        try {
            if (!selectedUser || !selectedRole) return;

            const roleId = roleNameToId.current.get(selectedRole);
            console.log("selectedRole:", selectedRole);
            if (roleId === undefined) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Role tidak valid',
                });
                return;
            }

            await schoolInviationService.store({
                receiver_id: selectedUser.id,
                role_to_assign_id: roleId,
                school_id: school?.id ?? 0,
            });

            toast.current?.show({ severity: 'success', summary: 'Sukses', detail: 'Undangan berhasil dikirim' });
            setShowAddDialog(false);
            resetDialogForm();
            fetchUserData();
            fetchPendingInvitations();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: error?.response?.data?.message || 'Gagal mengirim undangan',
            });
        }
    };

    const fetchUserData = async (page = 1, perPage = 10, roleName: string | null = null) => {
        setLoading(true);
        setUsers([]);

        try {
            const params: any = {
                page,
                per_page: perPage,
                filter: {},
            };

            if (roleName) {
                params.filter["roles.name"] = roleName;
            }

            const response = await userService.getSchoolUsers(params);

            if (response.responseData.status !== "success") throw new Error("Gagal memuat data");

            const data = response.responseData.data;
            setUsers(data.data);
            setTotalRecords(data.total);
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "Error", detail: "Gagal memuat data pengguna" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const roles = await roleService.getSchoolRole();
                const formatted = roles.map((role: any) => {
                    roleNameToId.current.set(role.name, role.id);
                    roleIdToName.current.set(role.id, role.name);

                    let label = '';
                    switch (role.name) {
                        case 'school_admin':
                            label = 'Owner';
                            break;
                        case 'school_coadmin':
                            label = 'Admin Sekolah';
                            break;
                        case 'school_staff':
                            label = 'Staff Sekolah';
                            break;
                        default:
                            label = role.name.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
                    }

                    return {
                        label,
                        value: role.name,
                    };
                });

                setAllRoles(formatted);
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal memuat data role',
                });
            }
        };

        fetchRoles();
    }, []);


    useEffect(() => {
        fetchUserData(page, perPage, filterRole);
    }, [page, perPage, filterRole]);

    const confirmSendInvitation = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        confirmPopup({
            target: event.currentTarget,
            message: `Apakah Anda yakin ingin mengundang ${selectedUser?.fullname ?? 'pengguna'} sebagai ${selectedRole ? allRoles.find(r => r.value === selectedRole)?.label : 'Role'}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-success',
            acceptLabel: 'Ya',
            rejectLabel: 'Tidak',
            accept: () => handleSendInvitation(),
        });
    };


    const onRoleChange = async (userId: number, roleName: string) => {
        try {
            await roleService.changeUserRole({
                user_id: userId,
                role: roleName,
            });
            toast.current?.show({
                severity: "success",
                summary: "Berhasil",
                detail: `Role berhasil diubah`,
            });
            fetchUserData(page, perPage, filterRole);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? "Gagal memperbarui role";
            toast.current?.show({ severity: "error", summary: "Gagal", detail: message });
        }
    };

    const roleBodyTemplate = (rowData: any) => {
        const currentRoles = rowData.roles?.map((r: any) => r.name) ?? [];

        return (
            <div className="flex flex-column gap-2">
                <Dropdown
                    value={currentRoles[0]}
                    options={allRoles}
                    onChange={(e) => onRoleChange(rowData.id, e.value)}
                    placeholder="Pilih role"
                    optionLabel="label"
                    className="w-full"
                />
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="card">
                <h1>Daftar Pengguna {school?.name ?? 'Loading...'}</h1>
                {hasAnyPermission(user, ['manage_students']) && (
                    <div className='flex flex-column md:flex-row card gap-2'>
                        <div className='flex flex-column mb-2 md:mb-0 md:flex-row gap-2'>
                            <Button icon="pi pi-plus" severity='success' label='Tambah Pengguna' onClick={() => setShowAddDialog(true)} />
                        </div>
                        <div className="relative">
                            <Button
                                icon="pi pi-envelope"
                                label="Undangan"
                                onClick={() => setShowInvitationDialog(true)}
                                severity="info"
                                className="pr-5 w-full"
                            />
                            {totalPendingInvitations > 0 && (
                                <Badge
                                    value={totalPendingInvitations}
                                    severity="danger"
                                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                                />
                            )}
                        </div>


                    </div>

                )}
                <div className="flex justify-content-between mb-3">
                    <Dropdown
                        value={filterRole}
                        options={allRoles}
                        onChange={(e) => setFilterRole(e.value)}
                        placeholder="Filter berdasarkan role"
                        className="w-64"
                        showClear
                    />
                </div>

                <DataTable
                    value={users}
                    paginator
                    rows={perPage}
                    totalRecords={totalRecords}
                    emptyMessage={
                        loading ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data pengguna...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-filter-slash text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Tidak ada pengguna yang sesuai dengan pencarian Anda</span>
                            </div>
                        ) : (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Belum ada data pengguna</span>
                                <small className="text-gray-400">Silakan tambahkan pengguna melalui tombol pengguna baru.</small>
                            </div>
                        )
                    }
                    onPage={(e) => {
                        setPage((e.page !== undefined ? e.page : 0) + 1);
                        setPerPage(e.rows ?? perPage);
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    lazy
                    stripedRows
                    tableStyle={{ minWidth: '60rem' }}
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} pengguna"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="fullname" header="Nama" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="username" header="Username" sortable />
                    <Column header="Role" body={roleBodyTemplate} />
                    <Column
                        body={(rowData: any) => (
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-sm "
                                tooltip="Hapus Pengguna"
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={(event) => {
                                    confirmPopup({
                                        target: event.currentTarget,
                                        message: `Apakah Anda yakin ingin menghapus ${rowData.fullname} dari sekolah ini?`,
                                        icon: 'pi pi-exclamation-triangle',
                                        acceptClassName: 'p-button-danger',
                                        acceptLabel: 'Ya',
                                        rejectLabel: 'Tidak',
                                        accept: async () => {
                                            try {
                                                await userService.removeUserFromSchool(rowData.id);
                                                toast.current?.show({
                                                    severity: "success",
                                                    summary: "Berhasil",
                                                    detail: "Pengguna berhasil dihapus",
                                                });
                                                fetchUserData(page, perPage, filterRole);
                                            } catch (error: any) {
                                                toast.current?.show({
                                                    severity: "error",
                                                    summary: "Gagal",
                                                    detail: error?.response?.data?.message || "Gagal menghapus pengguna",
                                                });
                                            }
                                        }
                                    });
                                }}
                            />
                        )}
                        style={{ width: '7rem' }}
                    />
                </DataTable>
            </div>

            <Dialog draggable={false} footer={
                <div>
                    <Button label="Batal" icon="pi pi-times" onClick={() => {
                        resetDialogForm();
                        setShowAddDialog(false);
                    }} className="p-button-text" />
                    <Button
                        label="Kirim Undangan"
                        icon="pi pi-send"
                        disabled={!selectedUser || !selectedRole}
                        onClick={confirmSendInvitation}
                    />
                </div>
            } visible={showAddDialog} style={{ width: '450px' }} onHide={() => {
                resetDialogForm();
                setShowAddDialog(false);
            }}
                header="Undang Pengguna" modal className='p-fluid'>
                <div className='field'>
                    <label htmlFor="nama">Cari Pengguna <span className='text-red-600'>*</span></label>
                    <InputText
                        id="nama"
                        placeholder='Ketik minimal 3 huruf dari nama pengguna'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="mt-2">
                        {searchLoading && (
                            <div className="flex align-items-center gap-2">
                                <ProgressSpinner style={{ width: '25px', height: '25px' }} strokeWidth="4" />
                                <span className="text-sm text-gray-500">Mencari pengguna...</span>
                            </div>
                        )}

                        {!searchLoading && searchResults.length > 0 && (
                            <Dropdown
                                value={selectedUser}
                                options={searchResults.map(u => ({ label: `${u.fullname} (${u.email})`, value: u }))}
                                onChange={(e) => setSelectedUser(e.value)}
                                placeholder="Pilih pengguna"
                                className="w-full"
                            />
                        )}

                        {!searchLoading && debouncedQuery && searchResults.length === 0 && (
                            <div className="mt-2 text-sm text-gray-500">Tidak ada pengguna ditemukan</div>
                        )}
                    </div>

                </div>

                <div className="field mt-3">
                    <label htmlFor="role">Role <span className='text-red-600'>*</span></label>
                    <Dropdown
                        value={selectedRole}
                        options={allRoles}
                        onChange={(e) => setSelectedRole(e.value)}
                        placeholder="Pilih Role"
                        className="w-full"
                    />

                </div>


            </Dialog>

            <Dialog
                header="Daftar Undangan"
                visible={showInvitationDialog}
                className="w-full sm:w-7"
                onHide={() => setShowInvitationDialog(false)}
                modal
                draggable={false}
            >
                <div className="mb-3">
                    <Dropdown
                        value={invitationStatusFilter}
                        options={[
                            { label: 'Semua', value: 'semua' },
                            { label: 'Menunggu', value: 'pending' },
                            { label: 'Diterima', value: 'accepted' },
                            { label: 'Ditolak', value: 'rejected' },
                        ]}
                        onChange={(e) => {
                            setInvitationStatusFilter(e.value);
                            setInvitationPage(1);
                        }}
                        placeholder="Filter Status"
                        showClear
                        className="w-full md:w-20rem"
                    />
                </div>

                <DataTable
                    value={invitations}
                    paginator
                    responsiveLayout="scroll"
                    rows={invitationPerPage}
                    totalRecords={totalInvitations}
                    onPage={(e) => {
                        setInvitationPage((e.page ?? 0) + 1);
                        setInvitationPerPage(e.rows ?? invitationPerPage);
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    lazy
                    stripedRows
                    tableStyle={{ minWidth: '100%' }}
                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} undangan"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    emptyMessage={
                        loadingInvitations ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data undangan...</span>
                            </div>
                        ) : invitations.length === 0 ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-inbox text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Tidak ada undangan ditemukan</span>
                            </div>
                        ) : null
                    }
                >
                    <Column field="receiver.fullname" header="Pengguna yang Diundang" />
                    <Column
                        header="Role"
                        body={(rowData) => {
                            const roleName = rowData.role_to_assign?.name;

                            const roleLabelMap: Record<string, string> = {
                                school_admin: 'Owner',
                                school_coadmin: 'Admin Sekolah',
                                school_staff: 'Staff Sekolah',
                                super_admin: 'Super Admin',
                            };

                            return roleLabelMap[roleName] || (
                                roleName
                                    ?.replace(/_/g, ' ')
                                    ?.replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? '-'
                            );
                        }}
                    />

                    <Column field="sender.fullname" header="Yang Mengundang" />
                    <Column
                        header="Tanggal Diundang"
                        body={(rowData) => new Date(rowData.created_at).toLocaleString("id-ID")}
                    />
                    <Column
                        header="Tanggal Direspon"
                        body={(rowData) =>
                            rowData.status !== 'pending'
                                ? new Date(rowData.updated_at).toLocaleString("id-ID")
                                : '-'
                        }
                    />
                    <Column
                        header="Status"
                        body={(rowData) => {
                            const status = rowData.status;
                            const severityMap: Record<string, 'warning' | 'success' | 'danger'> = {
                                pending: 'warning',
                                accepted: 'success',
                                rejected: 'danger',
                            };

                            return (
                                <Badge
                                    value={statusLabels[status] || status}
                                    severity={severityMap[status]}
                                />
                            );
                        }}
                    />
                </DataTable>
            </Dialog>



        </>
    );
};

export default SchoolUsersPage;
