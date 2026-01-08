import { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventory, Category } from '../context/InventoryContext';

export const CategoriesPage = () => {
    const { categories, products, addCategory, updateCategory, deleteCategory, loading } = useInventory();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Count products per category
    const getCategoryProductCount = (categoryName: string) => {
        return products.filter(p => p.category === categoryName).length;
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({ name: category.name, description: category.description });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            await deleteCategory(id);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('El nombre es requerido');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await addCategory(formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', description: '' });
        } catch (error) {
            // Error handled in context
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Categorías</h1>
                    <p className="text-[var(--muted)]">Organiza tus productos en categorías</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', description: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                    <Plus size={20} />
                    Nueva Categoría
                </button>
            </div>

            {/* List */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar categorías..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-8 text-[var(--muted)]">
                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                        Cargando categorías...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-8 text-[var(--muted)]">
                        No hay categorías. Agrega una nueva.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div key={category.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--primary)] transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-[var(--bg-soft)] text-[var(--primary)]">
                                            <Tag size={20} />
                                        </div>
                                        <h3 className="font-bold text-[var(--text)]">{category.name}</h3>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-1.5 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-[var(--text)]"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-1.5 hover:bg-[var(--bg-soft)] rounded text-[var(--muted)] hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--muted)] mb-3">{category.description}</p>
                                <div className="text-xs font-medium px-2 py-1 rounded bg-[var(--bg-soft)] w-fit text-[var(--text)]">
                                    {getCategoryProductCount(category.name)} Productos
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal - Clean Neutral Design */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                            <h2 className="text-lg font-semibold text-[var(--text)]">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                            <p className="text-sm text-[var(--muted)] mt-0.5">Organiza tus productos</p>
                        </div>

                        {/* Form */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Electrónica, Software..."
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Breve descripción..."
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--surface-alt)] flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] font-medium rounded-lg hover:bg-[var(--surface)] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2 bg-[var(--primary)] text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                                {saving && <Loader2 className="animate-spin" size={16} />}
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
