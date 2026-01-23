import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                    Listo para optimizar su negocio?
                </h2>

                <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                    Únase a más de 500 empresas que ya confían en Nexus ERP para gestionar sus operaciones diarias.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-all flex items-center justify-center"
                    >
                        Registrarse Ahora
                    </button>
                    <button
                        className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base border border-gray-600 text-white hover:bg-gray-800 transition-all flex items-center justify-center"
                    >
                        Contactar Ventas
                    </button>
                </div>
            </div>
        </section>
    );
};
