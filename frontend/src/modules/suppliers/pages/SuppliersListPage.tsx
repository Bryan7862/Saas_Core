import { useState } from 'react';
import { Truck, Plus, Search, Edit2, Trash2, User, MapPin, Building, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSuppliers, Supplier } from '../context/SuppliersContext';

export const SuppliersListPage = () => {
    const { suppliers, loading, error, deleteSupplier, updateSupplier, refreshSuppliers } = useSuppliers();
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        status: 'Activo' as 'Activo' | 'Inactivo',
        address: ''
    });

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contactName: supplier.contactName,
            email: supplier.email,
            phone: supplier.phone,
            category: supplier.category,
            status: supplier.status,
            address: supplier.address || ''
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.contactName) {
            toast.error('El nombre de la empresa y contacto son requeridos');
            return;
        }

        if (editingSupplier) {
            setActionLoading(editingSupplier.id);
            try {
                await updateSupplier(editingSupplier.id, formData);
                setShowModal(false);
                setEditingSupplier(null);
            } catch {
                // Error handled by context
            } finally {
                setActionLoading(null);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar proveedor?')) {
            setActionLoading(id);
            try {
                await deleteSupplier(id);
            } catch {
                // Error handled by context
            } finally {
                setActionLoading(null);
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-[var(--primary)] mx-auto mb-4" />
                    <p className="text-[var(--muted)]">Cargando proveedores...</p>
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
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">Error al cargar proveedores</h3>
                    <p className="text-[var(--muted)] mb-4">{error}</p>
                    <button
                        onClick={refreshSuppliers}
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
                    <h1 className="text-2xl font-bold text-[var(--text)]">Proveedores</h1>
                    <p className="text-[var(--muted)]">Gestiona tus socios comerciales y suministros</p>
                </div>
                <Link
                    to="/suppliers/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Proveedor
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
                        placeholder="Buscar por empresa, contacto o email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
            </div>

            {/* Empty state */}
            {filteredSuppliers.length === 0 && !searchQuery && (
                <div className="bg-[var(--surface)] p-12 rounded-xl border border-dashed border-[var(--border)] text-center">
                    <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--muted)]">
                        <Truck size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text)] mb-1">No hay proveedores</h3>
                    <p className="text-[var(--muted)] mb-4">Comienza agregando tu primer proveedor</p>
                    <Link
                        to="/suppliers/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90"
                    >
                        <Plus size={18} />
                        Nuevo Proveedor
                    </Link>
                </div>
            )}

            {/* List */}
            {filteredSuppliers.length > 0 && (
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)] text-[var(--muted)] uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-[var(--text)]">Proveedor</th>
                                    <th className="px-6 py-4 font-semibold text-[var(--text)]">Contacto</th>
                                    <th className="px-6 py-4 font-semibold text-[var(--text)]">Categoría</th>
                                    <th className="px-6 py-4 font-semibold text-[var(--text)]">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-[var(--text)]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--primary)]">
                                                    <Truck size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text)]">{supplier.name}</p>
                                                    <p className="text-xs text-[var(--muted)]">{supplier.email || 'Sin email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[var(--text)]">{supplier.contactName}</p>
                                            <p className="text-xs text-[var(--muted)]">{supplier.phone || 'Sin teléfono'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-[var(--bg-soft)] text-[var(--text)] text-xs border border-[var(--border)]">
                                                {supplier.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === 'Activo'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}>
                                                {supplier.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    disabled={actionLoading === supplier.id}
                                                    className="p-1.5 hover:bg-[var(--bg-soft)] rounded-md text-[var(--muted)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
                                                    disabled={actionLoading === supplier.id}
                                                    className="p-1.5 hover:bg-[var(--bg-soft)] rounded-md text-[var(--muted)] hover:text-rose-500 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === supplier.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                            <h2 className="text-lg font-semibold text-[var(--text)]">Editar Proveedor</h2>
                            <p className="text-sm text-[var(--muted)] mt-0.5">Actualiza la información</p>
                        </div>

                        {/* Form */}
                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Razón Social</label>
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
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nombre de Contacto</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="text"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
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
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Categoría</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Estado</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Activo' | 'Inactivo' })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors appearance-none"
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
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
