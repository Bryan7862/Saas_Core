import React from 'react';

type StatusType = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'PAST_DUE';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    // Determine styles based on status
    let styles = 'bg-gray-100 text-gray-800 border-gray-200'; // Default

    switch (status) {
        case 'SUSPENDED':
            styles = 'bg-amber-100 text-amber-700 border-amber-200';
            break;
        case 'ACTIVE':
            styles = 'bg-green-100 text-green-700 border-green-200';
            break;
        case 'TRIAL':
            styles = 'bg-blue-100 text-blue-700 border-blue-200';
            break;
        case 'PAST_DUE':
            styles = 'bg-red-50 text-red-600 border-red-200';
            break;
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles} ${className}`}>
            {status}
        </span>
    );
};
