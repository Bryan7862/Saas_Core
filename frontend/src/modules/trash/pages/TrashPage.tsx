import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { RotateCcw, Trash2 } from 'lucide-react';

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
        <div className="h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    <Trash2 size={24} />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text)]">Recycle Bin</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                    Suspended Users
                </button>
                <button
                    onClick={() => setActiveTab('orgs')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'orgs' ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                    Suspended Organizations
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-[var(--muted)]">Loading trash items...</div>
            ) : (
                <div className="bg-[var(--card-bg)] shadow rounded-lg overflow-hidden border border-[var(--border)] flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-[var(--border)]">
                            <thead className="bg-[var(--bg-primary)]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Suspended At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">
                                {activeTab === 'users' && users.map((user) => (
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
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleRestore(user.id, 'user')}
                                                className="text-[var(--primary)] hover:opacity-80 flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <RotateCcw size={16} /> Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === 'orgs' && orgs.map((org) => (
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
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleRestore(org.id, 'org')}
                                                className="text-[var(--primary)] hover:opacity-80 flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <RotateCcw size={16} /> Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {((activeTab === 'users' && users.length === 0) || (activeTab === 'orgs' && orgs.length === 0)) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">
                                            No suspended items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
