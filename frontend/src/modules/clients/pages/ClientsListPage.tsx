import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Edit2, Trash2, Building, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useClients, Client } from '../context/ClientsContext';

export const ClientsListPage = () => {
    const { clients, deleteClient, updateClient } = useClients();
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSave = () => {
        if (!formData.name) {
            toast.error('El nombre es requerido');
            return;
        }

        if (editingClient) {
            updateClient(editingClient.id, formData);
        }
        setShowModal(false);
        setEditingClient(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar cliente?')) {
            deleteClient(id);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => handleEdit(client)}
                                className="p-1 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-[var(--primary)]"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="p-1 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-red-500">
                                <Trash2 size={16} />
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
                                {client.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                {client.phone}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl">
                        <div className="p-6 border-b border-[var(--border)]">
                            <h2 className="text-xl font-bold">Editar Cliente</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre / Razón Social</label>
                                <div className="relative">
                                    <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Dirección</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
