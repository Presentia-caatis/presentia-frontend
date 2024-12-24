import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";

type Subscription = {
    id: number;
    name: string;
    pricePerMonth: number;
    pricePerYear: number;
    features: string[];
    isFeatured: boolean; // Determines if subscription is shown on the landing page
    displayOrder: number; // Order of display on landing page
};

type Feature = {
    id: number;
    name: string;
};

const AdminSubscriptionPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

    const [name, setName] = useState("");
    const [pricePerMonth, setPricePerMonth] = useState<number | null>(null);
    const [pricePerYear, setPricePerYear] = useState<number | null>(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [displayOrder, setDisplayOrder] = useState<number | null>(null);

    useEffect(() => {
        setSubscriptions([
            {
                id: 1,
                name: "Standard",
                pricePerMonth: 100000,
                pricePerYear: 1000000,
                features: ["Basic Support", "10GB Storage"],
                isFeatured: true,
                displayOrder: 1,
            },
            {
                id: 2,
                name: "Standard",
                pricePerMonth: 100000,
                pricePerYear: 1000000,
                features: ["Basic Support", "10GB Storage"],
                isFeatured: true,
                displayOrder: 2,
            },
            {
                id: 3,
                name: "Free",
                pricePerMonth: 100000,
                pricePerYear: 1000000,
                features: ["Basic Support", "10GB Storage", "10GB Storage", "10GB Storage", "10GB Storage",],
                isFeatured: true,
                displayOrder: 3,
            },
        ]);
        setFeatures([
            { id: 1, name: "Priority Support" },
            { id: 2, name: "Unlimited Storage" },
            { id: 3, name: "Custom Branding" },
        ]);
    }, []);

    const saveSubscription = () => {
        const newSubscription: Subscription = {
            id: editingSubscription ? editingSubscription.id : Date.now(),
            name,
            pricePerMonth: pricePerMonth || 0,
            pricePerYear: pricePerYear || 0,
            features: selectedFeatures.map((feature) => feature.name),
            isFeatured,
            displayOrder: displayOrder || subscriptions.length + 1,
        };

        if (editingSubscription) {
            setSubscriptions((prev) =>
                prev.map((sub) =>
                    sub.id === editingSubscription.id ? newSubscription : sub
                )
            );
        } else {
            setSubscriptions((prev) => [...prev, newSubscription]);
        }

        resetForm();
    };

    const resetForm = () => {
        setName("");
        setPricePerMonth(null);
        setPricePerYear(null);
        setSelectedFeatures([]);
        setIsFeatured(false);
        setDisplayOrder(null);
        setEditingSubscription(null);
        setDialogVisible(false);
    };

    const editSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setName(subscription.name);
        setPricePerMonth(subscription.pricePerMonth);
        setPricePerYear(subscription.pricePerYear);
        setSelectedFeatures(
            subscription.features.map((feature) =>
                features.find((f) => f.name === feature)
            )
        );
        setIsFeatured(subscription.isFeatured);
        setDisplayOrder(subscription.displayOrder);
        setDialogVisible(true);
    };

    const toggleFeatured = (id: number) => {
        setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === id ? { ...sub, isFeatured: !sub.isFeatured } : sub
            )
        );
    };

    return (
        <div>
            <Button
                label="Add Subscription"
                icon="pi pi-plus"
                onClick={() => setDialogVisible(true)}
            />
            <div className="grid mt-3">
                {subscriptions
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((subscription) => (
                        <div
                            key={subscription.id}
                            className="col-12 md:col-6 lg:col-4"
                        >
                            <Card
                                title={<div className="flex justify-content-between gap-1">
                                    <div>
                                        {subscription.name}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            onClick={() => editSubscription(subscription)}
                                            className="p-button-sm p-button-warning"
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            onClick={() =>
                                                setSubscriptions((prev) =>
                                                    prev.filter(
                                                        (sub) =>
                                                            sub.id !==
                                                            subscription.id
                                                    )
                                                )
                                            }
                                            className="p-button-sm p-button-danger"
                                        />
                                    </div>

                                </div>}
                                subTitle={<div className="flex flex-column">
                                    <div>
                                        {`IDR ${subscription.pricePerMonth} / Month | IDR ${subscription.pricePerYear} / Year`}
                                    </div>
                                    <div className="mt-3">
                                        <Checkbox
                                            inputId={`featured-${subscription.id}`}
                                            checked={subscription.isFeatured}
                                            onChange={() =>
                                                toggleFeatured(subscription.id)
                                            }
                                        />
                                        <label
                                            htmlFor={`featured-${subscription.id}`}
                                            className="ml-2"
                                        >
                                            Show on Landing Page ({subscription.displayOrder})
                                        </label>
                                    </div>

                                </div>}
                                className="h-full"
                            >
                                <div className="ml-1">
                                    {subscription.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
            </div>

            <Dialog
                header={
                    editingSubscription ? "Edit Subscription" : "Add Subscription"
                }
                visible={dialogVisible}
                style={{ width: "40vw" }}
                onHide={resetForm}
            >
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="pricePerMonth">Price/Month</label>
                    <InputText
                        id="pricePerMonth"
                        value={pricePerMonth || ""}
                        onChange={(e) =>
                            setPricePerMonth(parseFloat(e.target.value))
                        }
                        className="w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="pricePerYear">Price/Year</label>
                    <InputText
                        id="pricePerYear"
                        value={pricePerYear || ""}
                        onChange={(e) =>
                            setPricePerYear(parseFloat(e.target.value))
                        }
                        className="w-full"
                    />
                </div>
                <div className="field">
                    <label>Features</label>
                    <MultiSelect
                        value={selectedFeatures}
                        options={features}
                        onChange={(e) => setSelectedFeatures(e.value)}
                        optionLabel="name"
                        placeholder="Select Features"
                        className="w-full"
                    />
                </div>
                <div className="field">
                    <Checkbox
                        inputId="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.checked)}
                    />
                    <label htmlFor="isFeatured" className="ml-2">
                        Show on Landing Page
                    </label>
                </div>
                <div className="field">
                    <label htmlFor="displayOrder">Display Order</label>
                    <InputNumber
                        id="displayOrder"
                        value={displayOrder || undefined}
                        onChange={(e) => setDisplayOrder(e.value || null)}
                        className="w-full"
                        min={1}
                    />
                </div>
                <div className="flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={resetForm}
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        onClick={saveSubscription}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default AdminSubscriptionPage;
