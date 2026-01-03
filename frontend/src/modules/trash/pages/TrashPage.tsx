import { useState, useEffect } from 'react';
import { RotateCcw, Trash2, History, X } from 'lucide-react';
import { api } from '../../../lib/api';
import { notify } from '../../../lib/notify';
import { PageLoader } from '../../../components/ui/PageLoader';

export const TrashPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'orgs'>('users');
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [showAudit, setShowAudit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string, type: 'user' | 'org' } | null>(null);

    const loadTrash = async () => {
        setLoading(true);
        try {
            const [usersRes, orgsRes] = await Promise.all([
                api.get('/trash/users'),
                api.get('/trash/organizations')
            ]);
            setUsers(usersRes.data);
            setOrgs(orgsRes.data);
        } catch (error) {
            console.error('Failed to load trash', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrash();
    }, []);

    const handleRestore = async (id: string, type: 'user' | 'org') => {
        try {
            await notify.promise(
                type === 'user'
                    ? api.post(`/trash/users/${id}/restore`)
                    : api.post(`/trash/organizations/${id}/restore`),
                {
                    loading: 'Restaurando...',
                    success: '¡Elemento restaurado!',
                    error: 'Error al restaurar',
                }
            );
            loadTrash();
        } catch (error) {
            console.error('Failed to restore', error);
        }
    };

    const loadAuditLogs = async () => {
        try {
            const res = await api.get('/trash/audit');
            setAuditLogs(res.data);
            setShowAudit(true);
        } catch (error) {
            console.error('Failed to load audit logs', error);
        }
    };

    const isEligibleForDeletion = (dateStr?: string) => {
        if (!dateStr) return false;
        const suspendedDate = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - suspendedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 30;
    };

    const handlePermanentDelete = async () => {
        if (!showDeleteConfirm) return;
        const { id, type } = showDeleteConfirm;

        try {
            await notify.promise(
                type === 'user'
                    ? api.delete(`/trash/users/${id}/permanent?confirm=true`)
                    : api.delete(`/trash/organizations/${id}/permanent?confirm=true`),
                {
                    loading: 'Eliminando permanentemente...',
                    success: 'Eliminado correctamente',
                    error: 'Error al eliminar',
                }
            );
            setShowDeleteConfirm(null);
            loadTrash(); // Refresh
        } catch (error: any) {
            console.error('Failed to delete permanently', error);
            // alert(error.response?.data?.message || 'Failed to delete permanently'); // notify.promise handles it
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                        <Trash2 size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Papelera de Reciclaje</h1>
                </div>
                <button
                    onClick={loadAuditLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                    <History size={18} />
                    Ver Historial
                </button>
            </div>

            <div className="flex space-x-1 border-b mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                    Usuarios Suspendidos
                </button>
                <button
                    onClick={() => setActiveTab('orgs')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'orgs' ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                    Organizaciones Suspendidas
                </button>
            </div>


            {
                loading ? (
                    <PageLoader />
                ) : (
                    <div className="bg-[var(--card-bg)] shadow rounded-lg overflow-hidden border border-[var(--border)] flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full divide-y divide-[var(--border)]">
                                <thead className="bg-[var(--bg-primary)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">NOMBRE</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">ESTADO</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">FECHA DE SUSPENSIÓN</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">
                                    {activeTab === 'users' && users.map((user) => {
                                        const eligible = isEligibleForDeletion(user.suspendedAt);
                                        return (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-[var(--text)]">{user.firstName} {user.lastName}</div>
                                                    <div className="text-sm text-[var(--muted)]">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                                                    {user.suspendedAt ? new Date(user.suspendedAt).toLocaleString() : '-'}
                                                    {eligible && <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">Eliminación habilitada</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleRestore(user.id, 'user')}
                                                        className="text-[var(--primary)] hover:opacity-80 flex items-center gap-1"
                                                    >
                                                        <RotateCcw size={16} /> Restaurar
                                                    </button>
                                                    {eligible && (
                                                        <button
                                                            onClick={() => setShowDeleteConfirm({ id: user.id, type: 'user' })}
                                                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Eliminar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    {activeTab === 'orgs' && orgs.map((org) => {
                                        const eligible = isEligibleForDeletion(org.suspendedAt);
                                        return (
                                            <tr key={org.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-[var(--text)]">{org.name}</div>
                                                    <div className="text-sm text-[var(--muted)]">{org.slug}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                        {org.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                                                    {org.suspendedAt ? new Date(org.suspendedAt).toLocaleString() : '-'}
                                                    {eligible && <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">Eliminación habilitada</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleRestore(org.id, 'org')}
                                                        className="text-[var(--primary)] hover:opacity-80 flex items-center gap-1"
                                                    >
                                                        <RotateCcw size={16} /> Restaurar
                                                    </button>
                                                    {eligible && (
                                                        <button
                                                            onClick={() => setShowDeleteConfirm({ id: org.id, type: 'org' })}
                                                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Eliminar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    {((activeTab === 'users' && users.length === 0) || (activeTab === 'orgs' && orgs.length === 0)) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">
                                                No se encontraron elementos suspendidos
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold text-red-600 mb-4">Eliminación Permanente</h2>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                ¿Estás seguro de que deseas eliminar permanentemente {showDeleteConfirm.type === 'user' ? 'este Usuario' : 'esta Organización'}?
                                <br /><br />
                                <strong>Esta acción no se puede deshacer.</strong>
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePermanentDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
                                >
                                    Eliminar Definitivamente
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Audit Log Modal */}
            {
                showAudit && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Historial de Auditoría</h2>
                                <button onClick={() => setShowAudit(false)} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2">Acción</th>
                                            <th className="px-4 py-2">Entidad</th>
                                            <th className="px-4 py-2">ID</th>
                                            <th className="px-4 py-2">Realizado Por</th>
                                            <th className="px-4 py-2">Fecha</th>
                                            <th className="px-4 py-2">Razón</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-700">
                                        {auditLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.action === 'SUSPEND' ? 'bg-red-100 text-red-800' :
                                                        log.action === 'RESTORE' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{log.entityType}</td>
                                                <td className="px-4 py-2 font-mono text-xs">{log.entityId.substring(0, 8)}...</td>
                                                <td className="px-4 py-2">{log.performedByUserId?.substring(0, 8) || 'System'}</td>
                                                <td className="px-4 py-2 text-gray-500">{new Date(log.performedAt).toLocaleString()}</td>
                                                <td className="px-4 py-2 text-gray-500 italic">{log.reason || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex justify-end">
                                <button onClick={() => setShowAudit(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded">Cerrar</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
