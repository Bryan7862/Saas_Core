import { TrendingUp, Zap, Cloud } from 'lucide-react';

const features = [
    {
        icon: TrendingUp,
        title: "Analítica en Tiempo Real",
        desc: "Paneles de control actualizados al segundo para monitorizar KPIs críticos."
    },
    {
        icon: Zap,
        title: "Automatización Inteligente",
        desc: "Reduzca tareas repetitivas. Facturación, recordatorios y reportes automáticos."
    },
    {
        icon: Cloud,
        title: "Nube Segura",
        desc: "Acceso desde cualquier lugar, con los más altos estándares de seguridad y encriptación."
    },
];

export const FeaturesSection = () => {
    return (
        <section id="beneficios" className="py-24 bg-white dark:bg-gray-950 overflow-hidden transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                            Potencie el crecimiento<br />
                            con datos reales.
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                            Deje de adivinar y empiece a tomar decisiones estratégicas. Nuestra plataforma centraliza toda la información vital de su negocio.
                        </p>

                        {/* Features List */}
                        <div className="space-y-6">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <feature.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                            {feature.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Dashboard Mockup */}
                    <div className="relative">
                        {/* Main Dashboard Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 space-y-4">
                                {/* Placeholder bars */}
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>

                                {/* Content rows */}
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats Badge */}
                        <div className="absolute -bottom-4 -right-4 lg:bottom-8 lg:right-0 bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-xl shadow-xl">
                            <div className="text-xs font-medium text-gray-400 mb-1">Crecimiento Mensual</div>
                            <div className="text-2xl font-bold flex items-center">
                                +124%
                                <TrendingUp className="ml-2 h-5 w-5 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
