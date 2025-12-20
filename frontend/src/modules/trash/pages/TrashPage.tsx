import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { RefreshCw, RotateCcw, Trash2 } from 'lucide-react';

export const TrashPage = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'orgs'>('users');
    const [users, setUsers] = useState<any[]>([]);
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadTrash = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const res = await api.get('/trash/users');
                setUsers(res.data);
            } else {
                const res = await api.get('/trash/organizations');
                setOrgs(res.data);
            }
        } catch (error) {
            console.error('Failed to load trash items', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id: string, type: 'user' | 'org') => {
        if (!window.confirm('Are you sure you want to restore this item?')) return;
        try {
            if (type === 'user') {
                await api.post(`/trash/users/${id}/restore`);
            } else {
                await api.post(`/trash/organizations/${id}/restore`);
            }
            loadTrash(); // Refresh list
        } catch (error) {
            console.error('Failed to restore item', error);
            alert('Failed to restore item');
        }
    };

    useEffect(() => {
        loadTrash();
    }, [activeTab]);

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <Trash2 size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Recycle Bin</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Suspended Users
                </button>
                <button
                    onClick={() => setActiveTab('orgs')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'orgs' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Suspended Organizations
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading trash items...</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspended At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activeTab === 'users' && users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.suspendedAt ? new Date(user.suspendedAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRestore(user.id, 'user')}
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <RotateCcw size={16} /> Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === 'orgs' && orgs.map((org) => (
                                <tr key={org.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                        <div className="text-sm text-gray-500">{org.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            {org.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {org.suspendedAt ? new Date(org.suspendedAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRestore(org.id, 'org')}
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <RotateCcw size={16} /> Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {((activeTab === 'users' && users.length === 0) || (activeTab === 'orgs' && orgs.length === 0)) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No suspended items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
