import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Enlace inválido. Solicita un nuevo enlace de recuperación.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/auth/reset-password', {
                token,
                newPassword: password
            });
            setSuccess(true);
            toast.success('¡Contraseña actualizada correctamente!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al restablecer contraseña';
            toast.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Error state
    if (error && !success) {
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
                        backgroundColor: '#ef444420',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <AlertCircle size={32} color="#ef4444" />
                    </div>
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>
                        Enlace inválido o expirado
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        {error}
                    </p>
                    <Link
                        to="/forgot-password"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '500',
                            textDecoration: 'none'
                        }}
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
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
                        ¡Contraseña actualizada!
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión...
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
                        Ir a iniciar sesión
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
                        <Lock size={28} color="white" />
                    </div>
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        Crear nueva contraseña
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                        Ingresa tu nueva contraseña segura.
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
                            Nueva Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 3rem 0.75rem 1rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text)'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--muted)'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--text)'
                        }}>
                            Confirmar Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite tu contraseña"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 3rem 0.75rem 1rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    backgroundColor: 'var(--input-bg)',
                                    color: 'var(--text)'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--muted)'
                                }}
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                                Guardando...
                            </>
                        ) : (
                            'Restablecer contraseña'
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
