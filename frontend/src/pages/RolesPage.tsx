import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Shield } from 'lucide-react';

interface Role {
    id: string;
    code: string;
    name: string;
    description: string;
    rolePermissions: any[];
}

export function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState({ code: '', name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const fetchRoles = async () => {
        try {
            const data = await api.get('/roles');
            setRoles(data);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/roles', formData);
            setFormData({ code: '', name: '', description: '' });
            fetchRoles();
        } catch (error) {
            console.error('Failed to create role', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Role Form */}
            <div className="lg:col-span-1">
                <div className="card sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500">
                            <Plus size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Create Role</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Code</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. ADMIN_MASTER"
                                className="input"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Master Administrator"
                                className="input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Description</label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Optional description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Create Role'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Roles List */}
            <div className="lg:col-span-2">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Existing Roles</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-sm">
                                    <th className="py-3 px-4">Code</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Permissions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {roles.map((role) => (
                                    <tr key={role.id} className="group hover:bg-slate-900/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-sm text-sky-400">{role.code}</td>
                                        <td className="py-3 px-4 font-medium">{role.name}</td>
                                        <td className="py-3 px-4 text-sm text-[var(--muted)]">
                                            {role.rolePermissions?.length || 0} permissions
                                        </td>
                                    </tr>
                                ))}
                                {roles.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-[var(--muted)]">
                                            No roles found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
