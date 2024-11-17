import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

type InvoiceData = {
    id: number;
    schoolName: string;
    invoiceDate: string;
    dueDate: string;
    total: number;
    status: string;
};

const ClientInvoicesPage = () => {
    const navigate = useNavigate();
    const [invoiceList, setInvoiceList] = useState<InvoiceData[]>([
        { id: 1, schoolName: "SMK 8", invoiceDate: "02/05/2003", dueDate: "03/07/2004", total: 4196807, status: 'Paid' },
        { id: 2, schoolName: "SMK 9", invoiceDate: "02/06/2003", dueDate: "04/07/2004", total: 122020, status: 'Unpaid' },
    ]);

    const handleRowClick = (rowData: InvoiceData) => {
        navigate(`/client/invoice/${rowData.id}`);
    };

    const formatCurrency = (value: number): string =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const totalBodyTemplate = (rowData: InvoiceData) => {
        return formatCurrency(rowData.total);
    };

    const statusBodyTemplate = (rowData: InvoiceData) => {
        const statusClass =
            rowData.status === 'Paid'
                ? 'bg-green-100 text-green-700 px-3 py-1 border-round-2xl'
                : 'bg-red-100 text-red-700 px-3 py-1 border-round-2xl';

        return <span className={statusClass}>{rowData.status}</span>;
    };

    return (
        <div className="card">
            <DataTable
                dataKey="id"
                value={invoiceList}
                selectionMode="single"
                paginator
                header={
                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center ">
                        <h5 className="m-0">Daftar Pembayaran</h5>
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" style={{ paddingLeft: '8px' }} />
                            <InputText className="py-2 pl-5" placeholder="Search..." />
                        </span>
                    </div>
                }
                rows={20}
                rowsPerPageOptions={[20, 50, 75, 100]}
                emptyMessage="Belum ada Pembayaran"
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
                onRowClick={(e) => handleRowClick(e.data as InvoiceData)}
            >
                <Column sortable field="schoolName" header="Nama Sekolah"></Column>
                <Column sortable field="id" header="Invoice"></Column>
                <Column sortable field="invoiceDate" header="Invoice Date"></Column>
                <Column sortable field="dueDate" header="Due Date"></Column>
                <Column sortable field="total" header="Total" body={totalBodyTemplate}></Column>
                <Column sortable field="status" header="Status" body={statusBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default ClientInvoicesPage;
