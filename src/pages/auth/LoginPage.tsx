/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import authServices from '../../services/authServices';


interface LoginFormInputs {
    email_or_username: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const toast = React.useRef<Toast>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            setLoading(true);
            const response = await authServices.login(data);

            const { token, user } = response;
            localStorage.setItem('token', token);

            navigate('/client/dashboard');

            toast.current?.show({
                severity: 'success',
                summary: 'Login Success',
                detail: `Welcome, ${user.name}`,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false);
        const errorMessage = error.response?.data?.message || 'Invalid credentials.';
            const errorDetails = error.response?.data?.errors;

            let fullErrorMessage = errorMessage;

            if (errorDetails) {
                const detailMessages = Object.keys(errorDetails)
                    .map((key) => errorDetails[key].join(', '))
                    .join(', ');
                fullErrorMessage = `${detailMessages}`;
            }

            toast.current?.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: fullErrorMessage,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        authServices.googleLogin();
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const name = queryParams.get('name');
        const email = queryParams.get('email');
        const token = queryParams.get('token');

        if (status === 'new_user') {
            navigate('/register', { state: { name, email } });
        } else if (status === 'existing_user') {
            if (token) {
                localStorage.setItem('token', token);
                navigate('/client/dashboard');
            }
        } else if (status === 'error') {
            alert('Authentication failed.');
        }
    }, [location, navigate]);


    return (
        <div className="min-h-screen flex align-items-center justify-content-center">
            <div className="flex">
                <Toast ref={toast} />
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
                                        Email atau Username
                                    </label>
                                    <InputText
                                        id="email_or_username"
                                        placeholder="Email or Username"
                                        className={`w-full md:w-30rem mb-2 ${errors.email_or_username ? 'p-invalid' : ''}`}
                                        style={{ padding: '1rem' }}
                                        {...register('email_or_username', { required: 'Email or Username is required' })}
                                    />
                                    {errors.email_or_username && <small className="p-error">{errors.email_or_username.message}</small>}
                                </div>

                                <div className='flex flex-column mb-3'>
                                    <label htmlFor="password" className="block font-medium text-900 text-xl mb-2">
                                        Password
                                    </label>
                                    <div className="p-inputgroup relative">
                                        <InputText
                                            id="password"
                                            placeholder="Password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            className={`w-full md:w-30rem pr-6 mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                            {...register('password', { required: 'Password is required' })}
                                        />
                                        <i
                                            className={`pi ${isPasswordVisible ? 'pi-eye-slash' : 'pi-eye'} absolute cursor-pointer z-1`}
                                            style={{
                                                right: '10px',
                                                top: '45%',
                                                transform: 'translateY(-50%)',
                                                fontSize: '1.2rem',
                                                color: '#6c757d',
                                            }}
                                            onClick={togglePasswordVisibility}
                                        ></i>
                                    </div>

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

                                <Button type="submit" label="Sign In" className="w-full p-3 text-xl mb-3" />
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
            </div>
        </div>
    );
};

export default LoginPage;
