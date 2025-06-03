/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useAuth } from '../../context/AuthContext';

const PublicTopbar = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
        }
    }, []);



    const handlePresentiaClick = () => {
        if (user?.roles.includes('super_admin')) {
            navigate('/admin/mainpage');
        } else {
            navigate('/user/dashboard');
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
                    onMouseLeave={() => setHovered(false)}
                >
                    <Button
                        link
                        onClick={handlePresentiaClick}
                        className=" border-primary border-1 py-2 px-4 border-round-lg text-primary w-11rem flex justify-content-center align-items-center"
                    >
                        My Presentia
                        {hovered && (
                            <div>
                                <i
                                    className="pi pi-arrow-circle-right text-primary text-sm ml-2"
                                    style={{ transition: 'transform 0.3s' }}
                                ></i>
                            </div>
                        )}
                    </Button>

                    {hovered && (
                        <div
                            className="absolute bg-white border-1 border-round-lg shadow text-sm px-3 py-2 mt-2"
                            style={{
                                left: '50%',
                                transform: 'translateX(-50%)',
                                top: '100%',
                                zIndex: 10,
                            }}
                        >
                            <div className="flex flex-column">
                                <div className="white-space-nowrap">
                                    Anda login sebagai:
                                </div>
                                <b>{userEmail}</b>
                                {/* <Button
                                    label="Logout"
                                    className="p-button-danger p-button-sm mt-2 w-full"
                                    onClick={handleLogout}
                                    loading={loading}
                                /> */}
                            </div>
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default PublicTopbar;
