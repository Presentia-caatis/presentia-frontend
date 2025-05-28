import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import landingPageBackground from "../../../src/assets/landingPageBg.png";

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    const handlePresentiaClick = () => {
        if (user?.roles.includes('super_admin')) {
            navigate('/admin/mainpage');
        } else {
            navigate('/user/dashboard');
        }
    };

    return (
        <div>
            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                    <section>
                        <span className="block text-6xl font-bold mb-1">Presentia</span>
                        <div className="text-6xl text-primary font-bold mb-3">Digitalisasi Absensi Sekolah Anda</div>
                        <p className="mt-0 mb-4 text-700 line-height-3">Optimalkan pengelolaan kehadiran siswa dengan sistem presensi berbasis web yang cepat, aman, dan terintegrasi.</p>
                        {user ? (
                            <div>
                                <Button
                                    label="Dashboard"
                                    type="button"
                                    className="mr-3"
                                    onClick={handlePresentiaClick}
                                    raised
                                />
                            </div>
                        ) : (
                            <div>
                                <Button
                                    label="Login"
                                    type="button"
                                    className="mr-3"
                                    onClick={() => navigate('/login')}
                                    raised
                                />
                                <Button
                                    label="Daftar"
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    outlined
                                />
                            </div>
                        )}


                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img src={landingPageBackground} alt="hero-1" className="h-30rem w-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>

            <br />
            <br />
            <br />

            <div className="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
                <div className="mb-3 font-bold text-3xl">
                    <span className="text-900">Mengapa Memilih </span>
                    <span className="text-primary">Presentia?</span>
                </div>
                <div className="text-700 mb-6">Solusi presensi modern yang mempermudah sekolah dalam mengelola kehadiran siswa dan staf.</div>
                <div className="grid">
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-desktop text-4xl text-primary"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Berbasis Web</div>
                        <span className="text-700 line-height-3">Akses dari mana saja dan kapan saja tanpa harus bergantung pada perangkat tertentu.</span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-lock text-4xl text-primary"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Data Aman</div>
                        <span className="text-700 line-height-3">Data kehadiran dilindungi dengan enkripsi untuk menjaga privasi.</span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-check-circle text-4xl text-primary"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Mudah Digunakan</div>
                        <span className="text-700 line-height-3">Antarmuka yang sederhana dan intuitif memudahkan siapa saja untuk menggunakannya.</span>
                    </div>
                </div>
            </div>


            <br />
            <br />
            <br />

            <div className="surface-0 px-4 py-8 md:px-6 lg:px-8">
                <div className="text-900 font-bold text-6xl mb-4 text-center">Paket Langganan</div>
                <div className="text-700 text-xl mb-6 text-center line-height-3">
                    Pilih paket yang sesuai dengan kebutuhan sekolah Anda. Setiap paket menawarkan fitur berbeda untuk kemudahan dalam manajemen presensi.
                </div>

                <div className="grid">
                    <div className="col-12 lg:col-4">
                        <div className="p-3 h-full">
                            <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                                <div className="text-900 font-medium text-xl mb-2">Basic</div>
                                <div className="text-600">Untuk sekolah dengan kebutuhan dasar presensi.</div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <div className="flex align-items-center">
                                    <span className="font-bold text-2xl text-900">$9</span>
                                    <span className="ml-2 font-medium text-600">per month</span>
                                </div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <ul className="list-none p-0 m-0 flex-grow-1">
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Presensi manual atau NIM</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Laporan presensi bulanan</span>
                                    </li>
                                </ul>
                                <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                                {/* <Button label="Buy Now" className="p-3 w-full mt-auto" /> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 lg:col-4">
                        <div className="p-3 h-full">
                            <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                                <div className="text-900 font-medium text-xl mb-2">Premium</div>
                                <div className="text-600">Untuk sekolah yang membutuhkan fitur presensi lebih canggih.</div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <div className="flex align-items-center">
                                    <span className="font-bold text-2xl text-900">$29</span>
                                    <span className="ml-2 font-medium text-600">per month</span>
                                </div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <ul className="list-none p-0 m-0 flex-grow-1">
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Presensi dengan RFID tap</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Laporan harian dan bulanan</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Dukungan pelanggan 24/7</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Fitur paket basic</span>
                                    </li>
                                </ul>
                                <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300" />
                                {/* <Button label="Buy Now" className="p-3 w-full" /> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 lg:col-4">
                        <div className="p-3 h-full">
                            <div className="shadow-2 p-3 flex flex-column" style={{ borderRadius: '6px' }}>
                                <div className="text-900 font-medium text-xl mb-2">Enterprise</div>
                                <div className="text-600">Untuk sekolah besar dengan kebutuhan pengelolaan presensi tingkat lanjut.</div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <div className="flex align-items-center">
                                    <span className="font-bold text-2xl text-900">$49</span>
                                    <span className="ml-2 font-medium text-600">per month</span>
                                </div>
                                <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                                <ul className="list-none p-0 m-0 flex-grow-1">
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Presensi dengan Face Recognition</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Notifikasi keterlambatan siswa</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Akses ke laporan dan statistik tingkat lanjut</span>
                                    </li>
                                    <li className="flex align-items-center mb-3">
                                        <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span className="text-900">Fitur paket premium</span>
                                    </li>
                                </ul>
                                <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300" />
                                {/* <Button label="Buy Now" className="p-3 w-full" outlined /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <br />
            <br />
            <br />

            {!user && (<div>
                <div className="surface-0 text-700 text-center px-4 py-8 md:px-6 lg:px-8">
                    <div className="text-primary font-bold mb-3"><i className="pi pi-user"></i>&nbsp;PILIH PRESENTIA</div>
                    <div className="text-900 font-bold text-5xl mb-3">Daftar Akun Sekarang</div>
                    <div className="text-700 text-2xl mb-5">Bergabunglah dengan sekolah lain yang telah beralih ke sistem presensi modern kami.</div>
                    <Button label="Daftar Akun" onClick={() => {
                        navigate('/login')
                    }} icon="pi pi-user" className="font-bold px-5 py-3 white-space-nowrap" rounded raised />
                </div>

                <br />
                <br /> </div>)}
        </div>
    )
}

export default LandingPage;