import React, { useEffect, useState } from 'react';
import { getPermissions, syncRolePermissions } from '../api';
import { RolePermissionsSelector } from './RolePermissionsSelector';
import { notify } from '../../../lib/notify';

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: any; // Selected Role object
    onUpdated: () => void;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, role, onUpdated }) => {
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && role) {
            loadData();
        }
    }, [isOpen, role]);

    const loadData = async () => {
        try {
            const perms = await getPermissions();
            setAllPermissions(perms);

            // role from props might not have populated permissions if list was shallow.
            // If the role object passed in implies relations were loaded, good.
            // Otherwise we might need to fetch the single role.
            // Assuming getRoles() returns relations as per Backend Service (yes it does relations: ['rolePermissions']).

            // backend returns rolePermissions -> permission -> id/code.
            // Selector needs IDs to match.
            const currentIds = role.rolePermissions?.map((rp: any) => rp.permission.id) || [];
            setSelectedIds(currentIds);

        } catch (error) {
            console.error('Failed to load permissions', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await syncRolePermissions(role.id, selectedIds);
            notify.success('Permisos actualizados correctamente');
            onUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to save permissions', error);
            notify.error('Error al guardar permisos');
        } finally {
            setLoading(false);
        }
    };

    const isSystemRole = ['OWNER', 'ADMIN'].includes(role?.code);

    if (!isOpen || !role) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-[var(--card-bg)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-[var(--border)]">
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text)]">Editar Rol: {role.name}</h2>
                        {isSystemRole && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Rol de Sistema (Solo ampliar permisos)</span>}
                    </div>
                    <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)]">✕</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <RolePermissionsSelector
                        allPermissions={allPermissions}
                        selectedPermissions={selectedIds}
                        onChange={setSelectedIds}
                        // If system role OWNER, maybe lock permissions? User requirement: "No permitir quitar permisos críticos al OWNER".
                        // Logic: If OWNER, maybe readOnly true? Or just always ensure OWNER has all.
                        // For now let's allow editing but backend seed ensures OWNER gets all on restart.
                        // Better: If OWNER, readOnly=true.
                        readOnly={role.code === 'OWNER'}
                    />
                    {role.code === 'OWNER' && <p className="text-sm text-[var(--muted)] mt-2">El rol PROPIETARIO tiene acceso total irrevocable para seguridad del sistema.</p>}
                </div>

                <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-primary)] flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--text)] hover:bg-[var(--border)] rounded">Cancelar</button>
                    <button
                        onClick={handleSave}
                        disabled={loading || role.code === 'OWNER'}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};
