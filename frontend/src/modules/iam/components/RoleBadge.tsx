import React from 'react';

interface RoleBadgeProps {
    roleCode: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ roleCode }) => {
    let color = 'bg-gray-100 text-gray-800';

    switch (roleCode) {
        case 'OWNER':
            color = 'bg-purple-100 text-purple-800 border border-purple-200';
            break;
        case 'ADMIN':
            color = 'bg-red-100 text-red-800 border border-red-200';
            break;
        case 'MEMBER':
            color = 'bg-blue-100 text-blue-800 border border-blue-200';
            break;
        default:
            color = 'bg-gray-100 text-gray-800 border border-gray-200';
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
            {roleCode}
        </span>
    );
};
