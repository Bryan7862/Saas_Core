import { useState } from 'react';
import { FileText, Plus, Search, Download, Trash2, Eye, Filter, CheckCircle, Clock, XCircle, Loader2, X } from 'lucide-react';
import { useBilling, Invoice } from '../context/BillingContext';

export const InvoicesPage = () => {
    const { invoices, cancelInvoice, addInvoice, loading, error } = useBilling();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Boleta' as 'Boleta' | 'Factura',
        client: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

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

    const generateInvoiceNumber = () => {
        const prefix = formData.type === 'Factura' ? 'F001' : 'B001';
        const count = invoices.filter(inv => inv.type === formData.type).length + 1;
        return `${prefix}-${String(count).padStart(4, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.client || !formData.amount) return;

        setIsSaving(true);
        try {
            await addInvoice({
                number: generateInvoiceNumber(),
                type: formData.type,
                client: formData.client,
                date: formData.date,
                amount: parseFloat(formData.amount)
            });
            setShowModal(false);
            setFormData({
                type: 'Boleta',
                client: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            console.error('Error creating invoice:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <span className="ml-2 text-[var(--muted)]">Cargando comprobantes...</span>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Comprobantes Electrónicos</h1>
                    <p className="text-[var(--muted)]">Gestiona tus Boletas y Facturas electrónicas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-md active:scale-95"
                >
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
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                                        No hay comprobantes registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para crear comprobante */}
            {showModal && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)]">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                            <h2 className="text-xl font-bold">Nuevo Comprobante</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tipo de Comprobante</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Boleta' | 'Factura' })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                >
                                    <option value="Boleta">Boleta</option>
                                    <option value="Factura">Factura</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                                    {formData.type === 'Factura' ? 'Razón Social / RUC' : 'Nombre del Cliente'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    placeholder={formData.type === 'Factura' ? 'Empresa S.A.C.' : 'Juan Pérez'}
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Monto (S/)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Fecha de Emisión</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    required
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    <span className="font-bold">Número asignado:</span> {generateInvoiceNumber()}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || !formData.client || !formData.amount}
                                    className="flex-1 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={18} />
                                            Emitir Comprobante
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
