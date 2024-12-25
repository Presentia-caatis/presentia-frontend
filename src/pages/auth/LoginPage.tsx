/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import authServices from '../../services/authServices';


interface LoginFormInputs {
    email_or_username: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors }, control } = useForm<LoginFormInputs>();
    const toast = React.useRef<Toast>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const response = await authServices.login(data);

            const { token, user } = response;
            const { username, school_id } = user;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            if (school_id) {
                localStorage.setItem('school_id', school_id.toString());
            }

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
        const token = queryParams.get('token');

        if (status === 'new_user') {
            const name = queryParams.get('name');
            const email = queryParams.get('email');
            navigate('/register', { state: { name, email } });
        } else if (status === 'existing_user') {
            if (token) {
                localStorage.setItem('token', token);
                navigate('/client/dashboard');
            }
        } else if (status === 'error') {
            const message = queryParams.get('message');
            toast.current?.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: message,
            });
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
