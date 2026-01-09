import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setLoading(false);
            setError('Enlace inválido. No se encontró el token de verificación.');
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            await api.post('/admin/auth/verify-email', { token });
            setSuccess(true);
            toast.success('¡Email verificado correctamente!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error al verificar email';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        const email = prompt('Ingresa tu email:');
        if (!email) return;

        setResending(true);
        try {
            await api.post('/admin/auth/resend-verification', { email });
            toast.success('Si el email existe, recibirás un nuevo enlace');
        } catch {
            toast.error('Error al reenviar verificación');
        } finally {
            setResending(false);
        }
    };

    // Loading
    if (loading) {
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
                    textAlign: 'center'
                }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text)' }}>Verificando email...</p>
                </div>
            </div>
        );
    }

    // Success
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
                    textAlign: 'center',
                    maxWidth: '420px'
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
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.75rem' }}>¡Email verificado!</h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                        Tu cuenta está lista. Serás redirigido al inicio de sesión...
                    </p>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    // Error
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
                textAlign: 'center',
                maxWidth: '420px'
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
                <h2 style={{ color: 'var(--text)', marginBottom: '0.75rem' }}>Error de verificación</h2>
                <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{error}</p>
                <button
                    onClick={handleResend}
                    disabled={resending}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: resending ? 'not-allowed' : 'pointer',
                        opacity: resending ? 0.7 : 1
                    }}
                >
                    {resending ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                    Reenviar verificación
                </button>
                <div style={{ marginTop: '1rem' }}>
                    <Link to="/login" style={{ color: 'var(--muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};
