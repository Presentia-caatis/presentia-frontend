/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { useToastContext } from '../../layout/ToastContext';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToastContext();
    const navigate = useNavigate();

    const handleSendResetLink = async () => {
        try {
            setLoading(true);
            const response = await authService.forgotPassword(email);
            showToast({
                severity: 'success',
                summary: 'Tautan Dikirim, silahkan periksa email Anda',
                detail: response.message,
            });
        } catch (error: any) {
            const response = error.response?.data;
            let errorMessage = response?.message || 'Terjadi kesalahan';

            if (response?.errors) {
                errorMessage = Object.values(response.errors)
                    .flat()
                    .join(' | ');
            }

            showToast({
                severity: 'error',
                summary: 'Gagal',
                detail: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex align-items-center justify-content-center relative'>
            <div className='absolute top-0 left-0 mt-5 ml-5'>
                <Button
                    icon="pi pi-arrow-left"
                    className="p-button-text p-button-plain p-2 mb-4"
                    onClick={() => navigate('/login')}
                    aria-label="Back"
                />
            </div>
            <div className="p-4 card" >
                <h2>Lupa Password</h2>
                <div className="field mt-3">
                    <label>Email</label>
                    <InputText
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email Anda"
                        className="w-full"
                    />
                </div>
                <Button
                    label="Kirim Tautan Reset Password"
                    icon="pi pi-envelope"
                    onClick={handleSendResetLink}
                    loading={loading}
                    disabled={!email || loading}
                    className="mt-3"
                />
            </div>
        </div>
    );
};

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToastContext();

    const emailParam = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const [email] = useState(emailParam);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!token || !emailParam) {
            showToast({
                severity: 'warn',
                summary: 'Tidak valid',
                detail: 'Silakan coba ulangi dari tautan yang dikirimkan.',
            });
            navigate('/forgot-password');
        }
    }, [token, emailParam, navigate, showToast]);

    const handleResetPassword = async () => {
        if (password !== passwordConfirmation) {
            showToast({
                severity: 'warn',
                summary: 'Password tidak cocok',
                detail: 'Konfirmasi password harus sama.',
            });
            return;
        }

        try {
            setLoading(true);
            const payload = { token, email, password, password_confirmation: passwordConfirmation };
            const response = await authService.resetPassword(payload);

            showToast({
                severity: 'success',
                summary: 'Sukses',
                detail: response.message,
            });

            if (user) {
                navigate(`/user/profile`);
            } else {
                navigate('/login');
            }
        } catch (error: any) {
            showToast({
                severity: 'error',
                summary: 'Gagal',
                detail: error.response?.data?.message || 'Terjadi kesalahan',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex align-items-center justify-content-center relative'>
            <div className="p-4 card flex flex-column justify-content-center">
                <h2>Reset Password</h2>
                <div className="flex flex-column mt-3">
                    <label>Password Baru</label>
                    <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} className="w-full mt-2" />
                </div>
                <div className="flex flex-column mt-3">
                    <label>Konfirmasi Password Baru</label>
                    <Password value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} toggleMask feedback={false} className="w-full mt-2" />
                </div>
                <Button
                    label="Reset Password"
                    icon="pi pi-save"
                    onClick={handleResetPassword}
                    loading={loading}
                    disabled={!password || !passwordConfirmation || loading}
                    className="mt-3"
                />
            </div>
        </div >
    );
};

export { ForgotPasswordPage, ResetPasswordPage };