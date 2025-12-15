import React, { useState, useEffect } from 'react';
import { getRoles, assignRole } from '../api';

interface EditUserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentUserRoles: string[]; // List of role codes
    onRoleUpdated: () => void;
}

export const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({ isOpen, onClose, userId, currentUserRoles, onRoleUpdated }) => {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadRoles();
        }
    }, [isOpen]);

    const loadRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Failed to load roles', error);
        }
    };

    const handleAssign = async () => {
        if (!selectedRoleId) return;
        setLoading(true);
        try {
            await assignRole(userId, selectedRoleId); // Assuming companyId is inferred or default
            onRoleUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to assign role', error);
            alert('Failed to assign role');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Manage User Roles</h3>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Roles:</p>
                    <div className="flex gap-2 flex-wrap">
                        {currentUserRoles.length > 0 ? (
                            currentUserRoles.map(role => (
                                <span key={role} className="bg-gray-100 px-2 py-1 rounded text-xs">{role}</span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-xs">No roles assigned</span>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign New Role</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={selectedRoleId}
                        onChange={(e) => setSelectedRoleId(e.target.value)}
                    >
                        <option value="">Select a role...</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name} ({role.code})</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Close</button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedRoleId || loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Assign Role'}
                    </button>
                </div>
            </div>
        </div>
    );
};
