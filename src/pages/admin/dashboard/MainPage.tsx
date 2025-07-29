import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import schoolService from '../../../services/schoolService';
import userService from '../../../services/userService';

interface AdminDashboardData {
    total_schools: number;
    active_subscriptions: number;
    expired_subscriptions: number;
    total_users: number;
    total_revenue: number;
    monthly_revenue: number;
}

const AdminDashboard = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const [dataDashboard, setDataDashboard] = useState<AdminDashboardData>({
        total_schools: 0,
        active_subscriptions: 0,
        expired_subscriptions: 0,
        total_users: 0,
        total_revenue: 0,
        monthly_revenue: 22150000
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schoolRes = await schoolService.count();
                const userRes = await userService.count();

                const totalSchools = schoolRes.data || 0;
                const activeSubs = schoolRes.active || totalSchools;
                const expiredSubs = totalSchools - activeSubs;

                const totalUsers = userRes.data || 0;

                setDataDashboard({
                    total_schools: totalSchools,
                    active_subscriptions: activeSubs,
                    expired_subscriptions: expiredSubs,
                    total_users: totalUsers,
                    total_revenue: 0,
                    monthly_revenue: 22000000,
                });
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            }
        };

        fetchData();
    }, []);

    const [subscriptionStatusChart, setSubscriptionStatusChart] = useState({
        labels: ['Aktif', 'Tidak Aktif'],
        datasets: [
            {
                data: [dataDashboard.active_subscriptions, dataDashboard.expired_subscriptions],
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

    useEffect(() => {
        setSubscriptionStatusChart({
            labels: ['Aktif', 'Tidak Aktif'],
            datasets: [
                {
                    data: [dataDashboard.active_subscriptions, dataDashboard.expired_subscriptions],
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
    }, [dataDashboard]);

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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
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
                                <div className="text-900 font-medium text-xl">{formatCurrency(dataDashboard.monthly_revenue)}</div>
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
                <div className="col-12">
                    <div className="card flex flex-column align-items-center">
                        <h5 className="text-left w-full">Status Berlangganan</h5>
                        <Chart type="doughnut" data={subscriptionStatusChart} options={chartOptions} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
