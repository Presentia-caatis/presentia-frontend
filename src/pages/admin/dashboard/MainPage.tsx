import { useState } from 'react';
import { Chart } from 'primereact/chart';

interface AdminDashboardData {
    total_schools: number;
    active_subscriptions: number;
    expired_subscriptions: number;
    total_users: number;
    tickets_open: number;
    tickets_closed: number;
    total_revenue: number;
    monthly_revenue: number;
}

const AdminDashboard = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const dummyData: AdminDashboardData = {
        total_schools: 2,
        active_subscriptions: 2,
        expired_subscriptions: 0,
        total_users: 12,
        tickets_open: 0,
        tickets_closed: 2,
        total_revenue: 50000,
        monthly_revenue: 200,
    };

    const [dataDashboard] = useState<AdminDashboardData>(dummyData);

    const [subscriptionStatusChart] = useState({
        labels: ['Aktif', 'Tidak Aktif'],
        datasets: [
            {
                data: [dummyData.active_subscriptions, dummyData.expired_subscriptions],
                backgroundColor: [
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--red-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--red-400'),
                ],
            },
        ],
    });

    const [ticketStatusChart] = useState({
        labels: ['Tiket Aktif', 'Tiket Selesai'],
        datasets: [
            {
                data: [dummyData.tickets_open, dummyData.tickets_closed],
                backgroundColor: [
                    documentStyle.getPropertyValue('--orange-500'),
                    documentStyle.getPropertyValue('--blue-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--orange-400'),
                    documentStyle.getPropertyValue('--blue-400'),
                ],
            },
        ],
    });

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                },
            },
        },
    };

    return (
        <>
            <div className="card">
                <h1>Selamat datang di dashboard admin</h1>
                <p>Ringkasan sekolah yang terdaftar, status langganan, tiket dukungan, dan data pendapatan.</p>
            </div>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Jumlah Sekolah</span>
                                <div className="text-900 font-medium text-xl">{dataDashboard.total_schools}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-building text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Jumlah Sekolah yang Berlangganan</span>
                                <div className="text-900 font-medium text-xl">{dataDashboard.active_subscriptions}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-check-circle text-green-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Pendapatan Bulanan</span>
                                <div className="text-900 font-medium text-xl">${dataDashboard.monthly_revenue}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-wallet text-purple-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Jumlah Pengguna</span>
                                <div className="text-900 font-medium text-xl">{dataDashboard.total_users}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-teal-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-users text-teal-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Status Berlangganan</h5>
                        <Chart type="doughnut" data={subscriptionStatusChart} options={chartOptions} />
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Status Tiket</h5>
                        <Chart type="pie" data={ticketStatusChart} options={chartOptions} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
