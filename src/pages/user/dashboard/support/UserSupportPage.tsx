import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from 'react-router-dom';

type SupportTicket = {
    id: number;
    type: string;
    subject: string;
    status: string;
    priority: string;
    lastUpdated: string;
    school?: string;
    images?: File[];
};

const UserSupportPage = () => {

    const navigate = useNavigate();

    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
        { id: 1, type: 'Support', subject: 'Website Down', school: "SMK 8", status: 'Open', priority: 'High', lastUpdated: '02/05/2023 15:30' },
        { id: 2, type: 'Support', subject: 'Payment Issue', school: "SMA48", status: 'Closed', priority: 'Medium', lastUpdated: '01/05/2023 10:00' },
    ]);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [newTicket, setNewTicket] = useState({
        type: '',
        subject: '',
        priority: '',
        message: '',
        school: '',
        images: [] as File[],
    });

    const ticketTypes = [
        { label: 'Support', value: 'Support' },
        { label: 'Technical', value: 'Technical' },
        { label: 'Billing', value: 'Billing' },
    ];

    const priorities = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
    ];

    const schools = [
        { label: 'School A', value: 'School A' },
        { label: 'School B', value: 'School B' },
        { label: 'School C', value: 'School C' },
    ];

    const handleCreateTicket = () => {
        const newId = supportTickets.length + 1;
        const newTicketEntry = {
            id: newId,
            type: newTicket.type,
            subject: newTicket.subject,
            status: 'Open',
            priority: newTicket.priority,
            lastUpdated: new Date().toLocaleString(),
            school: newTicket.school,
            images: newTicket.images,
        };

        setSupportTickets([...supportTickets, newTicketEntry]);
        resetNewTicket();
    };

    const resetNewTicket = () => {
        setNewTicket({
            type: '',
            subject: '',
            priority: '',
            message: '',
            school: '',
            images: [],
        });
        setIsDialogVisible(false);
    };

    const handleFileUpload = (e: { files: File[] }) => {
        setNewTicket({ ...newTicket, images: e.files });
    };

    const handleRowClick = (ticketId: number) => {
        navigate(`/User/support/ticket/${ticketId}`);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between p-4 card">
                <div className="flex gap-2">
                    <Button label="Tambah Tiket" severity="success" icon="pi pi-plus" onClick={() => setIsDialogVisible(true)} />
                </div>
            </div>

            <DataTable
                dataKey="id"
                value={supportTickets}
                paginator
                header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center ">
                        <h5 className="m-0">Daftar Support Tiket</h5>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                            <InputText className="py-2 pl-5" placeholder="Search..." />
                        </span>
                    </div>
                }
                selectionMode="single"
                rows={10}
                onRowClick={(e) => handleRowClick(e.data.id)}
                emptyMessage="Belum ada Tiket Support"
            >
                <Column field="type" header="Type" sortable></Column>
                <Column field="subject" header="Subject" sortable></Column>
                <Column field="school" header="School"></Column>
                <Column field="status" header="Status"></Column>
                <Column field="lastUpdated" header="Last Updated" sortable></Column>
            </DataTable>

            <Dialog
                header="Buat Tiket Baru"
                visible={isDialogVisible}
                style={{ width: '60vw' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                modal
                onHide={resetNewTicket}
                footer={
                    <div className="flex justify-content-end">
                        <Button
                            label="Batal"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={resetNewTicket}
                        />
                        <Button
                            label="Submit"
                            icon="pi pi-check"
                            onClick={handleCreateTicket}
                            disabled={!newTicket.type || !newTicket.subject || !newTicket.priority}
                        />
                    </div>
                }
            >
                <div className="grid">
                    <div className="col-12">
                        <label htmlFor="type" className="block mb-2">
                            Tipe
                        </label>
                        <Dropdown
                            id="type"
                            value={newTicket.type}
                            options={ticketTypes}
                            onChange={(e) => setNewTicket({ ...newTicket, type: e.value })}
                            placeholder="Pilih Tipe"
                            className="w-full"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="subject" className="block mb-2">
                            Subjek
                        </label>
                        <InputText
                            id="subject"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                            className="w-full"
                            placeholder="Masukkan Subjek"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="priority" className="block mb-2">
                            Prioritas
                        </label>
                        <Dropdown
                            id="priority"
                            value={newTicket.priority}
                            options={priorities}
                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.value })}
                            placeholder="Pilih Prioritas"
                            className="w-full"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="school" className="block mb-2">
                            Sekolah
                        </label>
                        <Dropdown
                            id="school"
                            value={newTicket.school}
                            options={schools}
                            onChange={(e) => setNewTicket({ ...newTicket, school: e.value })}
                            placeholder="Pilih Sekolah"
                            className="w-full"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="message" className="block mb-2">
                            Pesan
                        </label>
                        <InputTextarea
                            id="message"
                            value={newTicket.message}
                            onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                            rows={5}
                            placeholder="Masukkan Pesan Anda"
                            className="w-full"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="images" className="block mb-2">
                            Upload Gambar
                        </label>
                        <FileUpload
                            name="images"
                            customUpload
                            uploadHandler={handleFileUpload}
                            multiple
                            accept="image/*"
                            maxFileSize={1000000}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default UserSupportPage;
