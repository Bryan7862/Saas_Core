import { useState } from 'react';
import { Search, ShoppingBag, User, ArrowRight } from 'lucide-react';
import { useClients } from '../context/ClientsContext';

export const ClientHistoryPage = () => {
    const { clients } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<number | ''>('');

    // Mock Purchases Data linked to clients
    const mockPurchases = [
        { id: 'V-001', clientId: 1, date: '2024-01-04', items: 'Laptop Gamer X (1)', total: 4500.00, status: 'Completado' },
        { id: 'V-002', clientId: 1, date: '2023-12-28', items: 'Teclado Mecánico (1), Mouse Pad (2)', total: 350.00, status: 'Completado' },
        { id: 'V-003', clientId: 2, date: '2024-01-02', items: 'Silla Ergonómica (1)', total: 850.00, status: 'Enviado' },
        { id: 'V-004', clientId: 3, date: '2023-12-15', items: 'Monitor 24" (2)', total: 1200.00, status: 'Completado' },
        { id: 'V-005', clientId: 2, date: '2023-11-20', items: 'Escritorio L (1)', total: 1500.00, status: 'Devuelto' },
    ];

    const selectedClient = clients.find(c => c.id === selectedClientId);
    const clientPurchases = mockPurchases.filter(p => p.clientId === selectedClientId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Historial de Compras</h1>
                    <p className="text-[var(--muted)]">Consulta las compras realizadas por cada cliente</p>
                </div>
            </div>

            {/* Client Selection */}
            <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="max-w-md space-y-2">
                    <label className="block text-sm font-medium text-[var(--muted)]">Seleccionar Cliente</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none appearance-none"
                        >
                            <option value="">-- Elige un cliente --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedClient ? (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                            <p className="text-sm text-[var(--muted)] mb-1">Total de Compras</p>
                            <p className="text-2xl font-bold">{clientPurchases.length}</p>
                        </div>
                        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                            <p className="text-sm text-[var(--muted)] mb-1">Monto Acumulado</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                S/ {clientPurchases.reduce((acc, p) => acc + p.total, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                            <p className="text-sm text-[var(--muted)] mb-1">Última Compra</p>
                            <p className="text-2xl font-bold">
                                {clientPurchases[0]?.date || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Purchases List */}
                    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                        <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                            <h3 className="font-bold flex items-center gap-2">
                                <ShoppingBag size={18} className="text-[var(--primary)]" />
                                Detalle de Pedidos
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[var(--bg-primary)] text-[var(--muted)] uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Cód. Venta</th>
                                        <th className="px-6 py-4 font-semibold">Fecha</th>
                                        <th className="px-6 py-4 font-semibold">Productos</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                                        <th className="px-6 py-4 font-semibold">Estado</th>
                                        <th className="px-6 py-4 font-semibold">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {clientPurchases.length > 0 ? (
                                        clientPurchases.map(sale => (
                                            <tr key={sale.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium">{sale.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                                                <td className="px-6 py-4 text-[var(--muted)]">{sale.items}</td>
                                                <td className="px-6 py-4 text-right font-bold">S/ {sale.total.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                                        ${sale.status === 'Completado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                                                            sale.status === 'Devuelto' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30' :
                                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium">
                                                        Ver Comprobante
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                                                Este cliente aún no registra compras en el sistema.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--surface)] p-12 rounded-xl border border-dashed border-[var(--border)] text-center">
                    <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text)] mb-1">Selecciona un cliente</h3>
                    <p className="text-[var(--muted)]">Elige un cliente arriba para visualizar su historial detallado de transacciones.</p>
                </div>
            )}
        </div>
    );
};
