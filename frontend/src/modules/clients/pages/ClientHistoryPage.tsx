import { useState, useEffect } from 'react';
import { ShoppingBag, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useClients } from '../context/ClientsContext';
import { getClientPurchases, ClientPurchase } from '../supabaseApi';

export const ClientHistoryPage = () => {
    const { clients, loading: clientsLoading } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [purchases, setPurchases] = useState<ClientPurchase[]>([]);
    const [purchasesLoading, setPurchasesLoading] = useState(false);
    const [purchasesError, setPurchasesError] = useState<string | null>(null);

    const selectedClient = clients.find(c => c.id === selectedClientId);

    useEffect(() => {
        if (!selectedClientId) {
            setPurchases([]);
            return;
        }

        const fetchPurchases = async () => {
            setPurchasesLoading(true);
            setPurchasesError(null);
            try {
                const data = await getClientPurchases(selectedClientId);
                setPurchases(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error al cargar historial';
                setPurchasesError(message);
            } finally {
                setPurchasesLoading(false);
            }
        };

        fetchPurchases();
    }, [selectedClientId]);

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
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            disabled={clientsLoading}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none appearance-none disabled:opacity-50"
                        >
                            <option value="">{clientsLoading ? 'Cargando clientes...' : '-- Elige un cliente --'}</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedClient ? (
                <div className="space-y-6">
                    {/* Loading state for purchases */}
                    {purchasesLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
                        </div>
                    )}

                    {/* Error state for purchases */}
                    {purchasesError && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-red-600 dark:text-red-400">{purchasesError}</p>
                        </div>
                    )}

                    {!purchasesLoading && !purchasesError && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                                    <p className="text-sm text-[var(--muted)] mb-1">Total de Compras</p>
                                    <p className="text-2xl font-bold">{purchases.length}</p>
                                </div>
                                <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                                    <p className="text-sm text-[var(--muted)] mb-1">Monto Acumulado</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        S/ {purchases.reduce((acc, p) => acc + (p.total || 0), 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                                    <p className="text-sm text-[var(--muted)] mb-1">Última Compra</p>
                                    <p className="text-2xl font-bold">
                                        {purchases[0]?.date || 'N/A'}
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
                                            {purchases.length > 0 ? (
                                                purchases.map(sale => (
                                                    <tr key={sale.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                                        <td className="px-6 py-4 font-mono font-medium">{sale.id.slice(0, 8)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                                                        <td className="px-6 py-4 text-[var(--muted)]">{sale.items || '-'}</td>
                                                        <td className="px-6 py-4 text-right font-bold">S/ {(sale.total || 0).toFixed(2)}</td>
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
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-[var(--surface)] p-12 rounded-xl border border-dashed border-[var(--border)] text-center">
                    <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                        <User size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text)] mb-1">Selecciona un cliente</h3>
                    <p className="text-[var(--muted)]">Elige un cliente arriba para visualizar su historial detallado de transacciones.</p>
                </div>
            )}
        </div>
    );
};
