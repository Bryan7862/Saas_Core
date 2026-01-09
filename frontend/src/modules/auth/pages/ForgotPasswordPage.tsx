import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Ingresa tu email');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/auth/forgot-password', { email });
            setSent(true);
            toast.success('Revisa tu correo electrónico');
        } catch {
            // Still show success to not reveal if email exists
            setSent(true);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'var(--bg-primary)'
            }}>
                <div style={{
                    padding: '2.5rem',
                    backgroundColor: 'var(--surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '420px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#10b98120',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle size={32} color="#10b981" />
                    </div>
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>
                        ¡Revisa tu correo!
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Si existe una cuenta con <strong style={{ color: 'var(--text)' }}>{email}</strong>,
                        recibirás un enlace para restablecer tu contraseña.
                    </p>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            fontWeight: '500',
                            textDecoration: 'none'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <div style={{
                padding: '2.5rem',
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '420px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Mail size={28} color="white" />
                    </div>
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        ¿Olvidaste tu contraseña?
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                        No te preocupes, te enviaremos un enlace para restablecerla.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--text)'
                        }}>
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                backgroundColor: 'var(--input-bg)',
                                color: 'var(--text)'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            'Enviar enlace de recuperación'
                        )}
                    </button>

                    <Link
                        to="/login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: 'var(--muted)',
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            marginTop: '0.5rem'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Volver al inicio de sesión
                    </Link>
                </form>
            </div>
        </div>
    );
};
