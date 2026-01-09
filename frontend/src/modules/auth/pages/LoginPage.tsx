import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { notify } from '../../../lib/notify';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/admin/auth/login', {
                email,
                password,
            });

            console.log('Login success:', response.data);
            const token = response.data.access_token;
            localStorage.setItem('access_token', token);

            // Fetch User Profile to get Default Context
            try {
                const profileResponse = await api.get('/admin/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { defaultCompanyId } = profileResponse.data;
                if (defaultCompanyId) {
                    localStorage.setItem('current_company_id', defaultCompanyId);
                } else {
                    console.warn('User has no default company tied to account');
                }
            } catch (profileErr) {
                console.error('Failed to fetch profile context', profileErr);
            }

            // Auto-redirect to dashboard
            navigate('/');
        } catch (err: any) {
            console.error('Login failed:', err);
            // If it's a 401 on Login, it means Bad Credentials (api.ts skips redirect for /login)
            if (err.response?.status === 401) {
                notify.error('Credenciales incorrectas. Verifica tu email y contraseña.');
            } else if (!err.response) {
                // Network error already handled by api.ts? 
                // Actually this manual axios call MIGHT bypass api.ts interceptors if not using 'api' instance!
                // Wait, LoginPage uses 'axios' directly!
                notify.error('Error de conexión.');
            } else {
                notify.error(err.response?.data?.message || 'Error al iniciar sesión');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Sign In</h2>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
