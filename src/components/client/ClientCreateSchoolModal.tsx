import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

type ClientCreateSchoolModalProps = {
    onClose: () => void;
    onSave: (newSchool: {
        id: number;
        name: string;
        plan: string;
        dueDate: string;
        role: string;
        status: string;
    }) => void;
    visible: boolean;
};

const ClientCreateSchoolModal: React.FC<ClientCreateSchoolModalProps> = ({
    onClose,
    onSave,
    visible,
}) => {
    const [currentStep, setCurrentStep] = useState<"purchase" | "payment">(
        "purchase"
    );
    const [schoolName, setSchoolName] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        string | null
    >(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState<"cancel" | "purchase">("cancel");


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

    const getSelectedPlanFeatures = () => plans.find(plan => plan.value === selectedPlan)?.features || [];
    const getPlanPrice = () => plans.find(plan => plan.value === selectedPlan)?.price || 0;
    const calculateTotalPrice = () => {
        const pricePerMonth = getPlanPrice();
        return pricePerMonth * (selectedDuration || 0);
    };

    const handleSave = () => {
        if (currentStep === "purchase") {
            if (selectedPlan !== "Free") {
                setCurrentStep("payment");
            } else {
                onClose();
            }
        } else {
            const newSchool = {
                id: Date.now(),
                name: schoolName,
                plan: selectedPlan || "Free",
                dueDate: selectedPlan === "Free" ? "-" : `${selectedDuration} bulan`,
                role: "admin",
                status: "Active",
            };

            onSave(newSchool);
            resetState();
        }
    };

    const resetState = () => {
        setSchoolName("");
        setSelectedPlan(null);
        setSelectedDuration(null);
        setSelectedPaymentMethod(null);
        setCurrentStep("purchase");
    };

    const handleConfirmDialog = (type: "cancel" | "purchase") => {
        setConfirmDialogType(type);
        if (selectedPlan === "Free" || type === "cancel") {
            setConfirmDialogVisible(true);
        } else {
            setCurrentStep('payment');
        }

        if (currentStep === "payment" && type === "purchase") {
            setConfirmDialogVisible(true);
        }
    };

    const handleConfirmAction = () => {
        if (confirmDialogType === "cancel") {
            resetState();
            onClose();
        } else if (confirmDialogType === "purchase") {
            handleSave();
            onClose();
        }
        setConfirmDialogVisible(false);
    };

    const confirmDialogHeader = confirmDialogType === "cancel" ? "Konfirmasi Pembatalan" : "Konfirmasi Pembelian";
    const confirmDialogMessage = confirmDialogType === "cancel"
        ? "Apakah Anda yakin ingin membatalkan proses ini?"
        : "Apakah Anda yakin ingin menyelesaikan proses pembelian ini?";
    const confirmDialogFooter = (
        <div>
            <Button label="Tidak" icon="pi pi-times" onClick={() => setConfirmDialogVisible(false)} className="p-button-text" />
            <Button label="Ya" icon="pi pi-check" onClick={handleConfirmAction} autoFocus />
        </div>
    );

    return (
        <>
            <Dialog
                header={currentStep === "purchase" ? "Tambah Sekolah Baru" : "Pembayaran"}
                visible={visible}
                style={{ width: "60vw" }}
                breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                modal
                onHide={() => {
                    handleConfirmDialog("cancel")
                }}
                footer={
                    <div className="flex justify-content-end">

                        {currentStep === "payment" ? (
                            <Button
                                label="Kembali"
                                icon="pi pi-arrow-left"
                                className="p-button-text"
                                onClick={() => setCurrentStep("purchase")}
                            />
                        ) : (<Button
                            label="Batal"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => handleConfirmDialog("cancel")}
                        />)}


                        {currentStep === "purchase" ? (
                            <Button
                                label={selectedPlan === "Free" ? "Buat Sekolah" : "Lanjutkan"}
                                icon="pi pi-arrow-right"
                                className="p-button"
                                onClick={() => handleConfirmDialog("purchase")}
                                disabled={
                                    !schoolName ||
                                    !selectedPlan ||
                                    (selectedPlan !== "Free" && !selectedDuration)
                                }
                            />
                        ) : (
                            <Button
                                label="Selesaikan dan Bayar"
                                icon="pi pi-check"
                                className="p-button"
                                onClick={() => handleConfirmDialog("purchase")}
                                disabled={!selectedPaymentMethod}
                            />
                        )}
                    </div>
                }
            >
                {currentStep === "purchase" ? (
                    <div className="grid">
                        <div className="col-12 ">
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
                        <div className="col-12 ">
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
                        <div className="col-12 ">
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
                ) : (
                    <div>
                        <div className="p-3 border-1 mb-3 border-round surface-border">
                            <h5>Detail Sekolah</h5>
                            <p>Nama: {schoolName}</p>
                            <p>Paket: {selectedPlan}</p>
                            <p>Durasi: {selectedDuration} bulan</p>
                        </div>
                        <div className="p-3 border-1 border-round surface-border">
                            <h5>Ringkasan</h5>
                            <div className="flex justify-content-between">
                                <span>Subtotal</span>
                                <span>{`Rp ${getPlanPrice().toLocaleString()} / bulan`}</span>
                            </div>
                            <div className="flex justify-content-between mt-2 font-bold">
                                <span>Total</span>
                                <span>{`Rp ${calculateTotalPrice().toLocaleString()}`}</span>
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <label htmlFor="payment" className="block mb-2">
                                Pilih Metode Pembayaran
                            </label>
                            <Dropdown
                                id="payment"
                                value={selectedPaymentMethod}
                                options={paymentMethods}
                                onChange={(e) => setSelectedPaymentMethod(e.value)}
                                placeholder="Pilih metode pembayaran"
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <Dialog
                header={confirmDialogHeader}
                visible={confirmDialogVisible}
                style={{ width: '30vw' }}
                modal
                footer={confirmDialogFooter}
                onHide={() => setConfirmDialogVisible(false)}
            >
                <p>{confirmDialogMessage}</p>
            </Dialog>
        </>
    );
};

export default ClientCreateSchoolModal;
