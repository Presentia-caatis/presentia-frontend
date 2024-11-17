import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';

const PublicTopbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [userEmail, setUserEmail] = useState('zaky@gmail.com');

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log('Logged out');
    };

    return (
        <div className="layout-topbar flex justify-content-between align-items-center">
            <Link to="/" className="text-2xl font-semibold text-primary">
                Presentia
            </Link>

            {!isLoggedIn ? (
                <Button onClick={() => {
                    setIsLoggedIn(true);
                }} className="text-xl font-semibold">Login</Button>
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
                            className="absolute bg-white border-1 border-round-lg shadow text-sm px-3 py-2  mt-2"
                            style={{
                                left: '50%',
                                transform: 'translateX(-50%)',
                                top: '100%',
                                zIndex: 10,
                            }}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <div className='flex flex-column'>
                                <div className='white-space-nowrap'>
                                    Anda login sebagai:
                                </div>
                                <b>{userEmail}</b>
                                <Button
                                    label="Logout"
                                    className="p-button-danger p-button-sm mt-2 w-full"
                                    onClick={handleLogout}
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
