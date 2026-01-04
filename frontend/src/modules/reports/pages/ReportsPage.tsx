import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, CreditCard, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const salesTrendData = [
    { name: 'Ene', monto: 12500, transacciones: 120 },
    { name: 'Feb', monto: 18400, transacciones: 145 },
    { name: 'Mar', monto: 15200, transacciones: 132 },
    { name: 'Abr', monto: 22800, transacciones: 198 },
    { name: 'May', monto: 28900, transacciones: 225 },
    { name: 'Jun', monto: 35400, transacciones: 280 },
];

const categoryData = [
    { name: 'Electrónica', value: 45 },
    { name: 'Accesorios', value: 25 },
    { name: 'Servicios', value: 20 },
    { name: 'Otros', value: 10 },
];

const topProducts = [
    { name: 'Laptop Pro 16"', sales: 45, revenue: 'S/ 225,000', stock: 12 },
    { name: 'Monitor Curvo 34"', sales: 32, revenue: 'S/ 48,000', stock: 8 },
    { name: 'Teclado Mecánico RGB', sales: 28, revenue: 'S/ 8,400', stock: 45 },
    { name: 'Silla Gamer Black', sales: 24, revenue: 'S/ 21,600', stock: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Reporte de Ventas</h1>
                    <p className="text-[var(--muted)]">Análisis de rendimiento comercial y tendencias</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none">
                        <option>Últimos 6 meses</option>
                        <option>Este año</option>
                        <option>Personalizado</option>
                    </select>
                </div>
            </div>

            {/* Premium KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp size={48} className="text-emerald-500" />
                    </div>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Ventas Totales</p>
                    <h3 className="text-2xl font-black">S/ 35,400</h3>
                    <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight size={14} />
                        <span>+22.4% vs mes ant.</span>
                    </div>
                </div>

                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={48} className="text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Transacciones</p>
                    <h3 className="text-2xl font-black">280</h3>
                    <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight size={14} />
                        <span>+15.2% vs mes ant.</span>
                    </div>
                </div>

                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CreditCard size={48} className="text-amber-500" />
                    </div>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Ticket Promedio</p>
                    <h3 className="text-2xl font-black">S/ 126.40</h3>
                    <div className="flex items-center gap-1 mt-2 text-rose-500 text-xs font-bold">
                        <ArrowDownRight size={14} />
                        <span>-3.1% vs mes ant.</span>
                    </div>
                </div>

                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={48} className="text-purple-500" />
                    </div>
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Nuevos Clientes</p>
                    <h3 className="text-2xl font-black">42</h3>
                    <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight size={14} />
                        <span>+8.5% esta semana</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Tendencia de Ingresos</h3>
                        <div className="flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-[var(--muted)]">Este Periodo</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesTrendData}>
                                <defs>
                                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-soft)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text)' }}
                                />
                                <Area type="monotone" dataKey="monto" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#salesColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Mix */}
                <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Mix de Productos (%)</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {categoryData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-[var(--text)]">{item.name}</span>
                                </div>
                                <span className="text-[var(--muted)] text-sm">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling Products List */}
                <div className="lg:col-span-3 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)]">
                        <h3 className="text-lg font-bold">Productos más Vendidos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-primary)]/50 text-[var(--muted)] text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Ventas</th>
                                    <th className="px-6 py-4">Ingresos</th>
                                    <th className="px-6 py-4">Stock Restante</th>
                                    <th className="px-6 py-4">Rendimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {topProducts.map((p, i) => (
                                    <tr key={i} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                        <td className="px-6 py-4 font-bold">{p.name}</td>
                                        <td className="px-6 py-4">{p.sales} u.</td>
                                        <td className="px-6 py-4 font-mono">{p.revenue}</td>
                                        <td className="px-6 py-4 text-[var(--muted)]">{p.stock} dispon.</td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${100 - (i * 15)}%` }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
