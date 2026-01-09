import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { SectionLoader } from '../../../components/ui/SectionLoader';
import { DollarSign, ArrowUpRight, ArrowDownLeft, FileText, Filter } from 'lucide-react';

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.type = typeFilter;

            const res = await api.get('/transactions', { params });
            setTransactions(res.data.data);
            setTotalPages(Math.ceil(res.data.total / 10));
        } catch (error) {
            // Error handled by global interceptor
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const res = await api.get('/transactions/summary', { params: { month } });
            setSummary(res.data);
        } catch (error) {
            // Error handled by global interceptor
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [page, statusFilter, typeFilter]);

    useEffect(() => {
        loadSummary();
    }, [month]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-2">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
                    <DollarSign className="text-[var(--primary)]" />
                    Financial History
                </h1>
                <p className="text-[var(--muted)]">View and audit all financial transactions for this organization.</p>
            </div>

            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow border border-[var(--border)]">
                    <div className="text-sm text-[var(--muted)] mb-1">Total Payments ({month})</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        S/ {summary?.COMPLETED?.total?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{summary?.COMPLETED?.count || 0} Successful Transactions</div>
                </div>
                <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow border border-[var(--border)]">
                    <div className="text-sm text-[var(--muted)] mb-1">Failed Attempts ({month})</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        S/ {summary?.FAILED?.total?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{summary?.FAILED?.count || 0} Failed Attempts</div>
                </div>
                <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow border border-[var(--border)] flex items-center justify-between">
                    <div>
                        <div className="text-sm text-[var(--muted)] mb-1">Select Period</div>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text)]"
                        />
                    </div>
                    <FileText size={32} className="text-[var(--muted)] opacity-20" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border)]">
                <Filter size={18} className="text-[var(--muted)]" />
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent border-none text-sm text-[var(--text)] focus:ring-0"
                >
                    <option value="">All Types</option>
                    <option value="PAYMENT">Payments</option>
                    <option value="REFUND">Refunds</option>
                    <option value="ADJUSTMENT">Adjustments</option>
                </select>
                <div className="w-px h-4 bg-[var(--border)]"></div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none text-sm text-[var(--text)] focus:ring-0"
                >
                    <option value="">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                </select>
            </div>

            {/* Transactions Table */}
            <div className="bg-[var(--card-bg)] shadow rounded-lg overflow-hidden border border-[var(--border)] flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--bg-primary)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8">
                                        <SectionLoader message="Cargando historial..." />
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center text-[var(--muted)]">No transactions found for this period.</td></tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-[var(--bg-primary)]">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)]">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text)]">
                                            <div className="font-medium">{tx.description}</div>
                                            <div className="text-xs text-[var(--muted)]">{tx.provider}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold 
                                                ${tx.type === 'PAYMENT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    tx.type === 'REFUND' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {tx.type === 'PAYMENT' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text)]">
                                            {tx.currency} {parseFloat(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-[var(--muted)]">
                                            {tx.referenceCode || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="p-4 border-t border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-[var(--text)]"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[var(--muted)]">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-[var(--text)]"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
