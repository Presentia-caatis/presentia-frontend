import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import defaultLogoSekolah from '../../assets/defaultLogoSekolah.png';
import userService from "../../services/userService";
import schoolService from "../../services/schoolService";

type OwnerData = {
    fullname: string;
    id: string;
    email: string;
};


type AdminCreateSchoolModalProps = {
    onClose: () => void;
    onSave: (newSchool: {
        id: number;
        name: string;
        plan: string;
        dueDate: string;
        owner: string;
        status: string;
    }) => void;
    visible: boolean;
};

const AdminCreateSchoolModal: React.FC<AdminCreateSchoolModalProps> = ({
    onClose,
    onSave,
    visible,
}) => {
    const [unassignedUsers, setUnassignedUsers] = useState<OwnerData[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [schoolData, setSchoolData] = useState<{ name: string; address: string; owner: OwnerData | null; logo_image: File | null }>({ name: '', address: '', owner: null, logo_image: null });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    //     string | null
    // >(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // const plans = [
    //     { label: 'Free', value: 'Free', price: 0, features: ['Basic support', 'Limited features'] },
    //     { label: 'Standard', value: 'Standard', price: 100000, features: ['Priority support', 'All features', '10 GB storage'] },
    //     { label: 'Premium', value: 'Premium', price: 200000, features: ['24/7 support', 'Unlimited features', '100 GB storage', 'Custom branding'] },
    // ];

    // const durations = [
    //     { label: "1 Bulan", value: 1 },
    //     { label: "6 Bulan", value: 6 },
    //     { label: "1 Tahun", value: 12 },
    // ];

    // const paymentMethods = [
    //     { label: "QRIS", value: "QRIS" },
    //     { label: "Bank Transfer", value: "Bank Transfer" },
    // ];


    const itemTemplate = (option: OwnerData) => {
        return (
            <div>{`${option.fullname} - ${option.id} - ${option.email}`}</div>
        );
    };

    const handleRemoveLogo = () => {
        setImagePreview(null);
        setLogoImage(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Format tidak valid',
                    detail: 'Logo harus berupa file JPG, JPEG, atau PNG.',
                    life: 3000
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setSchoolData({ ...schoolData, logo_image: file });

                event.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    // const getSelectedPlanFeatures = () => plans.find(plan => plan.value === selectedPlan)?.features || [];
    // const getPlanPrice = () => plans.find(plan => plan.value === selectedPlan)?.price || 0;
    // const calculateTotalPrice = () => {
    //     const pricePerMonth = getPlanPrice();
    //     return pricePerMonth * (selectedDuration || 0);
    // };

    useEffect(() => {
        if (visible) {
            getUnassignedUsers();
        }
    }, [visible]);


    const getUnassignedUsers = async () => {
        const response = await userService.getUnassignedUsers();

        if (response.status === 200) {
            setUnassignedUsers(response.responseData.data.data);
        } else {
            console.error("Failed to fetch unassigned users");
        }
    }


    const createSchool = async () => {

        try {
            setLoading(true);
            if (!schoolData.owner) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Pemilik sekolah harus dipilih.',
                    life: 3000
                });
                return;
            }

            if (!schoolData.name || !schoolData.address) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Nama dan alamat sekolah harus diisi.',
                    life: 3000
                });
                return;
            }

            if (!schoolData.logo_image) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: 'Logo sekolah harus diunggah.',
                    life: 3000
                });
                return;
            }
            const response = await schoolService.create({
                name: schoolData.name,
                address: schoolData.address,
                timezone: 'Asia/Jakarta',
                user_id: Number(schoolData.owner.id),
                logo_image: schoolData.logo_image,
            });


            // const newSchool = {
            //     id: response.responseData.data.id,
            //     name: response.responseData.data.name,
            //     plan: 'Free', // Assuming default plan is Free
            //     dueDate: response.responseData.data.latest_subscription || '',
            //     owner: schoolData.owner.fullname,
            //     status: response.responseData.data.status || 'active',
            // };
            // onSave(newSchool);
            toast.current?.show({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Sekolah berhasil dibuat.',
                life: 3000
            });

        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Terjadi kesalahan saat membuat sekolah.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }

    }



    const handleSave = async () => {
        await createSchool();
        // resetState();
    };

    const resetState = () => {
        setSchoolData({ name: '', address: '', owner: null, logo_image: null });
        setImagePreview(null);
        // setSelectedPlan(null);
        // setSelectedDuration(null);
        // setSelectedPaymentMethod(null);
    };



    return (
        <Dialog
            draggable={false}
            header={"Tambah Sekolah Baru"}
            visible={visible}
            style={{ width: "60vw" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            modal
            onHide={() => {
                resetState();
                onClose();
            }}
            footer={
                <div className="flex justify-content-end">
                    <Button
                        label="Batal"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => {
                            resetState();
                            onClose();
                        }}
                    />

                    <Button
                        label="Tambahkan"
                        icon="pi pi-arrow-right"
                        className="p-button"
                        onClick={handleSave}
                        loading={loading}
                        disabled={
                            !schoolData.owner ||
                            !schoolData.name ||
                            !schoolData.address ||
                            !schoolData.logo_image ||
                            loading
                        }
                    />

                </div>
            }
        >
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12 mb-3">
                    <label htmlFor="owner" className="block mb-2">
                        Pemilik Sekolah
                    </label>
                    <Dropdown
                        value={schoolData.owner}
                        onChange={(e) => setSchoolData({ ...schoolData, owner: e.value })}
                        options={unassignedUsers}
                        optionLabel="fullname"
                        placeholder="Pilih Pemilik"
                        filter
                        filterPlaceholder="Cari"
                        itemTemplate={itemTemplate}
                        className="w-full"
                    />
                </div>
                <div className="col-12">
                    <div className="field">
                        <label>Logo Sekolah</label>
                        <div className="flex  items-center gap-4">
                            <div >
                                <img loading="lazy" src={imagePreview || defaultLogoSekolah} alt="" className='w-5rem h-5rem border-circle' onError={(e) => {
                                    (e.target as HTMLImageElement).src = defaultLogoSekolah;
                                }} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className='my-auto flex gap-2'>
                                    <Button disabled={loading} label="Ganti Logo" icon="pi pi-upload" className="p-button-sm" onClick={handleAvatarClick} />
                                    <Button disabled={!imagePreview || loading} label="Hapus Logo" icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={handleRemoveLogo} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="name" className="block mb-2">
                        Nama Sekolah
                    </label>
                    <InputText
                        id="name"
                        value={schoolData.name}
                        onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                        className="w-full"
                        placeholder="Masukkan nama sekolah"
                    />
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="name" className="block mb-2">
                        Alamat Sekolah
                    </label>
                    <InputText
                        id="address"
                        value={schoolData.address}
                        onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                        className="w-full"
                        placeholder="Masukkan alamat sekolah"
                    />
                </div>
                {/* <div className="col-12 mb-3">
                    <label htmlFor="plan" className="block mb-2">
                        Pilih Paket
                    </label>
                    <Dropdown
                        id="plan"
                        value={selectedPlan}
                        options={plans}
                        onChange={(e) => setSelectedPlan(e.value)}
                        placeholder="Pilih paket"
                        className="w-full"
                    />
                </div> */}
                {/* <div className="col-12 mb-3">
                    <label htmlFor="duration" className="block mb-2">
                        Pilih Durasi
                    </label>
                    <Dropdown
                        id="duration"
                        value={selectedDuration}
                        options={durations}
                        onChange={(e) => setSelectedDuration(e.value)}
                        placeholder="Pilih durasi"
                        className="w-full"
                        disabled={selectedPlan === "Free"}
                    />
                </div> */}
                {/* {selectedPlan && (
                    <div className="col-12">
                        <div className="p-3 border-1 border-round surface-border">
                            <h5>Fitur Paket {selectedPlan}</h5>
                            <ul className="list-none m-0 p-0">
                                {getSelectedPlanFeatures().map((feature, index) => (
                                    <li key={index} className="flex align-items-center mb-2">
                                        <Checkbox
                                            checked
                                            className="mr-2"
                                            style={{ color: 'var(--primary-color)' }}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )} */}
                {/* <div className="col-12">
                    <div className="p-3 border-1 border-round surface-border">
                        <h5>Ringkasan</h5>
                        <div className="flex justify-content-between">
                            <span>Harga Paket</span>
                            <span>{`Rp ${getPlanPrice().toLocaleString()} / bulan`}</span>
                        </div>
                        <div className="flex justify-content-between mt-2">
                            <span>Durasi</span>
                            <span>{selectedPlan === 'Free' ? '-' : `${selectedDuration || '-'} bulan`}</span>
                        </div>
                        <div className="flex justify-content-between mt-2 font-bold">
                            <span>Total Harga</span>
                            <span>{selectedPlan === 'Free' ? 'Gratis' : `Rp ${calculateTotalPrice().toLocaleString()}`}</span>
                        </div>
                    </div>
                </div> */}
            </div>

        </Dialog>
    );
};

export default AdminCreateSchoolModal;
