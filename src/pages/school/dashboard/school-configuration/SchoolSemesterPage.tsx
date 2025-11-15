/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar, CalendarProps } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import semesterService, { SemesterPayload, MigrationConfig } from "../../../../services/semesterService";
import { ProgressSpinner } from "primereact/progressspinner";
import { addHours } from "date-fns";

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

const ACADEMIC_YEAR_REGEX = /^[0-9]{4}\/[0-9]{4}$/;

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
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const [showEditor, setShowEditor] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<SemesterPayload>({
        academic_year: "",
        period: "odd",
    });
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
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
            setItems([]);
            setTotal(0);
            setCurrent(null);
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
        setStartDate(null);
        setEndDate(null);
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
        setStartDate(fromYMD(row.start_date));
        setEndDate(fromYMD(row.end_date));
        setShowEditor(true);
    };


    const canSave = useMemo(() => {
        if (errors.academic_year) return false;
        if (!form.academic_year || !form.period) return false;
        return !!(startDate && endDate);
    }, [form, errors, startDate, endDate]);


    const handleSave = async () => {
        if (!startDate || !endDate) return;

        try {
            setSaving(true);

            const payload: SemesterPayload = {
                academic_year: form.academic_year?.trim(),
                period: form.period,
                start_date: toYMD(startDate),
                end_date: toYMD(endDate),
            };

            if (isEdit && editId) {
                await semesterService.update(editId, payload);
                toast.current?.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Semester diperbarui.",
                    life: 2500
                });
            } else {
                await semesterService.create(payload as Required<SemesterPayload>, migration);
                toast.current?.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Semester ditambahkan.",
                    life: 2500
                });
            }

            setShowEditor(false);
            await load();
        } catch (err: any) {
            const apiErrors = err?.response?.data?.errors;

            setErrors({});

            if (apiErrors?.date_range) {
                setErrors(prev => ({
                    ...prev,
                    date_range: apiErrors.date_range[0],
                }));
            }
            const msg =
                apiErrors?.date_range?.[0] ||
                err?.response?.data?.message ||
                "Gagal menyimpan semester.";

            toast.current?.show({
                severity: "error",
                summary: "Gagal",
                detail: msg,
                life: 3000
            });
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

    const handleStartDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setStartDate(localDate);

            if (endDate && localDate > endDate) {
                setEndDate(localDate);
            }
        }
    };

    const handleEndDateChange: CalendarProps["onChange"] = (e) => {
        if (e.value instanceof Date) {
            const localDate = addHours(e.value, -e.value.getTimezoneOffset() / 60);
            setEndDate(localDate);
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
                    className="p-button"
                    onClick={openCreate}
                />
            </div>

            <div>
                {loading ? (
                    <div className="flex flex-column align-items-center gap-3 py-4">
                        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                        <span className="text-gray-500 font-semibold">
                            Memuat data semester aktif...
                        </span>
                    </div>
                ) : current ? (
                    <div className="card surface-0 shadow-2 border-round-xl p-4 mb-4">
                        <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-3">
                            <div>
                                <small className="text-xs text-color-secondary">
                                    Semester aktif saat ini
                                </small>
                                <div className="flex gap-2">
                                    <h3 className="mt-1 mb-1 text-900">
                                        {current.academic_year}

                                    </h3>
                                    <div className="my-auto">
                                        <Tag
                                            value={periodLabel(current.period)}
                                            className="px-3 py-1 border-round-2xl text-xs bg-blue-100 text-blue-700"
                                        />
                                    </div>
                                </div>
                                <Tag
                                    value="Aktif"
                                    severity="success"
                                    className="mt-2 px-3 py-1 border-round-2xl text-xs"
                                />
                            </div>

                        </div>

                        <div className="flex flex-column md:flex-row gap-3 mt-2">
                            <div className="flex align-items-center gap-2 flex-1">
                                <i className="pi pi-calendar-plus text-primary text-lg" />
                                <div>
                                    <div className="text-xs text-color-secondary">Mulai</div>
                                    <div className="font-medium text-900">
                                        {current.start_date}
                                    </div>
                                </div>
                            </div>

                            <div className="flex align-items-center gap-2 flex-1">
                                <i className="pi pi-calendar-minus text-pink-500 text-lg" />
                                <div>
                                    <div className="text-xs text-color-secondary">Selesai</div>
                                    <div className="font-medium text-900">
                                        {current.end_date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-color-secondary">
                        Belum ada semester aktif pada tanggal saat ini.
                    </div>
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
                        <Tag className="px-3 py-1 border-round-2xl text-xs bg-blue-100 text-blue-700" value={periodLabel(row.period)} />
                    )} />
                    <Column field="start_date" header="Mulai" />
                    <Column field="end_date" header="Selesai" />
                    <Column header="Aktif" body={(row: Semester) => (
                        row.is_active
                            ? <Tag className="px-3 py-1 border-round-2xl text-xs" value="Aktif" severity="success" />
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
                                    className={`p-button-sm ${row.is_active ? "hidden" : "block"}`}
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
                        <br />
                        <InputText
                            value={form.academic_year ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setForm({ ...form, academic_year: value });

                                setErrors({
                                    ...errors,
                                    academic_year: !ACADEMIC_YEAR_REGEX.test(value)
                                        ? "Format harus YYYY/YYYY"
                                        : null
                                });
                            }}
                            className={errors.academic_year ? "p-invalid" : ""}
                            placeholder="Contoh: 2025/2026"
                        />

                        <small className="p-error text-sm" style={{ marginLeft: "4px" }}>
                            {errors.academic_year}
                        </small>
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
                        <div className="flex gap-2">
                            <div>
                                <Calendar
                                    id="startDate"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    maxDate={endDate ?? undefined}
                                    readOnlyInput
                                    className="w-full"
                                    placeholder="Tanggal Awal"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                            <div className="my-auto">
                                -
                            </div>
                            <div>
                                <Calendar
                                    id="endDate"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    minDate={startDate ?? undefined}
                                    readOnlyInput
                                    className="w-full"
                                    placeholder="Tanggal Akhir"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                        </div>

                        {startDate && endDate && (
                            <small className="text-color-secondary">
                                Mulai: {toYMD(startDate)} • Selesai: {toYMD(endDate)}
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
                                    Opsi ini menyalin konfigurasi dari semester sebelumnya.
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
