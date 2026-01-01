import { useEffect, useState } from 'react';
import { Check, Loader2, CreditCard } from 'lucide-react';
import { getCurrentSubscription, createPaymentOrder, confirmPayment, Subscription } from '../api';

const PLANS = [
    {
        code: 'BASIC',
        name: 'Básico',
        price: 'S/ 50',
        period: '/mes',
        features: ['Hasta 1 Usuario', 'Facturación', 'Soporte Email'],
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    },
    {
        code: 'PRO',
        name: 'Pro',
        price: 'S/ 100',
        period: '/mes',
        features: ['Hasta 5 Usuarios', 'Productos Ilimitados', 'Acceso API', 'Soporte Prioritario'],
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        primary: true,
    },
    {
        code: 'MAX',
        name: 'Max',
        price: 'S/ 200',
        period: '/mes',
        features: ['Hasta 20 Usuarios', 'Todo lo de PRO', 'Soporte VIP', 'Auditoría Avanzada'],
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    },
];

declare global {
    interface Window {
        Culqi: any;
        culqi: () => void;
    }
}

export const PricingPage = () => {
    const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        loadSubscription();

        // Inject Culqi Script
        const script = document.createElement('script');
        script.src = 'https://checkout.culqi.com/js/v4';
        script.async = true;
        document.body.appendChild(script);

        // Define Culqi callback
        window.culqi = () => {
            if (window.Culqi.token) {
                console.log('Token created:', window.Culqi.token.id);
                window.Culqi.close();
                alert('¡Pago en proceso! Tu suscripción se activará en breve.');
                window.location.reload();
            } else {
                console.error('Culqi Error:', window.Culqi.error);
                alert(window.Culqi.error.user_message);
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const loadSubscription = async () => {
        try {
            const sub = await getCurrentSubscription();
            setCurrentSub(sub);
        } catch (error) {
            console.error('Failed to load subscription', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planCode: string) => {
        setProcessing(planCode);
        try {
            const orderInfo = await createPaymentOrder(planCode);

            if (window.Culqi) {
                window.Culqi.publicKey = orderInfo.publicKey;
                window.Culqi.settings({
                    title: 'Suscripción SaaS',
                    currency: 'PEN',
                    description: orderInfo.description,
                    amount: orderInfo.amount,
                    order: orderInfo.orderId
                });

                window.Culqi.options({
                    style: {
                        logo: 'https://static.culqi.com/v2/v2/static/img/logo.png',
                        maincolor: '#0ec1c1',
                        headcolor: '#0ec1c1',
                    }
                });

                window.Culqi.open();
                setProcessing(null);
            } else {
                alert('Error: Culqi no cargó correctamente. Refresca la página.');
                setProcessing(null);
            }

        } catch (error) {
            console.error('Checkout failed', error);
            alert('Error al iniciar el pago. Inténtalo de nuevo.');
            setProcessing(null);
        }
    };

    const getDaysRemaining = (endsAt: string | undefined) => {
        if (!endsAt) return 0;
        const end = new Date(endsAt);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando planes...</div>;

    const isTrial = currentSub?.status === 'TRIAL';
    const trialDays = isTrial ? getDaysRemaining(currentSub?.endsAt) : 0;

    return (
        <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-[var(--text)] mb-4">Planes flexibles para tu crecimiento</h1>
                <p className="text-[var(--muted)]">Elige el plan que mejor se adapte a tu equipo.</p>

                {isTrial && (
                    <div className="mt-4 inline-block bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4" role="alert">
                        <p className="font-bold">Modo de Prueba Activo</p>
                        <p>Te quedan {trialDays} días de prueba gratuita. Elige un plan para no perder acceso.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                    const isCurrent = currentSub?.planCode === plan.code && currentSub?.status !== 'TRIAL';
                    // Disable button if current (active) OR if currently processing
                    const isDisabled = isCurrent || !!processing;

                    return (
                        <div
                            key={plan.code}
                            className={`relative p-8 bg-[var(--card-bg)] border rounded-2xl shadow-sm flex flex-col transition-transform hover:scale-105 ${plan.primary ? 'ring-2 ring-indigo-500 border-transparent' : 'border-[var(--border)]'
                                }`}
                        >
                            {isCurrent && (
                                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide">
                                    Plan Actual
                                </span>
                            )}

                            <h3 className={`text-xl font-semibold ${plan.code === 'MAX' ? 'text-red-500' : 'text-[var(--text)]'
                                }`}>{plan.name}</h3>

                            <div className="mt-4 flex items-baseline text-[var(--text)]">
                                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                {plan.period && <span className="ml-1 text-xl text-[var(--muted)]">{plan.period}</span>}
                            </div>

                            <ul className="mt-6 space-y-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex">
                                        <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span className="ml-3 text-[var(--muted)]">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !isDisabled && handleSubscribe(plan.code)}
                                disabled={isDisabled}
                                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium transition-colors ${isCurrent
                                    ? 'bg-[var(--bg-primary)] text-[var(--muted)] cursor-not-allowed'
                                    : 'bg-[var(--primary)] text-white hover:opacity-90 shadow-md'
                                    }`}
                            >
                                {processing === plan.code ? 'Cargando Culqi...' : isCurrent ? 'Tu Plan Actual' : 'Suscribirse'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
