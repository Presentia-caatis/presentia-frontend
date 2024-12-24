/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import authServices from '../../services/authServices';

interface RegisterFormInputs {
    name: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const { state }: any = useLocation();
    const navigate = useNavigate();
    const toast = React.useRef<Toast>(null);
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();

    const onSubmitRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await authServices.register({
                username: data.name,
                email: state.email,
                password: data.password,
                password_confirmation: data.confirmPassword
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Registration Successful',
                detail: 'Your account has been created.',
            });

            navigate('/client/dashboard');
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Registration Failed',
                detail: error.response?.data?.message || 'Something went wrong.',
            });
        }
    };

    const password = watch('password'); 

    return (
        <div className="min-h-screen flex align-items-center justify-content-center">
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
                        <h2 className="text-900 text-3xl font-medium mb-3">Complete Your Registration</h2>
                        <p className="text-600 font-medium">
                            Please create a password and confirm your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitRegister)}>
                        <div className="flex flex-column mb-3">
                            <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                                Name
                            </label>
                            <InputText
                                id="name"
                                placeholder="Full Name"
                                defaultValue={state?.name || ''}
                                className={`w-full md:w-30rem mb-2 ${errors.name ? 'p-invalid' : ''}`}
                                style={{ padding: '1rem' }}
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <small className="p-error">{errors.name.message}</small>}
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
                                        placeholder="Password"
                                        {...field}
                                        className={`w-full md:w-30rem mb-2 ${errors.password ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        inputStyle={{ padding: '1rem' }}
                                        feedback={false}
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
                                        placeholder="Confirm Password"
                                        {...field}
                                        className={`w-full md:w-30rem mb-2 ${errors.confirmPassword ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        inputStyle={{ padding: '1rem' }}
                                        feedback={false}
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <small className="p-error">{errors.confirmPassword.message}</small>
                            )}
                        </div>

                        <Button type="submit" label="Complete Registration" className="w-full p-3 text-xl mb-3" />
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
