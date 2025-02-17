/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import authServices from '../../services/authService';
import { useToastContext } from '../../layout/ToastContext';
import { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import { ProgressSpinner } from 'primereact/progressspinner';

interface RegisterFormInputs {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const { state }: any = useLocation();
    const navigate = useNavigate();
    const { control, register, handleSubmit, setError, watch, formState: { errors } } = useForm<RegisterFormInputs>();
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const { showToast } = useToastContext();
    const { setAuth, checkAuth } = useAuth();

    useEffect(() => {
        const authenticate = async () => {
            const isAuth = await checkAuth();
            if (isAuth) {
                console.log("tes")
                navigate('/user/dashboard');
            }
            setLoadingPage(false);
        };
        authenticate();
    }, []);

    useEffect(() => {
        if (!state?.email && !state?.googleId) {
            navigate("/login");
        }
    }, [state, navigate]);

    if (!state?.email && !state?.googleId) {
        return null;
    }

    if (loadingPage) {
        return (
            <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center">
                <ProgressSpinner />
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    const onSubmitRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            setLoading(true);
            await authServices.register({
                fullname: data.fullname,
                username: data.username,
                email: state.email,
                google_id: state.googleId,
                password: data.password,
                password_confirmation: data.confirmPassword,
            });

            const { responseData } = await authServices.login({
                email_or_username: state.email,
                password: data.password,
            });

            if (responseData?.token) {
                setAuth(responseData.user, responseData.token);

                callToast(showToast, 'success', 'Registrasi Berhasil', 'Berhasil login dengan akun yang didaftarkan');
                setLoading(false);

                navigate('/user/dashboard');
            } else {
                setLoading(false);
                callToast(showToast, 'error', 'Login Gagal', 'Terjadi masalah saat login setelah registrasi.');
                navigate('/login');
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                Object.keys(apiErrors).forEach((field) => {
                    const messages = apiErrors[field];
                    setError(field as keyof RegisterFormInputs, {
                        type: 'server',
                        message: messages.join(', '),
                    });
                });
                setLoading(false);
            } else {
                setLoading(false);
                callToast(showToast, 'error', 'Registrasi Gagal', 'Terjadi kesalahan pada server.');
            }
        }
    };

    const passwordHeader = <div className="font-bold mb-3">Buat Password</div>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2 font-medium">Kata sandi harus mengandung:</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>Minimal satu huruf kecil</li>
                <li>Minimal satu huruf kapital</li>
                <li>Minimal satu angka</li>
                <li>Panjang minimal 8 karakter</li>
            </ul>
        </>
    );

    const password = watch('password');

    return (
        <div className="min-h-screen flex align-items-center justify-content-center">
            <Helmet>
                <title>Register | Presentia</title>
            </Helmet>
            <div
                style={{
                    borderRadius: '56px',
                    padding: '0.3rem',
                    background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                }}
            >
                <Card className="w-full p-4 md:p-5" style={{ borderRadius: '53px' }}>
                    <div className="text-center mb-3">
                        <h2 className="text-900 text-3xl font-medium mb-3">Complete Your Registration</h2>
                        <p className="text-600 font-medium">
                            Please create a password and confirm your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitRegister)}>
                        <div className="flex flex-column mb-3">
                            <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                                Full Name
                            </label>
                            <InputText
                                id="name"
                                placeholder="Full Name"
                                defaultValue={state?.fullname || ''}
                                className={`w-full md:w-30rem mb-2 ${errors.fullname ? 'p-invalid' : ''}`}
                                style={{ padding: '1rem' }}
                                {...register('fullname', { required: 'Name is required' })}
                            />
                            {errors.fullname && <small className="p-error">{errors.fullname.message}</small>}
                        </div>
                        <div className="flex flex-column mb-3">
                            <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                                Username
                            </label>
                            <InputText
                                id="name"
                                placeholder="Username"
                                className={`w-full md:w-30rem mb-2 ${errors.username ? 'p-invalid' : ''}`}
                                style={{ padding: '1rem' }}
                                {...register('username', { required: 'Name is required' })}
                            />
                            {errors.username && <small className="p-error">{errors.username.message}</small>}
                        </div>

                        <div className="flex flex-column mb-3">
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                id="email"
                                value={state?.email || ''}
                                disabled
                                className="w-full md:w-30rem"
                                style={{ padding: '1rem' }}
                            />
                        </div>

                        <div className="flex flex-column mb-3">
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
                                        {...field}
                                        className={`w-full md:w-30rem mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        inputStyle={{ padding: '1rem' }}
                                        header={passwordHeader}
                                        footer={passwordFooter}
                                        toggleMask
                                    />
                                )}
                            />
                            {errors.password && <small className="p-error">{errors.password.message}</small>}
                        </div>

                        <div className="flex flex-column mb-3">
                            <label htmlFor="confirmPassword" className="block font-medium text-900 text-xl mb-2">
                                Confirm Password
                            </label>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: 'Confirmation password is required',
                                    validate: (value) => value === password || 'Passwords do not match',
                                }}
                                render={({ field }) => (
                                    <Password
                                        id="confirmPassword"
                                        {...field}
                                        className={`w-full md:w-30rem mb-2 ${errors.confirmPassword ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        inputStyle={{ padding: '1rem' }}
                                        feedback={false}
                                        toggleMask
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <small className="p-error">{errors.confirmPassword.message}</small>
                            )}
                        </div>

                        <Button loading={loading} type="submit" label="Complete Registration" className="w-full p-3 text-xl mb-3" />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
