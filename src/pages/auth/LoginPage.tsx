import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const toast = React.useRef<Toast>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const navigator = useNavigate();

    const handleLogin = () => {
        if (checked) {
            navigator('/admin/mainpage');
        } else {
            navigator('/school/mainpage');
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login');
    };

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

                        <div>
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                id="email"
                                type="text"
                                placeholder="Email address"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label htmlFor="password" className="block font-medium text-900 text-xl mb-2">
                                Password
                            </label>
                            <Password
                                id="password"
                                placeholder="Password"
                                className="w-full mb-3"
                                inputClassName="w-full"
                                inputStyle={{ padding: '1rem' }}
                                feedback={false}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className="flex align-items-center justify-content-between mb-4 gap-3">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => setChecked(e.checked ?? false)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="rememberme1">Etmin?</label>
                                </div>
                            </div>

                            <Button label="Sign In" onClick={handleLogin} className="w-full p-3 text-xl mb-3" />
                            <Button
                                label="Sign in with Google"
                                icon="pi pi-google"
                                className="w-full p-3 text-xl p-button-outlined"
                                onClick={handleGoogleLogin}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
