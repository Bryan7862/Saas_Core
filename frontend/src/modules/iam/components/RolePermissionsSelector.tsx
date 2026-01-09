import React, { useEffect, useState } from 'react';

interface Permission {
    id: string;
    code: string;
    resource: string;
    action: string;
    description: string;
}

interface Props {
    selectedPermissions: string[]; // List of permission IDs
    allPermissions: Permission[];
    onChange: (newSelectedIds: string[]) => void;
    readOnly?: boolean;
}

export const RolePermissionsSelector: React.FC<Props> = ({ selectedPermissions = [], allPermissions = [], onChange, readOnly = false }) => {
    // Group permissions by resource
    const [grouped, setGrouped] = useState<Record<string, Permission[]>>({});

    const RESOURCE_LABELS: Record<string, string> = {
        users: 'Usuarios',
        roles: 'Roles',
        billing: 'Pagos y Planes',
        reports: 'Reportes',
        trash: 'Papelera',
    };

    const ACTION_LABELS: Record<string, Record<string, string>> = {
        users: {
            create: 'Registrar (Añadir nuevos trabajadores)',
            read: 'Consultar',
            update: 'Editar',
            delete: 'Suspender',
        },
        roles: {
            create: 'Crear',
            read: 'Visualizar',
            update: 'Configurar',
            delete: 'Eliminar',
        },
        billing: {
            read: 'Ver Historial',
            update: 'Cambiar Plan',
        },
    };

    useEffect(() => {
        const g: Record<string, Permission[]> = {};
        allPermissions.forEach(p => {
            if (!g[p.resource]) g[p.resource] = [];
            g[p.resource].push(p);
        });
        setGrouped(g);
    }, [allPermissions]);

    const togglePermission = (id: string) => {
        if (readOnly) return;
        if (selectedPermissions.includes(id)) {
            onChange(selectedPermissions.filter(pid => pid !== id));
        } else {
            onChange([...selectedPermissions, id]);
        }
    };

    const toggleResource = (resource: string) => {
        if (readOnly) return;
        const resourcePerms = grouped[resource] || [];
        const allIds = resourcePerms.map(p => p.id);
        const allSelected = allIds.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            // Uncheck all
            onChange(selectedPermissions.filter(id => !allIds.includes(id)));
        } else {
            // Check all
            const newIds = [...selectedPermissions];
            allIds.forEach(id => {
                if (!newIds.includes(id)) newIds.push(id);
            });
            onChange(newIds);
        }
    };

    return (
        <div className="space-y-6">
            {Object.keys(grouped).map(resource => {
                const resourcePerms = grouped[resource];
                const allSelected = resourcePerms.every(p => selectedPermissions.includes(p.id));
                const displayResource = RESOURCE_LABELS[resource] || resource;

                return (
                    <div key={resource} className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                            <h4 className="font-bold text-[var(--text)] capitalize">{displayResource}</h4>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => toggleResource(resource)}
                                    className="text-xs text-[var(--primary)] hover:underline"
                                >
                                    {allSelected ? 'Desmarcar Todos' : 'Marcar Todos'}
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {resourcePerms.map(perm => {
                                const actionLabel = ACTION_LABELS[resource]?.[perm.action] || perm.action;
                                return (
                                    <label key={perm.id} className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${readOnly ? 'cursor-default' : 'hover:bg-[var(--border)]'}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            disabled={readOnly}
                                            className="mt-1 accent-[var(--primary)]"
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-[var(--text)] capitalize">{actionLabel}</div>
                                            {/* Optional: <div className="text-xs text-[var(--muted)]">{perm.description}</div> */}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
