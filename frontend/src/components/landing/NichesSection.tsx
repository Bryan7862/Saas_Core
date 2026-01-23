import { Dumbbell, Store, Utensils, ArrowRight } from 'lucide-react';

const niches = [
    {
        icon: Dumbbell,
        title: "Gestión de Gimnasios",
        description: "Control de accesos, gestión de membresías, reservas de clases y seguimiento de entrenadores en una sola plataforma.",
    },
    {
        icon: Store,
        title: "Retail y POS",
        description: "Punto de venta ágil, inventario en tiempo real, fidelización de clientes y reportes de ventas detallados.",
    },
    {
        icon: Utensils,
        title: "Gastronomía",
        description: "Gestión de mesas, comandas digitales, control de recetas y stock de ingredientes para restaurantes eficientes.",
    },
];

export const NichesSection = () => {
    return (
        <section id="soluciones" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Soluciones Especializadas
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400 text-lg">
                        Software adaptado a las necesidades específicas de su industria, sin complicaciones innecesarias.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {niches.map((niche, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                                <niche.icon className="h-6 w-6 text-gray-900 dark:text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{niche.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm">
                                {niche.description}
                            </p>

                            {/* Link */}
                            <a
                                href="#"
                                className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white hover:underline underline-offset-4"
                            >
                                Explorar módulo
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
