import { useParams, useNavigate } from 'react-router-dom';

type InvoiceData = {
    id: number;
    schoolName: string;
    invoiceDate: string;
    dueDate: string;
    total: number;
    status: string;
};

const invoiceList: InvoiceData[] = [
    { id: 1, schoolName: "SMK 8", invoiceDate: "02/05/2003", dueDate: "03/07/2004", total: 4196807, status: 'Paid' },
    { id: 2, schoolName: "SMK 9", invoiceDate: "02/06/2003", dueDate: "04/07/2004", total: 122020, status: 'Unpaid' },
];

const UserInvoiceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const invoice = invoiceList.find((item) => item.id === Number(id));

    if (!invoice) {
        return (
            <div className="card">
                <h2>Invoice Not Found</h2>
                <p>The invoice with ID {id} does not exist.</p>
                <button onClick={() => navigate('/')} className="p-button">
                    Back to Invoices
                </button>
            </div>
        );
    }

    const formatCurrency = (value: number): string =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    return (
        <div className="card">
            <h2 className="mb-3">Invoice Details</h2>
            <div className="p-fluid">
                <div className="field">
                    <label>ID:</label>
                    <p>{invoice.id}</p>
                </div>
                <div className="field">
                    <label>School Name:</label>
                    <p>{invoice.schoolName}</p>
                </div>
                <div className="field">
                    <label>Invoice Date:</label>
                    <p>{invoice.invoiceDate}</p>
                </div>
                <div className="field">
                    <label>Due Date:</label>
                    <p>{invoice.dueDate}</p>
                </div>
                <div className="field">
                    <label>Total:</label>
                    <p>{formatCurrency(invoice.total)}</p>
                </div>
                <div className="field">
                    <label>Status:</label>
                    <p
                        className={`${invoice.status === 'Paid'
                            ? 'text-green-700 bg-green-100 px-2 py-1 border-round'
                            : 'text-red-700 bg-red-100 px-2 py-1 border-round'
                            }`}
                    >
                        {invoice.status}
                    </p>
                </div>
            </div>

            <button onClick={() => navigate("/User/dashboard/billing")} className="p-button mt-3">
                Back to Invoices
            </button>
        </div>
    );
};

export default UserInvoiceDetailPage;
