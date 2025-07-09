/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import schoolInviationService from '../../../services/schoolInviationService';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { statusLabels } from '../../../utils/statusLabel';
import { ProgressSpinner } from 'primereact/progressspinner';
import defaultLogoSekolah from '../../../assets/defaultLogoSekolah.png';
import authService from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';


const UserInvitationPage = () => {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { setAuth, token } = useAuth();

    useEffect(() => {
        fetchInvitations();
    }, []);

    const roleLabels: Record<string, string> = {
        super_admin: 'Super Admin',
        school_staff: 'Staf Sekolah',
        school_admin: 'Pemilik Sekolah',
        school_coadmin: 'Admin Sekolah',
    };


    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const response = await schoolInviationService.getByReceiver();
            setInvitations(response.data.data);
        } catch (error) {
            console.error("Gagal memuat undangan:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (id: number, school_id: number, status: 'accepted' | 'rejected') => {
        try {
            await schoolInviationService.respondInvitation(id, {
                status,
                school_id
            });
            fetchInvitations();
            if (status === 'accepted') {
                const userProfile = await authService.getProfile();
                if (token) {
                    setAuth(userProfile.data, token);
                }
            }
        } catch (error) {
            console.error(`Gagal ${status === 'accepted' ? 'menerima' : 'menolak'} undangan:`, error);
        }
    };


    const statusTemplate = (rowData: any) => {
        const severity =
            rowData.status === 'accepted'
                ? 'success'
                : rowData.status === 'rejected'
                    ? 'danger'
                    : 'warning';

        const label = statusLabels[rowData.status] || rowData.status;
        return <Tag value={label} severity={severity} />;
    };


    const roleTemplate = (rowData: any) => {
        const roleName = rowData.role_to_assign?.name;
        return roleLabels[roleName] || roleName || '-';
    };


    const schoolTemplate = (rowData: any) => {
        const logoUrl = rowData.school?.logo_image_path;

        return (
            <div className="flex items-center gap-3">
                <img
                    src={logoUrl}
                    alt="Logo Sekolah"
                    className="w-4rem h-4rem rounded object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultLogoSekolah;
                    }}
                />
                <div className="flex flex-column justify-center">
                    <h4 className="font-semibold my-0">{rowData.school?.name || '-'}</h4>
                    <div>
                        <small className="text-sm text-gray-500">{rowData.school?.address || ''}</small>
                    </div>
                </div>
            </div>
        );
    };

    const actionTemplate = (rowData: any) => {
        if (rowData.status !== 'pending') return null;

        const confirmAccept = (event: any) => {
            confirmPopup({
                target: event.currentTarget,
                message: 'Terima undangan ini?',
                icon: 'pi pi-check-circle',
                acceptClassName: 'p-button-success',
                acceptLabel: 'Ya',
                rejectLabel: 'Batal',
                accept: () => handleRespond(rowData.id, rowData.school_id, 'accepted'),
            });
        };

        const confirmReject = (event: any) => {
            confirmPopup({
                target: event.currentTarget,
                message: 'Tolak undangan ini?',
                icon: 'pi pi-times-circle',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Ya',
                rejectLabel: 'Batal',
                accept: () => handleRespond(rowData.id, rowData.school_id, 'rejected'),
            });
        };

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-check"
                    className="p-button-sm p-button-success"
                    tooltip="Terima Undangan"
                    onClick={confirmAccept}
                />
                <Button
                    icon="pi pi-times"
                    className="p-button-sm p-button-danger"
                    tooltip="Tolak Undangan"
                    onClick={confirmReject}
                />
            </div>
        );
    };

    return (
        <div className="card">
            <ConfirmPopup />
            <h3 className="mb-4">Undangan Sekolah</h3>
            <DataTable
                value={invitations}
                dataKey="id"
                paginator
                rows={10}
                emptyMessage={
                    loading ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            <span className="text-gray-500 font-semibold">Memuat data undangan...</span>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-filter-slash text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Tidak ada undangan yang sesuai dengan pencarian Anda</span>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-3 py-4">
                            <i className="pi pi-users text-gray-400" style={{ fontSize: "2rem" }} />
                            <span className="text-gray-500 font-semibold">Tidak ada undangan</span>
                        </div>
                    )
                }
            >
                <Column header="Sekolah" body={schoolTemplate} />
                <Column header="Peran" body={roleTemplate} sortable />
                <Column field="sender.fullname" header="Yang Mengundang" sortable />
                <Column field="status" header="Status" body={statusTemplate} />
                <Column body={actionTemplate} />
            </DataTable>
        </div>
    );
};

export default UserInvitationPage;