import { useClients } from '../../clients/context/ClientsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Award, Zap, Star } from 'lucide-react';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export const FrequentClientsReportPage = () => {
    const { clients } = useClients();

    // Mock analysis data based on current clients
    const topClientsData = clients.slice(0, 5).map((c, i) => ({
        name: c.name.split(' ')[0], // Short name for chart
        fullName: c.name,
        purchases: 15 - (i * 2), // Mock data
        volume: 12000 - (i * 1500), // Mock data
        points: 1200 - (i * 100)
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Clientes Frecuentes</h1>
                    <p className="text-[var(--muted)]">Ranking de fidelidad y volumen de compra</p>
                </div>
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    Programa de Puntos Activo
                </div>
            </div>

            {/* Top 3 Medals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topClientsData.slice(0, 3).map((client, index) => (
                    <div key={index} className="relative bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] overflow-hidden">
                        <div className={`absolute top-0 right-0 p-2 text-white font-bold text-xs rounded-bl-xl
                            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                            #{index + 1}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border)] flex items-center justify-center font-bold text-lg">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold truncate w-32">{client.fullName}</h4>
                                <p className="text-xs text-[var(--muted)]">{client.purchases} compras totales</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-center border-t border-[var(--border)] pt-4">
                            <div>
                                <p className="text-[10px] text-[var(--muted)] uppercase">Volumen</p>
                                <p className="text-sm font-bold">S/ {client.volume.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-[var(--muted)] uppercase">Puntos</p>
                                <p className="text-sm font-bold text-[var(--primary)]">{client.points}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Chart */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" />
                        Top 5 Clientes por Volumen de Compra (S/)
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topClientsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-primary)', opacity: 0.5 }}
                                    contentStyle={{ backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                />
                                <Bar dataKey="volume" radius={[4, 4, 0, 0]} barSize={40}>
                                    {topClientsData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="space-y-4">
                    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-blue-500" />
                            Insights de Fidelización
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/20">
                                    <Users size={20} />
                                </div>
                                <p className="text-sm text-[var(--muted)]">
                                    El <span className="text-[var(--text)] font-bold">20% de tus clientes</span> genera el <span className="text-[var(--text)] font-bold">80% de tus ingresos</span> mensuales.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 dark:bg-emerald-900/20">
                                    <Award size={20} />
                                </div>
                                <p className="text-sm text-[var(--muted)]">
                                    La frecuencia promedio de compra ha <span className="text-emerald-500 font-bold">subido un 5%</span> este último mes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg shadow-blue-500/20">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Star size={18} />
                            Tip de Negocio
                        </h4>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Ofrece descuentos exclusivos a tus 3 mejores clientes el próximo mes para asegurar su retención y aumentar su ticket promedio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
