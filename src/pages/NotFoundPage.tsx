import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';

const NotFoundPage = () => {
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <Card className="w-full surface-card py-6 px-3 sm:px-6 " style={{ borderRadius: '53px' }}>
                        <div className='flex flex-column align-items-center'>
                            <span className="text-blue-500 font-bold text-3xl">404</span>
                            <h1 className="text-900 font-bold text-3xl lg:text-5xl mb-2">Tidak Ditemukan</h1>
                            <div className="text-600 mb-5">Halaman Yang Anda Tuju Tidak Ditemukan.</div>
                            <div>
                                <Link to="/login" className="w-full flex align-items-center no-underline py-5 border-bottom-1 border-300">
                                    <span
                                        className="flex justify-content-center align-items-center bg-cyan-400 border-round"
                                        style={{ height: '3.5rem', width: '3.5rem' }}
                                    >
                                        <i className="text-50 pi pi-fw pi-table text-2xl"></i>
                                    </span>
                                    <span className="ml-4 flex flex-column">
                                        <span className="text-900 lg:text-xl  font-medium mb-0 block">Click Disini</span>
                                        <span className="text-600 lg:text-xl">Untuk Kembali Ke Halaman Utama.</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
