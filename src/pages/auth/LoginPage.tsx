/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import authServices from '../../services/authServices';


interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const toast = React.useRef<Toast>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const response = await authServices.login(data);

            const { token, role } = response;
            localStorage.setItem('token', token);

            navigate('/client/dashboard');

            toast.current?.show({
                severity: 'success',
                summary: 'Login Success',
                detail: 'You are now logged in.',
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: error.response?.data?.message || 'Something went wrong.',
            });
        }
    };

    const handleGoogleLogin = () => {
        authServices.googleLogin();
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
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        placeholder="Email address"
                                        className={`w-full md:w-30rem mb-2 ${errors.email ? 'p-invalid' : ''}`}
                                        style={{ padding: '1rem' }}
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <small className="p-error">{errors.email.message}</small>}
                                </div>

                                <div className='flex flex-column mb-3'>
                                    <label htmlFor="password" className="block font-medium text-900 text-xl mb-2">
                                        Password
                                    </label>
                                    <Password
                                        id="password"
                                        placeholder="Password"
                                        className={`w-full md:w-30rem mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                        inputClassName="w-full" 
                                        inputStyle={{ padding: '1rem' }}
                                        feedback={false}
                                        {...register('password', { required: 'Password is required' })}
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
