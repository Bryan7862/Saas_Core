import { Check, X, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
    {
        name: "Starter",
        description: "Perfecto para negocios pequeños que están comenzando.",
        price: "49",
        period: "/mes",
        popular: false,
        features: [
            { text: "1 Usuario incluido", included: true },
            { text: "1 Punto de venta", included: true },
            { text: "500 Transacciones/mes", included: true },
            { text: "Inventario básico", included: true },
            { text: "Reportes esenciales", included: true },
            { text: "Soporte por email", included: true },
            { text: "Multi-sucursal", included: false },
            { text: "API Access", included: false },
        ],
        cta: "Comenzar Gratis",
        ctaStyle: "border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-black dark:hover:border-white"
    },
    {
        name: "Business",
        description: "Para negocios en crecimiento que necesitan más poder.",
        price: "149",
        period: "/mes",
        popular: true,
        features: [
            { text: "5 Usuarios incluidos", included: true },
            { text: "3 Puntos de venta", included: true },
            { text: "Transacciones ilimitadas", included: true },
            { text: "Inventario avanzado", included: true },
            { text: "Reportes completos + BI", included: true },
            { text: "Soporte prioritario 24/7", included: true },
            { text: "2 Sucursales", included: true },
            { text: "API Access", included: false },
        ],
        cta: "Comenzar Ahora",
        ctaStyle: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
    },
    {
        name: "Enterprise",
        description: "Solución completa para grandes operaciones.",
        price: "399",
        period: "/mes",
        popular: false,
        features: [
            { text: "Usuarios ilimitados", included: true },
            { text: "POS ilimitados", included: true },
            { text: "Transacciones ilimitadas", included: true },
            { text: "Inventario + Lotes + Venc.", included: true },
            { text: "BI Avanzado + Dashboards", included: true },
            { text: "Account Manager dedicado", included: true },
            { text: "Sucursales ilimitadas", included: true },
            { text: "API Access completo", included: true },
        ],
        cta: "Contactar Ventas",
        ctaStyle: "border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-black dark:hover:border-white"
    }
];

export const PricingSection = () => {
    const navigate = useNavigate();

    return (
        <section id="precios" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50 dark:bg-gray-900 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 mb-6">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Precios Transparentes</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Un plan para cada{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 dark:from-gray-400 to-gray-900 dark:to-white">
                            etapa de tu negocio
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Sin costos ocultos. Todos los planes incluyen soporte, actualizaciones y respaldo en la nube.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 transition-all duration-300 ${plan.popular
                                    ? 'shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border-2 border-black dark:border-white scale-105 z-10'
                                    : 'shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">S/</span>
                                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white mx-1">{plan.price}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        {feature.included ? (
                                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        ) : (
                                            <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-3 flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                onClick={() => plan.name === 'Enterprise' ? null : navigate('/register')}
                                className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center ${plan.ctaStyle}`}
                            >
                                {plan.cta}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Todos los precios en Soles (PEN). Impuestos no incluidos.
                        <a href="#" className="text-gray-900 dark:text-white font-medium hover:underline ml-1">
                            Ver comparación detallada →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};
