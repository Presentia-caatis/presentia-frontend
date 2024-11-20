import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

type OwnerData = {
    name: string;
    nis: string;
    nisn: string;
    kelamin: string;
    status: string;
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
    const [schoolName, setSchoolName] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        string | null
    >(null);
    const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

    const plans = [
        { label: 'Free', value: 'Free', price: 0, features: ['Basic support', 'Limited features'] },
        { label: 'Standard', value: 'Standard', price: 100000, features: ['Priority support', 'All features', '10 GB storage'] },
        { label: 'Premium', value: 'Premium', price: 200000, features: ['24/7 support', 'Unlimited features', '100 GB storage', 'Custom branding'] },
    ];

    const durations = [
        { label: "1 Bulan", value: 1 },
        { label: "6 Bulan", value: 6 },
        { label: "1 Tahun", value: 12 },
    ];

    const paymentMethods = [
        { label: "QRIS", value: "QRIS" },
        { label: "Bank Transfer", value: "Bank Transfer" },
    ];


    const [userList, setUserList] = useState([
        {
            name: 'John John John',
            nis: '12345',
            nisn: '67890',
            kelamin: 'Laki-Laki',
            status: 'Active',
        },
        {
            name: 'Mon',
            nis: '12345',
            nisn: '67890',
            kelamin: 'Laki-Laki',
            status: 'Active',
        },
        {
            name: 'Staal',
            nis: '12345',
            nisn: '67890',
            kelamin: 'Laki-Laki',
            status: 'Active',
        }
    ]);

    const itemTemplate = (option: OwnerData) => {
        return (
            <div>{`${option.name} - ${option.nisn} - ${option.kelamin}`}</div>
        );
    };



    const getSelectedPlanFeatures = () => plans.find(plan => plan.value === selectedPlan)?.features || [];
    const getPlanPrice = () => plans.find(plan => plan.value === selectedPlan)?.price || 0;
    const calculateTotalPrice = () => {
        const pricePerMonth = getPlanPrice();
        return pricePerMonth * (selectedDuration || 0);
    };


    const handleSave = () => {

        const newSchool = {
            id: Date.now(),
            name: schoolName,
            plan: selectedPlan || "Free",
            dueDate: selectedPlan === "Free" ? "-" : `${selectedDuration} bulan`,
            owner: "admin",
            status: "Active",
        };

        onSave(newSchool);

        resetState();

    };

    const resetState = () => {
        setSchoolName("");
        setSelectedPlan(null);
        setSelectedDuration(null);
        setSelectedPaymentMethod(null);
        setSelectedOwner(null);
    };



    return (
        <Dialog
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
                        disabled={
                            !schoolName ||
                            !selectedPlan ||
                            (selectedPlan !== "Free" && !selectedDuration)
                        }
                    />

                </div>
            }
        >

            <div className="grid">
                <div className="col-12 mb-3">
                    <label htmlFor="owner" className="block mb-2">
                        Owner Sekolah
                    </label>
                    <Dropdown
                        value={selectedOwner}
                        onChange={(e) => setSelectedOwner(e.value)}
                        options={userList}
                        optionLabel="name"
                        placeholder="Pilih Owner"
                        filter
                        filterPlaceholder="Cari"
                        itemTemplate={itemTemplate}
                        className="w-full"
                    />
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="name" className="block mb-2">
                        Nama Sekolah
                    </label>
                    <InputText
                        id="name"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full"
                        placeholder="Masukkan nama sekolah"
                    />
                </div>
                <div className="col-12 mb-3">
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
                </div>
                <div className="col-12 mb-3">
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
                </div>
                {selectedPlan && (
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
                )}
                <div className="col-12">
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
                </div>
            </div>

        </Dialog>
    );
};

export default AdminCreateSchoolModal;
