import { useState } from 'react';
import { History, Calendar, Search, ArrowUpDown, ExternalLink, MessageSquare } from 'lucide-react';

const historyLogs = [
    { id: 1, event: 'Emisión de Factura F001-0002', date: '2026-01-04 15:42', status: 'Exitoso', detail: 'CDR Aceptado por SUNAT' },
    { id: 2, event: 'Anulación de Boleta B001-0039', date: '2026-01-04 12:15', status: 'Pendiente', detail: 'Comunicación de baja enviada' },
    { id: 3, event: 'Actualización de Certificado', date: '2026-01-03 09:30', status: 'Exitoso', detail: 'Certificado PFX cargado' },
    { id: 4, event: 'Error en Emisión F001-0001', date: '2026-01-02 18:20', status: 'Error', detail: 'Error de conexión con el OSE' },
    { id: 5, event: 'Emisión de Boleta B001-0038', date: '2026-01-01 10:05', status: 'Exitoso', detail: 'XML enviado y firmado' },
];

export const BillingHistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = historyLogs.filter(log =>
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Historial de Facturación</h1>
                    <p className="text-[var(--muted)]">Registro de eventos y comunicación con SUNAT</p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-sm font-medium">
                    <Calendar size={16} className="text-[var(--primary)]" />
                    <span>Últimos 30 días</span>
                </div>
            </div>

            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar eventos o detalles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                </div>
            </div>

            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-primary)]/50 text-[var(--muted)] text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Fecha y Hora</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Detalle / Respuesta</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-[var(--bg-primary)]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-[var(--bg-primary)] text-[var(--muted)]">
                                                <History size={16} />
                                            </div>
                                            <span className="font-bold text-sm">{log.event}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)] font-mono">{log.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${log.status === 'Exitoso' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                log.status === 'Error' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm italic text-[var(--muted)]">
                                        {log.detail}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-md text-[var(--muted)] hover:text-[var(--primary)] transition-colors" title="Ver Log Completo">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--bg-primary)] rounded-md text-[var(--muted)] hover:text-[var(--primary)] transition-colors" title="Consultar Ticket">
                                                <MessageSquare size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center pt-4">
                <button className="text-sm font-bold text-[var(--primary)] hover:underline flex items-center gap-2">
                    <ArrowUpDown size={14} />
                    CARGAR MÁS REGISTROS
                </button>
            </div>
        </div>
    );
};
