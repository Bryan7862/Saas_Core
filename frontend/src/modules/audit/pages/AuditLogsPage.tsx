import { useState, useEffect } from 'react';
import { Clock, Search, RefreshCw, Loader2, User, Package, Users, Truck, Receipt, FileText, Settings, UserCircle } from 'lucide-react';
import { getAuditLogs, AuditLog, actionLabels, entityLabels, AuditAction, EntityType } from '../supabaseApi';

const entityIcons: Record<EntityType, React.ElementType> = {
    USER: User,
    PRODUCT: Package,
    CLIENT: Users,
    SUPPLIER: Truck,
    SALE: Receipt,
    INVOICE: FileText,
    REPORT: FileText,
    SETTINGS: Settings,
    PROFILE: UserCircle
};

const actionColors: Record<AuditAction, string> = {
    LOGIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    LOGOUT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    CREATE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    UPDATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    DELETE: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    EXPORT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    VIEW: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    PASSWORD_RESET: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    SETTINGS_CHANGE: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
};

export const AuditLogsPage = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs({ limit: 200 });
            setLogs(data);
        } catch (error) {
            console.error('Error loading logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actionLabels[log.action as AuditAction] || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Registro de Actividad</h1>
                    <p className="text-[var(--muted)]">Historial de acciones del sistema</p>
                </div>
                <button
                    onClick={loadLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                    <RefreshCw size={18} />
                    Actualizar
                </button>
            </div>

            {/* Search */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por acción o tipo..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>

            {/* Logs List */}
            {filteredLogs.length === 0 ? (
                <div className="bg-[var(--surface)] p-12 rounded-xl border border-dashed border-[var(--border)] text-center">
                    <Clock size={48} className="mx-auto mb-4 text-[var(--muted)]" />
                    <h3 className="text-lg font-medium text-[var(--text)] mb-1">No hay registros</h3>
                    <p className="text-[var(--muted)]">Los eventos de actividad aparecerán aquí</p>
                </div>
            ) : (
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                    <div className="divide-y divide-[var(--border)]">
                        {filteredLogs.map((log, index) => {
                            const IconComponent = entityIcons[log.entity_type as EntityType] || Clock;
                            const actionColor = actionColors[log.action as AuditAction] || 'bg-gray-100 text-gray-700';

                            return (
                                <div key={log.id || index} className="p-4 hover:bg-[var(--bg-primary)]/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[var(--primary)]">
                                            <IconComponent size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColor}`}>
                                                    {actionLabels[log.action as AuditAction] || log.action}
                                                </span>
                                                <span className="text-sm font-medium text-[var(--text)]">
                                                    {entityLabels[log.entity_type as EntityType] || log.entity_type}
                                                </span>
                                                {log.entity_id && (
                                                    <span className="text-xs text-[var(--muted)] font-mono">
                                                        #{log.entity_id.slice(0, 8)}
                                                    </span>
                                                )}
                                            </div>
                                            {log.details && (
                                                <p className="text-sm text-[var(--muted)] mt-1 truncate">
                                                    {JSON.stringify(log.details).slice(0, 80)}...
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-[var(--muted)] whitespace-nowrap">
                                            {formatDate(log.created_at || '')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
