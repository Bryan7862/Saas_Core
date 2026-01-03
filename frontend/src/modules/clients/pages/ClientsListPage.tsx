import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ClientsListPage = () => {
    // Mock Data
    const [clients, setClients] = useState([
        { id: 1, name: 'Empresa ABC S.A.C.', email: 'contacto@abc.pe', phone: '999123456', type: 'Corporativo' },
        { id: 2, name: 'Juan Pérez', email: 'juan.perez@gmail.com', phone: '987654321', type: 'Personal' },
        { id: 3, name: 'Innovaciones Tech', email: 'ventas@innotech.com', phone: '01 4567890', type: 'Corporativo' },
    ]);

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar cliente?')) {
            setClients(clients.filter(c => c.id !== id));
            toast.success('Cliente eliminado');
        }
    };

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
                        placeholder="Buscar por nombre, ruc o email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map(client => (
                    <div key={client.id} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="p-1 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-[var(--primary)]">
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
        </div>
    );
};
