import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';

const financeData = [
    { month: 'Ene', ingresos: 45000, egresos: 32000, margen: 13000 },
    { month: 'Feb', ingresos: 52000, egresos: 35000, margen: 17000 },
    { month: 'Mar', ingresos: 48000, egresos: 34000, margen: 14000 },
    { month: 'Abr', ingresos: 61000, egresos: 38000, margen: 23000 },
    { month: 'May', ingresos: 55000, egresos: 36000, margen: 19000 },
    { month: 'Jun', ingresos: 67000, egresos: 41000, margen: 26000 },
];

export const FinanceReportPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text)]">Reporte Financiero</h1>
                <p className="text-[var(--muted)]">Análisis de flujo de caja, ingresos y gastos</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Ingresos Totales (Jun)</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">S/ 67,000</p>
                        <span className="text-emerald-500 text-xs font-bold">+12%</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Gastos Operativos</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-rose-500">S/ 41,000</p>
                        <span className="text-emerald-500 text-xs font-bold">-2%</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Utilidad Neta</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-[var(--primary)]">S/ 26,000</p>
                        <span className="text-emerald-500 text-xs font-bold">+18%</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Margen de Beneficio</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">38.8%</p>
                        <div className="w-12 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] w-[38%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Flow Chart */}
                <div className="lg:col-span-2 bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-[var(--primary)]" />
                        Historial de Ingresos vs Egresos
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financeData}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                                <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={3} />
                                <Area type="monotone" dataKey="egresos" stroke="#ef4444" fillOpacity={1} fill="url(#colorEgresos)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Account Balances / Payment Methods */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold">Cuentas y Métodos</h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/20">
                                <Wallet size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Efectivo en Caja</p>
                                <p className="text-xs text-[var(--muted)]">Saldo disponible</p>
                            </div>
                            <p className="font-bold">S/ 4,250</p>
                        </div>

                        <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/20">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Tarjetas / POS</p>
                                <p className="text-xs text-[var(--muted)]">Liquidación pendiente</p>
                            </div>
                            <p className="font-bold">S/ 12,800</p>
                        </div>

                        <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/20">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Transferencias</p>
                                <p className="text-xs text-[var(--muted)]">Banco de Crédito</p>
                            </div>
                            <p className="font-bold">S/ 48,500</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                        <button className="w-full py-2 bg-[var(--bg-soft)] text-[var(--text)] rounded-lg text-sm font-medium hover:bg-[var(--border)] transition-colors">
                            Ver Libro Mayor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
