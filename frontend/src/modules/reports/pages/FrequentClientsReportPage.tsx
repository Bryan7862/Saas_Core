import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Award, Zap, Star, Loader2 } from 'lucide-react';
import { getFrequentClients, ClientFrequency } from '../supabaseApi';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export const FrequentClientsReportPage = () => {
    const [topClientsData, setTopClientsData] = useState<ClientFrequency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const clients = await getFrequentClients();
                setTopClientsData(clients.slice(0, 5));
            } catch (err) {
                console.error('Error loading frequent clients:', err);
                setError('Error al cargar datos de clientes frecuentes');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Prepare chart data with short names
    const chartData = topClientsData.map(c => ({
        ...c,
        shortName: c.name.split(' ')[0]
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <span className="ml-2 text-[var(--muted)]">Cargando clientes frecuentes...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

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
                {topClientsData.length > 0 ? (
                    topClientsData.slice(0, 3).map((client, index) => (
                        <div key={client.id} className="relative bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] overflow-hidden">
                            <div className={`absolute top-0 right-0 p-2 text-white font-bold text-xs rounded-bl-xl
                                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                                #{index + 1}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border)] flex items-center justify-center font-bold text-lg">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold truncate w-32">{client.name}</h4>
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
                    ))
                ) : (
                    <div className="col-span-3 flex items-center justify-center h-32 text-[var(--muted)]">
                        No hay clientes registrados
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Chart */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" />
                        Top 5 Clientes por Volumen de Compra (S/)
                    </h3>
                    <div className="h-72">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="shortName" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-primary)', opacity: 0.5 }}
                                        contentStyle={{ backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    />
                                    <Bar dataKey="volume" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--muted)]">
                                No hay datos de volumen
                            </div>
                        )}
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
                                    {topClientsData.length > 0 ? (
                                        <>
                                            El <span className="text-[var(--text)] font-bold">top {Math.min(topClientsData.length, 5)} clientes</span> representan el núcleo de tus <span className="text-[var(--text)] font-bold">ingresos recurrentes</span>.
                                        </>
                                    ) : (
                                        'Registra clientes para ver insights de fidelización.'
                                    )}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 dark:bg-emerald-900/20">
                                    <Award size={20} />
                                </div>
                                <p className="text-sm text-[var(--muted)]">
                                    {topClientsData.length > 0 ? (
                                        <>
                                            Volumen total de top clientes: <span className="text-emerald-500 font-bold">S/ {topClientsData.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}</span>
                                        </>
                                    ) : (
                                        'Los datos de volumen aparecerán cuando tengas clientes registrados.'
                                    )}
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
                            Ofrece descuentos exclusivos a tus mejores clientes el próximo mes para asegurar su retención y aumentar su ticket promedio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
