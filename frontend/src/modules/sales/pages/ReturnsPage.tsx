import { useState, useEffect } from 'react';
import { Search, Download, FileText, AlertCircle, X, Calendar, DollarSign, Type } from 'lucide-react';
import { getTransactions, createTransaction, Transaction } from '../../dashboard/api';
import toast from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';

export const ReturnsPage = () => {
    const { theme } = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        search: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category: 'Devolución'
    });

    const loadReturns = async () => {
        setLoading(true);
        try {
            // Filter strictly for returns (REFUND)
            const response = await getTransactions({
                type: 'REFUND',
                limit: 50,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined
            });
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar devoluciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReturns();
    }, [filters.startDate, filters.endDate]);

    const handleCreateReturn = async () => {
        if (!formData.amount || !formData.date) {
            toast.error('Completa los campos obligatorios');
            return;
        }

        try {
            await createTransaction({
                date: formData.date,
                type: 'REFUND',
                amount: parseFloat(formData.amount),
                description: formData.description || 'Devolución General',
                category: formData.category
            });
            toast.success('Devolución registrada correctamente');
            setShowModal(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                description: '',
                category: 'Devolución'
            });
            loadReturns();
        } catch (error) {
            console.error(error);
            toast.error('Error al registrar devolución');
        }
    };

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error('No hay datos para exportar');
            return;
        }

        const dataToExport = transactions.map(tx => ({
            Fecha: tx.date,
            Descripcion: tx.description,
            Monto: tx.amount,
            Tipo: 'Devolución'
        }));

        import('../../../lib/export').then(mod => {
            mod.exportToCSV(dataToExport, `Devoluciones_${new Date().toISOString().split('T')[0]}`);
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
                    <h1 className="text-2xl font-bold text-[var(--text)]">Devoluciones</h1>
                    <p className="text-[var(--muted)]">Gestionar devoluciones y reembolsos</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-[var(--bg-primary)] flex items-center gap-2"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 flex items-center gap-2 font-medium"
                    >
                        <FileText size={18} />
                        Nueva Devolución
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por descripción..."
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
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Monto Reembolsado</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Estado</th>
                                <th className="px-6 py-4 font-semibold text-[var(--text)]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">
                                        Cargando devoluciones...
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No se encontraron devoluciones.
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
                                        <td className="px-6 py-4 font-bold text-red-600">
                                            S/ {Number(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                Reembolsado
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-[var(--border)] rounded-full text-[var(--muted)] hover:text-[var(--text)]">
                                                <AlertCircle size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-xl w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[var(--text)]">Registrar Nueva Devolución</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-[var(--muted)] hover:text-[var(--text)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Fecha</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Motivo / Descripción</label>
                                <div className="relative">
                                    <Type size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Ej: Producto defectuoso"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Monto a Reembolsar (S/)</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] font-bold text-red-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateReturn}
                                className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 mt-4"
                            >
                                Confirmar Devolución
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
