/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import authServices from '../../services/authServices';
import { useToastContext } from '../../context/ToastContext';

interface RegisterFormInputs {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const { state }: any = useLocation();
    const navigate = useNavigate();
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();

    const { showToast } = useToastContext();

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
            await authServices.register({
                fullname: data.fullname,
                username: data.username,
                email: state.email,
                password: data.password,
                password_confirmation: data.confirmPassword
            });

            callToast(showToast, 'success', 'Registrasi Berhasil', 'Login melalui username/email dan password');
            navigate('/login');
        } catch (error: any) {
            callToast(showToast, 'error', 'Registrasi Gagal', 'cekk');
        }
    };

    const password = watch('password');

    return (
        <div className="min-h-screen flex align-items-center justify-content-center">
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
