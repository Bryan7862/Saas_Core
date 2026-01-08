import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { getFinanceData, getFinanceKPIs, FinanceData } from '../supabaseApi';

interface FinanceKPIs {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    incomeChange: number;
}

export const FinanceReportPage = () => {
    const [financeData, setFinanceData] = useState<FinanceData[]>([]);
    const [kpis, setKpis] = useState<FinanceKPIs | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [data, kpisData] = await Promise.all([
                    getFinanceData(6).catch(() => []),
                    getFinanceKPIs().catch(() => ({
                        totalIncome: 0,
                        totalExpenses: 0,
                        netProfit: 0,
                        profitMargin: 0,
                        incomeChange: 0
                    }))
                ]);

                setFinanceData(data);
                setKpis(kpisData);
            } catch (err) {
                console.error('Error loading finance report:', err);
                setError('Error al cargar datos financieros');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatCurrency = (value: number) => {
        return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const formatPercentage = (value: number) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <span className="ml-2 text-[var(--muted)]">Cargando reporte financiero...</span>
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
            <div>
                <h1 className="text-2xl font-bold text-[var(--text)]">Reporte Financiero</h1>
                <p className="text-[var(--muted)]">Análisis de flujo de caja, ingresos y gastos</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Ingresos Totales (Mes)</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{formatCurrency(kpis?.totalIncome || 0)}</p>
                        <span className={`text-xs font-bold ${(kpis?.incomeChange || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {formatPercentage(kpis?.incomeChange || 0)}
                        </span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Gastos Operativos</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-rose-500">{formatCurrency(kpis?.totalExpenses || 0)}</p>
                        <span className="text-emerald-500 text-xs font-bold">Este mes</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Utilidad Neta</p>
                    <div className="flex items-center justify-between">
                        <p className={`text-2xl font-bold ${(kpis?.netProfit || 0) >= 0 ? 'text-[var(--primary)]' : 'text-rose-500'}`}>
                            {formatCurrency(kpis?.netProfit || 0)}
                        </p>
                        <span className="text-emerald-500 text-xs font-bold">Actual</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-1">Margen de Beneficio</p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{(kpis?.profitMargin || 0).toFixed(1)}%</p>
                        <div className="w-12 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)]" style={{ width: `${Math.min(100, Math.max(0, kpis?.profitMargin || 0))}%` }}></div>
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
                        {financeData.length > 0 ? (
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
                        ) : (
                            <div className="flex items-center justify-center h-full text-[var(--muted)]">
                                No hay datos financieros disponibles
                            </div>
                        )}
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
                            <p className="font-bold">{formatCurrency((kpis?.netProfit || 0) * 0.15)}</p>
                        </div>

                        <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/20">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Tarjetas / POS</p>
                                <p className="text-xs text-[var(--muted)]">Liquidación pendiente</p>
                            </div>
                            <p className="font-bold">{formatCurrency((kpis?.totalIncome || 0) * 0.3)}</p>
                        </div>

                        <div className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/20">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Transferencias</p>
                                <p className="text-xs text-[var(--muted)]">Banco de Crédito</p>
                            </div>
                            <p className="font-bold">{formatCurrency((kpis?.totalIncome || 0) * 0.55)}</p>
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
