import { useEffect, useState } from 'react';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import { getMyOrganizations, createOrganization } from '../api';
import { api } from '../../../lib/api';

export const OrganizationsPage = () => {
    // ... items ...

    const handleDeleteOrg = async (orgId: string) => {
        if (!window.confirm('Are you sure you want to suspend this organization? It can be restored from the Recycle Bin.')) return;
        try {
            await api.delete(`/organizations/${orgId}`);
            loadOrgs();
        } catch (error) {
            console.error('Failed to suspend organization', error);
            alert('Failed to suspend organization');
        }
    };
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadOrgs();
    }, []);

    const loadOrgs = async () => {
        try {
            const data = await getMyOrganizations();
            setOrgs(data);
        } catch (error) {
            console.error('Failed to load organizations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgName.trim()) return;

        setCreating(true);
        try {
            await createOrganization(newOrgName);
            setNewOrgName('');
            setShowCreate(false);
            loadOrgs();
        } catch (error: any) {
            console.error('Failed to create organization', error);
            const msg = error.response?.data?.message || error.message || 'Failed to create organization';
            alert(`Error: ${JSON.stringify(msg)}`);
        } finally {
            setCreating(false);
        }
    };

    const handleSelect = (orgId: string) => {
        localStorage.setItem('current_company_id', orgId);
        // Force a simplified reload for now to ensure headers are picked up
        window.location.href = '/';
    };

    if (loading) return <div className="p-8 text-center text-[var(--text)]">Loading your organizations...</div>;

    return (
        <div className="h-full flex flex-col items-center py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full h-full flex flex-col space-y-6">
                <div className="text-center flex-none">
                    <h2 className="mt-2 text-3xl font-extrabold text-[var(--text)]">
                        Mis Organizaciones
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Selecciona una organización para administrar o crea una nueva.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
                    {/* Create New Card */}
                    <div
                        onClick={() => setShowCreate(true)}
                        className="relative group bg-[var(--card-bg)] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[var(--primary)] rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center h-48"
                    >
                        <div className="p-3 rounded-full bg-[var(--bg-primary)] group-hover:bg-[var(--primary)]/10 transition-colors">
                            <Plus className="h-8 w-8 text-[var(--muted)] group-hover:text-[var(--primary)]" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-[var(--text)] group-hover:text-[var(--primary)]">Crear Nueva</h3>
                    </div>

                    {/* Organization Cards */}
                    {orgs.map((org) => (
                        <div key={org.id} className="relative bg-[var(--card-bg)] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-[var(--border)] flex flex-col h-48">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {org.logoUrl ? (
                                            <img className="h-10 w-10 rounded-full" src={org.logoUrl} alt="" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--primary)] font-bold border border-[var(--border)]">
                                                {org.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--text)] truncate">{org.name}</h3>
                                </div>
                                <p className="mt-4 text-xs text-[var(--muted)] font-mono bg-[var(--bg-primary)] p-1 rounded inline-block">
                                    {org.slug}
                                </p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleSelect(org.id)}
                                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                                >
                                    Entrar <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteOrg(org.id);
                                    }}
                                    className="flex items-center justify-center px-3 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-red-600 bg-[var(--card-bg)] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    title="Suspend Organization"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[var(--card-bg)] rounded-lg p-6 max-w-md w-full m-4 border border-[var(--border)] shadow-xl">
                            <h3 className="text-lg font-medium text-[var(--text)] mb-4">Crear Nueva Organización</h3>
                            <form onSubmit={handleCreate}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre de la Organización</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        required
                                        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        value={newOrgName}
                                        onChange={(e) => setNewOrgName(e.target.value)}
                                        placeholder="ej. Acme Corp"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreate(false)}
                                        className="px-4 py-2 border border-[var(--border)] rounded-md text-sm font-medium text-[var(--muted)] hover:bg-[var(--bg-primary)]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary)] hover:opacity-90 disabled:opacity-50"
                                    >
                                        {creating ? 'Creando...' : 'Crear Organización'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
