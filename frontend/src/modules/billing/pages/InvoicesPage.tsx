import { useState } from 'react';
import { FileText, Plus, Search, Download, Trash2, Eye, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useBilling, Invoice } from '../context/BillingContext';

export const InvoicesPage = () => {
    const { invoices, cancelInvoice } = useBilling();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Todos');

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'Todos' || inv.type === filterType;
        return matchesSearch && matchesType;
    });

    const getStatusStyle = (status: Invoice['status']) => {
        switch (status) {
            case 'Aceptado': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Emitido': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Rechazado': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            case 'Anulado': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: Invoice['status']) => {
        switch (status) {
            case 'Aceptado': return <CheckCircle size={14} />;
            case 'Emitido': return <Clock size={14} />;
            case 'Rechazado': return <XCircle size={14} />;
            case 'Anulado': return <Trash2 size={14} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Comprobantes Electrónicos</h1>
                    <p className="text-[var(--muted)]">Gestiona tus Boletas y Facturas electrónicas</p>
                </div>
                <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-md active:scale-95">
                    <Plus size={20} />
                    Nuevo Comprobante
                </button>
            </div>

            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por número o cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-[var(--muted)]" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none"
                    >
                        <option value="Todos">Todos los tipos</option>
                        <option value="Factura">Facturas</option>
                        <option value="Boleta">Boletas</option>
                    </select>
                </div>
            </div>

            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-primary)]/50 text-[var(--muted)] text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Documento</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Monto</th>
                                <th className="px-6 py-4">Estado SUNAT</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-[var(--bg-primary)]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${inv.type === 'Factura' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'} dark:bg-opacity-10`}>
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{inv.number}</p>
                                                <p className="text-[10px] text-[var(--muted)] uppercase">{inv.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{inv.client}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">{inv.date}</td>
                                    <td className="px-6 py-4 font-bold">S/ {inv.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(inv.status)}`}>
                                            {getStatusIcon(inv.status)}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-md text-[var(--muted)] hover:text-[var(--primary)] transition-colors" title="Ver detalle">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-md text-[var(--muted)] hover:text-blue-500 transition-colors" title="Descargar PDF">
                                                <Download size={18} />
                                            </button>
                                            {inv.status !== 'Anulado' && (
                                                <button
                                                    onClick={() => cancelInvoice(inv.id)}
                                                    className="p-1.5 hover:bg-rose-50 rounded-md text-[var(--muted)] hover:text-rose-500 transition-colors"
                                                    title="Anular comprobante"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
