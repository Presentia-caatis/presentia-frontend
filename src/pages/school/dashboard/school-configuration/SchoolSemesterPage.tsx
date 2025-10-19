/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SchoolSemesterPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import semesterService, { SemesterPayload, MigrationConfig } from "../../../../services/semesterService";
import { ProgressSpinner } from "primereact/progressspinner";

type Semester = {
    id: number;
    academic_year: string;
    period: "odd" | "even";
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

const toYMD = (d?: Date | null) => {
    if (!d) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const fromYMD = (s?: string) => (s ? new Date(s) : null);
const periodLabel = (p?: "odd" | "even") => (p === "odd" ? "Ganjil" : "Genap");
const periodOptions = [
    { label: "Ganjil", value: "odd" },
    { label: "Genap", value: "even" },
];

export default function SchoolSemesterPage() {
    const toast = useRef<Toast>(null);

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<Semester[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [current, setCurrent] = useState<Semester | null>(null);

    const [showEditor, setShowEditor] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<SemesterPayload>({
        academic_year: "",
        period: "odd",
    });
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [migration, setMigration] = useState<MigrationConfig>({
        copy_all_check_in_status: false,
        copy_all_check_out_status: false,
        copy_all_absence_permit_type: false
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const [listRes, curRes] = await Promise.all([
                semesterService.getAll(page, perPage),
                semesterService.getCurrent().catch(() => null),
            ]);

            const listData = listRes?.data ?? listRes ?? {};
            const rows: Semester[] = listData.data ?? listData?.data?.data ?? listData ?? [];
            setItems(rows);
            setTotal(listData.total ?? listData?.data?.total ?? rows.length);

            const cur = curRes?.data ?? curRes ?? null;
            setCurrent(cur);
        } catch (e: any) {
            console.log(e);
            setCurrent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [page, perPage]);

    const onPage = (e: DataTablePageEvent) => {
        setPage((e.page ?? 0) + 1);
        setPerPage(e.rows);
    };

    const openCreate = () => {
        setIsEdit(false);
        setEditId(null);
        setForm({ academic_year: "", period: "odd" });
        setDateRange([null, null]);
        setMigration({
            copy_all_check_in_status: false,
            copy_all_check_out_status: false,
            copy_all_absence_permit_type: false
        });
        setShowEditor(true);
    };

    const openEdit = async (row: Semester) => {
        setIsEdit(true);
        setEditId(row.id);
        setForm({
            academic_year: row.academic_year,
            period: row.period,
            start_date: row.start_date,
            end_date: row.end_date,
            is_active: row.is_active,
        });
        setDateRange([fromYMD(row.start_date), fromYMD(row.end_date)]);
        setShowEditor(true);
    };

    const canSave = useMemo(() => {
        if (!form.academic_year || !form.period) return false;
        const [s, e] = dateRange;
        return !!(s && e);
    }, [form, dateRange]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const [s, e] = dateRange;
            const payload: SemesterPayload = {
                academic_year: form.academic_year?.trim(),
                period: form.period,
                start_date: toYMD(s!),
                end_date: toYMD(e!),
            };

            if (isEdit && editId) {
                await semesterService.update(editId, payload);
                toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Semester diperbarui.", life: 2500 });
            } else {
                await semesterService.create(payload as Required<SemesterPayload>, migration);
                toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Semester ditambahkan.", life: 2500 });
            }

            setShowEditor(false);
            await load();
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Gagal menyimpan semester.";
            toast.current?.show({ severity: "error", summary: "Gagal", detail: msg, life: 3000 });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (row: Semester) => {
        confirmDialog({
            message: `Hapus semester ${row.academic_year} - ${periodLabel(row.period)}?`,
            header: "Konfirmasi Hapus",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await semesterService.delete(row.id);
                    toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Semester dihapus.", life: 2000 });
                    await load();
                } catch (err: any) {
                    const msg = err?.response?.data?.message ?? "Gagal menghapus semester.";
                    toast.current?.show({ severity: "error", summary: "Gagal", detail: msg, life: 3000 });
                }
            }
        });
    };

    const handleActivate = async (row: Semester) => {
        try {
            await semesterService.toggleActive(row.id);
            toast.current?.show({ severity: "success", summary: "Aktifkan Semester", detail: "Status aktif berhasil diubah.", life: 2000 });
            await load();
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? "Gagal mengubah status aktif.";
            toast.current?.show({ severity: "error", summary: "Gagal", detail: msg, life: 3000 });
        }
    };

    return (
        <div className="p-4 flex card flex-column gap-4">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex justify-content-between align-items-center">
                <h1 className="m-0">Manajemen Semester</h1>
                <Button
                    label="Tambah Semester"
                    icon="pi pi-plus"
                    severity="help"
                    className="p-button-rounded"
                    onClick={openCreate}
                />
            </div>

            <div >
                {loading ? (
                    <div className="flex flex-column align-items-center gap-3 py-4">
                        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                        <span className="text-gray-500 font-semibold">Memuat data semester aktif...</span>
                    </div>
                ) : current ? (
                    <div className="grid">
                        <div className="col-12 md:col-3"><strong>Tahun Akademik</strong><br />{current.academic_year}</div>
                        <div className="col-12 md:col-3"><strong>Periode</strong><br /><Tag value={periodLabel(current.period)} severity={current.period === "odd" ? "info" : "success"} /></div>
                        <div className="col-12 md:col-3"><strong>Mulai</strong><br />{current.start_date}</div>
                        <div className="col-12 md:col-3"><strong>Selesai</strong><br />{current.end_date}</div>
                    </div>
                ) : (
                    <div className="text-color-secondary">Belum ada semester aktif pada tanggal saat ini.</div>
                )}
            </div>


            <div>

                <DataTable
                    value={items}
                    paginator
                    rows={perPage}
                    totalRecords={total}
                    lazy
                    first={(page - 1) * perPage}
                    onPage={onPage}
                    rowsPerPageOptions={[10, 20, 50]}
                    responsiveLayout="scroll"
                    rowHover
                    size="small"
                    emptyMessage={
                        loading ? (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                <span className="text-gray-500 font-semibold">Memuat data semester...</span>
                            </div>
                        ) : (
                            <div className="flex flex-column align-items-center gap-3 py-4">
                                <i className="pi pi-calendar-times text-gray-400" style={{ fontSize: "2rem" }} />
                                <span className="text-gray-500 font-semibold">Belum ada data semester</span>
                                <small className="text-gray-400">Silakan tambahkan melalui tombol “Tambah Semester”.</small>
                            </div>
                        )
                    }
                >
                    <Column field="academic_year" header="Tahun Akademik" sortable />
                    <Column header="Periode" body={(row: Semester) => (
                        <Tag value={periodLabel(row.period)} severity={row.period === "odd" ? "info" : "success"} />
                    )} />
                    <Column field="start_date" header="Mulai" />
                    <Column field="end_date" header="Selesai" />
                    <Column header="Aktif" body={(row: Semester) => (
                        row.is_active
                            ? <Tag value="Aktif" severity="success" />
                            : <Tag value="Nonaktif" severity="secondary" />
                    )} />
                    <Column header="Aksi" body={(row: Semester) => (
                        <div className="flex gap-2">
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    rounded
                                    severity="success"
                                    aria-label="Edit"
                                    onClick={() => openEdit(row)}
                                    tooltip="Edit"
                                    className="p-button-sm"
                                />
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    severity="danger"
                                    aria-label="Hapus"
                                    onClick={() => handleDelete(row)}
                                    tooltip="Hapus"
                                    disabled={row.is_active}
                                    className="p-button-sm"
                                />
                                <Button
                                    icon={row.is_active ? "pi pi-stop" : "pi pi-check-square"}
                                    rounded
                                    severity="help"
                                    outlined
                                    aria-label={row.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    onClick={() => handleActivate(row)}
                                    tooltip={row.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    className="p-button-sm"
                                />
                            </div>
                        </div>
                    )} />
                </DataTable>
            </div>

            <Dialog
                header={isEdit ? "Ubah Semester" : "Tambah Semester"}
                visible={showEditor}
                style={{ width: "550px" }}
                onHide={() => setShowEditor(false)}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button label="Batal" className="p-button-text" onClick={() => setShowEditor(false)} />
                        <Button label={isEdit ? "Simpan" : "Tambah"} icon="pi pi-check" loading={saving} disabled={!canSave} onClick={handleSave} />
                    </div>
                }
                modal
            >
                <div className="flex flex-column gap-3">
                    <div className="field">
                        <label>Tahun Akademik</label>
                        <InputText
                            value={form.academic_year ?? ""}
                            onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                            placeholder="Contoh: 2025/2026"
                        />
                    </div>

                    <div className="field">
                        <label>Periode</label>
                        <Dropdown
                            value={form.period ?? "odd"}
                            options={periodOptions}
                            onChange={(e) => setForm({ ...form, period: e.value })}
                            placeholder="Pilih Periode"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label>Rentang Tanggal</label>
                        <Calendar
                            selectionMode="range"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value as [Date | null, Date | null])}
                            dateFormat="yy-mm-dd"
                            readOnlyInput
                            className="w-full"
                            placeholder="Pilih tanggal mulai & selesai"
                        />
                        {dateRange?.[0] && dateRange?.[1] && (
                            <small className="text-color-secondary">
                                Mulai: {toYMD(dateRange[0])} • Selesai: {toYMD(dateRange[1])}
                            </small>
                        )}
                    </div>

                    {!isEdit && (
                        <div className="field">
                            <label>Salin Data (opsional)</label>
                            <div className="flex flex-column gap-2 mt-2">
                                <div className="flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="ckin"
                                        checked={!!migration.copy_all_check_in_status}
                                        onChange={(e) => setMigration({ ...migration, copy_all_check_in_status: e.target.checked })}
                                    />
                                    <label htmlFor="ckin">Salin status Check-In</label>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="ckout"
                                        checked={!!migration.copy_all_check_out_status}
                                        onChange={(e) => setMigration({ ...migration, copy_all_check_out_status: e.target.checked })}
                                    />
                                    <label htmlFor="ckout">Salin status Check-Out</label>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="permit"
                                        checked={!!migration.copy_all_absence_permit_type}
                                        onChange={(e) => setMigration({ ...migration, copy_all_absence_permit_type: e.target.checked })}
                                    />
                                    <label htmlFor="permit">Salin jenis Izin/Absensi</label>
                                </div>
                                <small className="text-color-secondary">
                                    Opsi ini menyalin konfigurasi dari semester sebelumnya sesuai aturan backend.
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
