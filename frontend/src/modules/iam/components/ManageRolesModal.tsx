import React, { useEffect, useState } from 'react';
import { getRoles, deleteRole } from '../api';
import { EditRoleModal } from './EditRoleModal';
import { CreateRoleModal } from './CreateRoleModal';
import { RoleBadge } from './RoleBadge';
import { notify } from '../../../lib/notify';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// Traducciones para roles del sistema
const ROLE_TRANSLATIONS: Record<string, string> = {
    'OWNER': 'Propietario',
    'ADMIN': 'Administrador',
    'MEMBER': 'Miembro',
};

export const ManageRolesModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Sub-modals
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<any>(null);

    useEffect(() => {
        if (isOpen) loadRoles();
    }, [isOpen]);

    const loadRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (role: any) => {
        if (!window.confirm(`¿Estás seguro de eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            await deleteRole(role.id);
            loadRoles(); // Refresh list
        } catch (error: any) {
            console.error('Failed to delete role', error);
            const msg = error.response?.data?.message || 'Error al eliminar el rol';
            notify.error(msg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40 p-4">
            <div className="bg-[var(--card-bg)] rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[80vh] border border-[var(--border)]">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text)]">Roles de Organización</h2>
                    <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)]">✕</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[var(--muted)]">Define qué pueden hacer los usuarios con cada rol.</p>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium text-sm"
                        >
                            + Crear Nuevo Rol
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-[var(--muted)]">Cargando roles...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-sm">
                                    <th className="py-2">Rol (Código)</th>
                                    <th className="py-2">Nombre Visible</th>
                                    <th className="py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {roles.map(role => (
                                    <tr key={role.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="py-3">
                                            <RoleBadge roleCode={role.code} />
                                        </td>
                                        <td className="py-3 font-medium text-[var(--text)]">{ROLE_TRANSLATIONS[role.code] || role.name}</td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => setEditingRole(role)}
                                                className="text-[var(--primary)] hover:underline text-sm font-medium mr-3"
                                            >
                                                Editar Permisos
                                            </button>
                                            {/* Prevent deleting System roles */}
                                            {!['OWNER', 'ADMIN', 'MEMBER'].includes(role.code) && (
                                                <button
                                                    onClick={() => handleDelete(role)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Sub Modals */}
            <CreateRoleModal
                isOpen={isCreateOpen}
                onClose={() => setCreateOpen(false)}
                onRoleCreated={() => {
                    loadRoles(); // Reload list
                }}
            />

            <EditRoleModal
                isOpen={!!editingRole}
                role={editingRole}
                onClose={() => setEditingRole(null)}
                onUpdated={() => {
                    loadRoles();
                    setEditingRole(null);
                }}
            />
        </div>
    );
};
