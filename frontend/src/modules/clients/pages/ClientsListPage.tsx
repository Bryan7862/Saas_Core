import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Edit2, Trash2, Building, MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useClients, Client } from '../context/ClientsContext';

export const ClientsListPage = () => {
    const { clients, loading, error, deleteClient, updateClient, refreshClients } = useClients();
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'Personal',
        address: '',
        notes: ''
    });

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            email: client.email,
            phone: client.phone,
            type: client.type,
            address: client.address || '',
            notes: client.notes || ''
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('El nombre es requerido');
            return;
        }

        if (editingClient) {
            setActionLoading(editingClient.id);
            try {
                await updateClient(editingClient.id, formData);
                setShowModal(false);
                setEditingClient(null);
            } catch {
                // Error handled by context
            } finally {
                setActionLoading(null);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar cliente?')) {
            setActionLoading(id);
            try {
                await deleteClient(id);
            } catch {
                // Error handled by context
            } finally {
                setActionLoading(null);
            }
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-[var(--primary)] mx-auto mb-4" />
                    <p className="text-[var(--muted)]">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Error al cargar clientes</h3>
                    <p className="text-[var(--muted)] mb-4">{error}</p>
                    <button
                        onClick={refreshClients}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 mx-auto"
                    >
                        <RefreshCw size={18} />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Clientes</h1>
                    <p className="text-[var(--muted)]">Gestiona tu cartera de clientes</p>
                </div>
                <Link
                    to="/clients/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Cliente
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
                <div className="relative max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>

            {/* Empty state */}
            {filteredClients.length === 0 && !searchQuery && (
                <div className="bg-[var(--surface)] p-12 rounded-xl border border-dashed border-[var(--border)] text-center">
                    <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text)] mb-1">No hay clientes</h3>
                    <p className="text-[var(--muted)] mb-4">Comienza agregando tu primer cliente</p>
                    <Link
                        to="/clients/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90"
                    >
                        <Plus size={18} />
                        Nuevo Cliente
                    </Link>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => handleEdit(client)}
                                disabled={actionLoading === client.id}
                                className="p-1 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-[var(--primary)] disabled:opacity-50"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                disabled={actionLoading === client.id}
                                className="p-1 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-red-500 disabled:opacity-50"
                            >
                                {actionLoading === client.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-soft)] flex items-center justify-center text-[var(--primary)]">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text)]">{client.name}</h3>
                                <span className="text-xs px-2 py-0.5 bg-[var(--bg-primary)] rounded-full text-[var(--muted)] border border-[var(--border)]">
                                    {client.type}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-[var(--muted)]">
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                {client.email || 'Sin email'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                {client.phone || 'Sin teléfono'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal - Clean Neutral Design */}
            {showModal && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                            <h2 className="text-lg font-semibold text-[var(--text)]">Editar Cliente</h2>
                            <p className="text-sm text-[var(--muted)] mt-0.5">Actualiza la información</p>
                        </div>

                        {/* Form */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nombre / Razón Social</label>
                                <div className="relative">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Dirección</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--surface-alt)] flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={actionLoading !== null}
                                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] font-medium rounded-lg hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={actionLoading !== null}
                                className="px-5 py-2 bg-[var(--primary)] text-white font-medium rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
