/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useToastContext } from '../../layout/ToastContext';
import { useAuth } from '../../context/AuthContext';

const PublicTopbar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const toast = React.useRef<Toast>(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    const { showToast } = useToastContext();
    function callToast(showToast: any, severity: string, summary: string, detail: string) {
        showToast({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            logout();
            localStorage.clear();

            callToast(showToast, 'success', 'Logout Sukses', 'Kamu berhasil logout');
            setUserEmail('');

            navigate('/');
            toast.current?.show({
                severity: 'success',
                summary: 'Logout Success',
                detail: 'Kamu sudah logout dari aplikasi',
            });
        } catch (error) {
            console.error('Logout failed:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Logout Gagal',
                detail: 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-topbar flex justify-content-between align-items-center">
            <Link to="/" className="text-2xl font-semibold text-primary">
                Presentia
            </Link>

            {!user ? (
                <Button
                    onClick={() => {
                        navigate('/login')
                    }}
                    className="text-xl font-semibold"
                >
                    Login
                </Button>
            ) : (
                <div
                    className="relative flex align-items-center"
                    onMouseEnter={() => setHovered(true)}
                >
                    <Link
                        to="/client/dashboard"
                        className="border-primary border-1 py-2 px-4 border-round-lg text-primary w-11rem flex justify-content-center align-items-center"
                    >
                        My Presentia{' '}
                        {hovered && (
                            <div>
                                <i
                                    className="pi pi-arrow-circle-right text-primary text-sm ml-2"
                                    style={{ transition: 'transform 0.3s' }}
                                ></i>
                            </div>
                        )}
                    </Link>

                    {hovered && (
                        <div
                            className="absolute bg-white border-1 border-round-lg shadow text-sm px-3 py-2 mt-2"
                            style={{
                                left: '50%',
                                transform: 'translateX(-50%)',
                                top: '100%',
                                zIndex: 10,
                            }}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <div className="flex flex-column">
                                <div className="white-space-nowrap">
                                    Anda login sebagai:
                                </div>
                                <b>{userEmail}</b>
                                <Button
                                    label="Logout"
                                    className="p-button-danger p-button-sm mt-2 w-full"
                                    onClick={handleLogout}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PublicTopbar;
