/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import authServices from '../../services/authService';
import { useToastContext } from '../../layout/ToastContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';


interface LoginFormInputs {
    email_or_username: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<LoginFormInputs>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToastContext();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const { setAuth, checkAuth } = useAuth();
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    useEffect(() => {
        const authenticate = async () => {
            const isAuth = await checkAuth();
            if (isAuth) {
                navigate('/user/dashboard');
            }
            setIsLoggedIn(false);
        };
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const token = queryParams.get('token');
        if (!status && !token) {
            authenticate();
        }
    }, []);


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const token = queryParams.get('token');

        const handleLoginFlow = async () => {
            setIsLoggedIn(true);
            if (status === 'new_user') {
                const fullname = queryParams.get('name');
                const email = queryParams.get('email');
                const googleId = queryParams.get('google_id');
                navigate('/register', { state: { fullname, email, googleId } });
            } else if (status === 'existing_user') {
                if (token) {
                    localStorage.setItem('token', token);
                    try {
                        const response = await authServices.getProfile();
                        setAuth(response.data, token);
                        callToast(showToast, 'success', 'Login Berhasil', 'Sekarang kamu sudah masuk ke dalam aplikasi');
                        navigate('/user/dashboard');
                    } catch (error) {
                        callToast(showToast, 'error', 'Error', 'Failed to fetch user profile');
                    }
                }
            } else if (status === 'error') {
                const message = queryParams.get('message');
                callToast(showToast, 'error', 'Login Failed', message || 'An unknown error occurred');
            }

            setIsLoggedIn(false);
        };

        if (status) {
            handleLoginFlow();
        }
    }, [navigate, showToast]);

    if (isLoggedIn) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }

    const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        try {
            const { responseData, status } = await authServices.login(data);
            if (status !== "failed") {
                const { token } = responseData;
                localStorage.setItem('token', token);
                const userProfile = await authServices.getProfile();
                setAuth(userProfile.data, token);

                callToast(showToast, 'success', 'Login Berhasil', 'Sekarang kamu sudah masuk ke dalam aplikasi');
                navigate('/user/dashboard');
            } else {
                callToast(showToast, 'error', 'Login Gagal', 'Akun tidak ditemukan atau password salah');
            }
        } catch (error: any) {
            callToast(showToast, 'error', 'Login Gagal', 'Akun tidak ditemukan atau password salah');
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        authServices.googleLogin();
    };

    return (
        <>
            <div className="min-h-screen flex align-items-center justify-content-center relative">
                <Helmet>
                    <title>Login | Presentia</title>
                </Helmet>
                <div className='absolute top-0 left-0 mt-5 ml-5'>
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-plain p-2 mb-4"
                        onClick={() => navigate('/')}
                        aria-label="Back"
                    />
                </div>
                <div className="flex">
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                        }}
                    >
                        <Card className="w-full p-4 md:p-5" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-3">
                                <h2 className="text-900 text-3xl font-medium mb-3">Selamat Datang!</h2>
                                <p className="text-600 font-medium">
                                    Silahkan Log In Untuk Melanjutkan Ke Dashboard
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmitLogin)}>
                                <div>
                                    <div className='flex flex-column mb-3'>
                                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                            Email / Username
                                        </label>
                                        <InputText
                                            id="email"
                                            placeholder="Masukkan email atau password"
                                            className={`w-full md:w-30rem mb-2 ${errors.email_or_username ? 'p-invalid' : ''}`}
                                            style={{ padding: '1rem' }}
                                            {...register('email_or_username', { required: 'Email atau username harus diisi' })}
                                        />
                                        {errors.email_or_username && <small className="p-error">{errors.email_or_username.message}</small>}
                                    </div>

                                    <div className='flex flex-column mb-3'>
                                        <label htmlFor="password" className="block font-medium text-900 text-xl mb-2">
                                            Password
                                        </label>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{ required: 'Password is required' }}
                                            render={({ field }) => (
                                                <Password
                                                    id="password"
                                                    placeholder="Masukkan password"
                                                    className={`w-full md:w-30rem mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                                    inputClassName="w-full"
                                                    inputStyle={{ padding: '1rem' }}
                                                    feedback={false}
                                                    value={field.value || ''}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    toggleMask
                                                />
                                            )}
                                        />

                                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                                    </div>
                                    <div className="flex align-items-center justify-content-between mb-4 mt-2 gap-3">
                                        <div className="flex align-items-center">
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={e => setRememberMe(!!e.checked)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="Remember Password">Simpan Password?</label>
                                        </div>
                                    </div>

                                    <Button type="submit" label="Log In" className="w-full p-3 text-xl mb-3" loading={loading} />
                                </div>
                            </form>
                            <Button
                                type='button'
                                label="Sign up with Google"
                                icon="pi pi-google"
                                className="w-full p-3 text-xl p-button-outlined"
                                onClick={handleGoogleLogin}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
