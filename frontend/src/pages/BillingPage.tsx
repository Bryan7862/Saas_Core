import { CreditCard, Download, Clock } from 'lucide-react';

export function BillingPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-[var(--text)]">Facturación y Planes</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Plan Card */}
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-medium text-[var(--text)] mb-4">Tu Plan Actual</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-[var(--text)]">S/ 29</span>
                        <span className="text-[var(--muted)]">/ mes</span>
                    </div>
                    <p className="text-[var(--primary)] font-medium mb-6">Plan Pro (Anual)</p>

                    <div className="space-y-3 mb-6">
                        <div className="w-full bg-[var(--bg-primary)] rounded-full h-2">
                            <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-sm text-[var(--muted)]">240/300 Usuarios activos</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-[var(--primary)] text-[var(--bg-soft)] rounded-lg font-medium hover:opacity-90">
                            Cambiar Plan
                        </button>
                        <button className="px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg font-medium hover:bg-[var(--bg-primary)]">
                            Cancelar
                        </button>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-medium text-[var(--text)] mb-4">Método de Pago</h3>
                    <div className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] mb-6">
                        <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
                            <CreditCard size={24} className="text-[var(--text)]" />
                        </div>
                        <div>
                            <p className="font-bold text-[var(--text)]">Visa •••• 4242</p>
                            <p className="text-sm text-[var(--muted)]">Expira 12/2028</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PRINCIPAL</span>
                    </div>

                    <button className="w-full px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg font-medium hover:bg-[var(--bg-primary)] flex items-center justify-center gap-2">
                        Editar Tarjeta / Añadir Nueva
                    </button>
                </div>
            </div>

            {/* Invoice History Table */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                    <h3 className="text-lg font-bold text-[var(--text)]">Historial de Facturación</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Factura</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {/* Historial vacío para usuario nuevo */}
                            {[].length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No tienes facturas en tu historial.
                                    </td>
                                </tr>
                            ) : (
                                [].map((invoice: any, i) => (
                                    <tr key={i} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)] flex items-center gap-2">
                                            <Clock size={16} className="text-[var(--muted)]" />
                                            {invoice.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--text)]">{invoice.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--primary)]">
                                            <button className="flex items-center gap-1 hover:underline">
                                                <Download size={16} />
                                                PDF
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
}
