import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useRef } from 'react';

const SchoolViolationStudentPointReport = () => {
    const [nisn, setNisn] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(null);
    const [points, setPoints] = useState<number | null>(null);
    const toast = useRef<Toast>(null);

    const handleSave = () => {
        if (nisn && description && type && points !== null) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Student point report saved!' });
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
        }
    };

    const typeOptions = [
        { label: 'Tawuran', value: 'Tawuran' },
        { label: 'Maling', value: 'Maling' }
    ];

    return (
        <div className="p-grid p-justify-center p-align-center p-mt-4">
            <div className="card">
                <h1>Lapor Poin Siswa</h1>

                <div className="mt-3">
                    <h5>NISN</h5>
                    <InputText
                        value={nisn}
                        onChange={(e) => setNisn(e.target.value)}
                        placeholder="Enter NISN"
                    />
                </div>

                <div className="mt-3">
                    <h5>Deskripsi</h5>
                    <InputText
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    />
                </div>

                <div className="mt-3">
                    <h5>Tipe</h5>
                    <Dropdown
                        value={type}
                        options={typeOptions}
                        onChange={(e) => setType(e.value)}
                        placeholder="Select type"
                    />
                </div>

                <div className="mt-3">
                    <h5>Poin</h5>
                    <InputNumber
                        value={points}
                        onValueChange={(e) => setPoints(e.value!)}
                        placeholder="Enter points"
                    />
                </div>

                <Divider />

                <Button label="Save" icon="pi pi-save" onClick={handleSave} className="p-mt-3" />
                <Toast ref={toast} />
            </div>
        </div>
    );
};

export default SchoolViolationStudentPointReport;
