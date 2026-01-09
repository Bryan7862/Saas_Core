import React from 'react';

interface RoleBadgeProps {
    roleCode: string;
}

const ROLE_LABELS: Record<string, string> = {
    'OWNER': 'Propietario',
    'ADMIN': 'Administrador',
    'MEMBER': 'Miembro',
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ roleCode }) => {
    let color = 'bg-gray-500/20 text-gray-400 border border-gray-500/30';

    switch (roleCode) {
        case 'OWNER':
            color = 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            break;
        case 'ADMIN':
            color = 'bg-red-500/20 text-red-400 border border-red-500/30';
            break;
        case 'MEMBER':
            color = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            break;
        default:
            color = 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }

    const displayName = ROLE_LABELS[roleCode] || roleCode;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
            {displayName}
        </span>
    );
};
