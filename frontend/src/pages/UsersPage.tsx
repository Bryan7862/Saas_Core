import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { UserPlus, Users, Link as LinkIcon } from 'lucide-react';

interface User {
    id: string;
    email: string;
    status: string;
    userRoles: any[];
}

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({ email: '', password: '', defaultCompanyId: '' });
    const [assignData, setAssignData] = useState({ userId: '', companyId: '', roleId: '' });
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [error, setError] = useState<string | null>(null);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload: any = {
                email: formData.email,
                password: formData.password,
            };
            if (formData.defaultCompanyId) {
                payload.defaultCompanyId = formData.defaultCompanyId;
            }
            console.log('Sending payload:', payload);
            await api.post('/users', payload);
            setFormData({ email: '', password: '', defaultCompanyId: '' });
            fetchUsers();
        } catch (err: any) {
            console.error('Failed to create user', err);
            // Extract error message from NestJS exception response
            const msg = Array.isArray(err.message) ? err.message.join(', ') : err.message || 'Failed to create user';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/assign-role', assignData);
            setAssignData({ userId: '', companyId: '', roleId: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to assign role', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create User Form */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Create User</h2>
                    </div>
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="input"
                                placeholder="Min. 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Default Company ID (UUID)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Optional"
                                value={formData.defaultCompanyId}
                                onChange={(e) => setFormData({ ...formData, defaultCompanyId: e.target.value })}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            Create User
                        </button>
                    </form>
                </div>

                {/* Assign Role Form */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                            <LinkIcon size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Assign Role</h2>
                    </div>
                    <form onSubmit={handleAssignRole} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">User ID</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={assignData.userId}
                                onChange={(e) => setAssignData({ ...assignData, userId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Company ID</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={assignData.companyId}
                                onChange={(e) => setAssignData({ ...assignData, companyId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Role ID</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={assignData.roleId}
                                onChange={(e) => setAssignData({ ...assignData, roleId: e.target.value })}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            Assign Role
                        </button>
                    </form>
                </div>
            </div>

            {/* Users List */}
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Users size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Users Directory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-[var(--muted)] text-sm">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Roles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-900/50 transition-colors">
                                    <td className="py-3 px-4 font-mono text-xs text-[var(--muted)]">{user.id}</td>
                                    <td className="py-3 px-4 font-medium">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-[var(--muted)]">
                                        {user.userRoles?.map(ur => ur.role?.code).join(', ') || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
