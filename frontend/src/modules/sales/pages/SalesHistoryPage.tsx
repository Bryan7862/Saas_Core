import { useState, useEffect } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { getTransactions, Transaction } from '../../dashboard/api';
import toast from 'react-hot-toast';

export const SalesHistoryPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        search: ''
    });

    const loadSales = async () => {
        setLoading(true);
        try {
            // Filter strictly for sales (ingreso)
            const response = await getTransactions({
                type: 'ingreso', // Use lowercase as per entity
                limit: 50,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined
            });
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar historial de ventas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSales();
    }, [filters.startDate, filters.endDate]); // Reload when dates change

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error('No hay datos para exportar');
            return;
        }

        const dataToExport = transactions.map(tx => ({
            Fecha: tx.date,
            Descripcion: tx.description,
            Categoria: tx.category || 'General',
            Monto: tx.amount,
            Tipo: tx.type
        }));

        import('../../../lib/export').then(mod => {
            mod.exportToCSV(dataToExport, `Ventas_${new Date().toISOString().split('T')[0]}`);
            toast.success('Exportación completa');
        });
    };

    const filteredTransactions = transactions.filter(tx =>
        tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (tx.category && tx.category.toLowerCase().includes(filters.search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Historial de Ventas</h1>
                    <p className="text-[var(--muted)]">Registro completo de todas las ventas realizadas</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-[var(--bg-primary)] flex items-center gap-2"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    {/* Add New Sale Button could link to POS */}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por descripción o categoría..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="pl-3 pr-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="pl-3 pr-2 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Descripción</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Categoría</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Monto</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Estado</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        Cargando ventas...
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No se encontraron ventas en este periodo.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-6 py-4 text-[var(--text)]">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 text-[var(--text)] font-medium">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {tx.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">
                                            S/ {Number(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                Completado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-[var(--border)] rounded-full text-[var(--muted)] hover:text-[var(--text)]">
                                                <FileText size={16} />
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
