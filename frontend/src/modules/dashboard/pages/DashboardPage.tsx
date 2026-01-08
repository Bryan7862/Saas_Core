import { useEffect, useState } from 'react';
import {
    Users,
    FileText,
    Package,
    TrendingUp,
    TrendingDown,
    DollarSign,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Edit2
} from 'lucide-react';
import { getKpis, getTransactions, updateKpi, deleteTransaction, KpiData, Transaction } from '../supabaseApi';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [kpiData, txData] = await Promise.all([
                getKpis(),
                getTransactions() // This returns array of Transaction
            ]);
            setKpis(kpiData);
            setTransactions(txData.data.slice(0, 5)); // Take only last 5
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar esta transacción?')) return;
        try {
            await deleteTransaction(id);
            toast.success('Transacción eliminada');
            fetchData();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleUpdateManualKpi = async (type: string, currentVal: number) => {
        const newVal = prompt(`Ingrese nuevo valor para ${type}:`, currentVal.toString());
        if (newVal !== null) {
            const num = parseInt(newVal);
            if (!isNaN(num)) {
                try {
                    await updateKpi({ kpiType: type.toLowerCase(), value: num });
                    toast.success('Actualizado correctamente');
                    fetchData(); // Refresh to see changes
                } catch (e) {
                    toast.error('Error al actualizar');
                }
            } else {
                toast.error('Ingrese un número válido');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return `S/. ${amount.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Resumen General</h1>
                    <p className="text-[var(--muted)]">Bienvenido de nuevo, aquí tienes lo último de tu negocio.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--bg-primary)] transition-colors"
                >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    Actualizar
                </button>
            </div>

            {/* Financial Overview (Real Data) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingresos CAD */}
                <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={48} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-[var(--muted)] font-medium">Ingresos Totales</h3>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-[var(--text)] tracking-tight">
                            {formatCurrency(kpis?.ingresos || 0)}
                        </span>
                        <p className="text-sm text-emerald-500 mt-1 flex items-center font-medium">
                            <ArrowUpRight size={14} className="mr-1" />
                            Mes Actual
                        </p>
                    </div>
                </div>

                {/* Gastos Card */}
                <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown size={48} className="text-rose-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-[var(--muted)] font-medium">Gastos Totales</h3>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-[var(--text)] tracking-tight">
                            {formatCurrency(kpis?.gastos || 0)}
                        </span>
                        <p className="text-sm text-rose-500 mt-1 flex items-center font-medium">
                            <ArrowDownRight size={14} className="mr-1" />
                            Mes Actual
                        </p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={48} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-[var(--muted)] font-medium">Balance Neto</h3>
                    </div>
                    <div>
                        <span className={`text-3xl font-bold tracking-tight ${(kpis?.balance || 0) >= 0 ? 'text-[var(--text)]' : 'text-rose-500'}`}>
                            {formatCurrency(kpis?.balance || 0)}
                        </span>
                        <p className="text-sm text-[var(--muted)] mt-1">
                            Disponibilidad
                        </p>
                    </div>
                </div>
            </div>

            {/* Operational Metrics (Manual Data) */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Métricas Operativas (Manuales)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Clientes */}
                    <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] flex items-center justify-between hover:border-[var(--primary)] transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-lg">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--muted)]">Clientes Activos</p>
                                <p className="text-xl font-bold text-[var(--text)]">{kpis?.clientes || 0}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpdateManualKpi('Clientes', kpis?.clientes || 0)}
                            className="p-2 text-[var(--muted)] hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Actualizar manualmente"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                    {/* Facturas */}
                    <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] flex items-center justify-between hover:border-[var(--primary)] transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--muted)]">Facturas Emitidas</p>
                                <p className="text-xl font-bold text-[var(--text)]">{kpis?.facturas || 0}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpdateManualKpi('Facturas', kpis?.facturas || 0)}
                            className="p-2 text-[var(--muted)] hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Actualizar manualmente"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                    {/* Inventario */}
                    <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] flex items-center justify-between hover:border-[var(--primary)] transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--muted)]">Items en Inventario</p>
                                <p className="text-xl font-bold text-[var(--text)]">{kpis?.inventario || 0}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpdateManualKpi('Inventario', kpis?.inventario || 0)}
                            className="p-2 text-[var(--muted)] hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Actualizar manualmente"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[var(--text)]">Transacciones Recientes</h2>
                    <a href="/transactions" className="text-sm text-[var(--primary)] hover:underline font-medium">Ver todas</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No hay transacciones recientes
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                                            {new Date(tx.date).toLocaleDateString('es-PE')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text)] font-medium">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--bg-primary)] text-[var(--muted)] border border-[var(--border)]">
                                                {tx.category || 'General'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${tx.type === 'ingreso' ? 'text-emerald-500' : 'text-rose-500'
                                            }`}>
                                            {tx.type === 'ingreso' ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => handleDeleteTransaction(tx.id)}
                                                className="text-rose-500 hover:text-rose-700 transition-colors"
                                                title="Eliminar"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
