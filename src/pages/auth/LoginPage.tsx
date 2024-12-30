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
import authServices from '../../services/authServices';
import { useToastContext } from '../../context/ToastContext';
import { ProgressSpinner } from 'primereact/progressspinner';


interface LoginFormInputs {
    email_or_username: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<LoginFormInputs>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToastContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        try {
            const { responseData, status } = await authServices.login(data);
            if (status === 200) {
                const { token, user } = responseData;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setIsLoggedIn(true);
                callToast(showToast, 'success', 'Login Berhasil', 'Sekarang kamu sudah login');
                navigate('/client/dashboard');
            } 
            //     try {
            //         const redirectResponse = await authServices.authenticated();
            //         const { token, user } = redirectResponse;

            //         localStorage.setItem('token', token);
            //         localStorage.setItem('user', JSON.stringify(user));

            //         setIsLoggedIn(true);
            //         callToast(showToast, 'success', 'Login Berhasil', 'Sekarang kamu sudah login');
            //         navigate('/client/dashboard');
            //     } catch (authError) {
            //         callToast(showToast, 'error', 'Login Gagal', 'Gagal mendapatkan data user');
            //     }
            // }
        } catch (error: any) {
            callToast(showToast, 'error', 'Login Gagal', 'Email atau Password salah');
        } finally {
            setLoading(false);
        }
    };


    const handleGoogleLogin = async () => {
        authServices.googleLogin();
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const token = queryParams.get('token');

        const handleLoginFlow = async () => {
            if (status === 'new_user') {
                const fullname = queryParams.get('name');
                const email = queryParams.get('email');
                const googleId = queryParams.get('google_id');
                navigate('/register', { state: { fullname, email, googleId}});
            } else if (status === 'existing_user') {
                if (token) {
                    localStorage.setItem('token', token);
                    try {
                        const response = await authServices.getProfile();
                        localStorage.setItem('user', JSON.stringify(response.data));
                        callToast(showToast, 'success', 'Login Berhasil', 'Sekarang kamu sudah login');
                        navigate('/client/dashboard');
                    } catch (error) {
                        callToast(showToast, 'error', 'Error', 'Failed to fetch user profile');
                    }
                }
            } else if (status === 'error') {
                const message = queryParams.get('message');
                callToast(showToast, 'error', 'Login Failed', message || 'An unknown error occurred');
            }
        };

        handleLoginFlow();
    }, [navigate, showToast]);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');

    //     if (!token || token === 'undefined') {
    //         localStorage.clear();
    //         setIsLoggedIn(false);
    //         navigate('/login');
    //     } else {
    //         const checkTokenValidity = async () => {
    //             try {
    //                 const response = await authCheck();
    //                 if (response.status === "success") {
    //                     setIsLoggedIn(true);
    //                     navigate('/client/dashboard');
    //                 } else {
    //                     localStorage.clear();
    //                     setIsLoggedIn(false);
    //                     navigate('/login');
    //                 }
    //             } catch (error) {
    //                 console.error('Error during token validation', error);
    //                 localStorage.clear();
    //                 setIsLoggedIn(false);
    //                 navigate('/login');
    //             }
    //         };

    //         checkTokenValidity();
    //     }
    // }, [navigate]);



    const authCheck = async () => {
        const response = await authServices.getProfile()
        return response;
    }


    return (
        <> <div className="min-h-screen flex align-items-center justify-content-center">
            {!isLoggedIn ? <div className="flex">
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
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        placeholder="Email address"
                                        className={`w-full md:w-30rem mb-2 ${errors.email_or_username ? 'p-invalid' : ''}`}
                                        style={{ padding: '1rem' }}
                                        {...register('email_or_username', { required: 'Email or username is required' })}
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
                                                placeholder="Password"
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
                                        <Checkbox checked={false}
                                            className="mr-2"
                                        />
                                        <label htmlFor="Remember Password">Save Password?</label>
                                    </div>
                                </div>

                                <Button type="submit" label="Sign In" className="w-full p-3 text-xl mb-3" loading={loading} />
                            </div>
                        </form>
                        <Button
                            type='button'
                            label="Sign in with Google"
                            icon="pi pi-google"
                            className="w-full p-3 text-xl p-button-outlined"
                            onClick={handleGoogleLogin}
                        />
                    </Card>
                </div>
            </div> : <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
        </div>
        </>
    );
};

export default LoginPage;
