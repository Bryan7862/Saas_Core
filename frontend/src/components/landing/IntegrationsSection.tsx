import { Smartphone } from 'lucide-react';

const integrations = [
    { name: 'SUNAT', desc: 'Facturación electrónica' },
    { name: 'Yape', desc: 'Pagos QR' },
    { name: 'Izipay', desc: 'POS integrado' },
    { name: 'WhatsApp', desc: 'Notificaciones' },
];

export const IntegrationsSection = () => {
    return (
        <section className="py-24 bg-gray-900 overflow-hidden transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Dashboard Mockup */}
                    <div className="relative">
                        {/* Dashboard Card */}
                        <div className="bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-10 bg-gray-900 border-b border-gray-800 flex items-center px-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-300">
                                        nexuserp.com/reportes
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 bg-gray-950">
                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">S/ 12,450</div>
                                        <div className="text-xs text-gray-400">Hoy</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">847</div>
                                        <div className="text-xs text-gray-400">Transacciones</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-teal-400">+18%</div>
                                        <div className="text-xs text-gray-400">vs. Ayer</div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="mb-4">
                                    <div className="flex items-end gap-2 h-32">
                                        {[45, 65, 55, 80, 70, 95, 85, 75, 90, 60, 85, 92].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t hover:from-teal-500 hover:to-teal-400 transition-all cursor-pointer"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge - BLANCO para contraste */}
                        <div className="absolute -bottom-4 right-8 bg-white rounded-xl p-4 shadow-xl">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Crecimiento</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center">
                                +124%
                                <span className="ml-2 text-lg">📈</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                            Conecta con las herramientas que ya usas
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            Nexus ERP se integra perfectamente con los sistemas más populares en Perú.
                            Facturación electrónica, pagos digitales, notificaciones y más —
                            todo sincronizado automáticamente.
                        </p>

                        {/* Integrations Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {integrations.map((integration, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-all"
                                >
                                    <div className="text-white font-semibold mb-1">{integration.name}</div>
                                    <div className="text-sm text-gray-400">{integration.desc}</div>
                                </div>
                            ))}
                        </div>

                        {/* App Mobile - MÁS CONTRASTE */}
                        <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                <Smartphone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="text-gray-900 font-semibold">App Móvil Incluida</div>
                                <div className="text-sm text-gray-600">Gestiona tu negocio desde tu celular. iOS y Android.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
