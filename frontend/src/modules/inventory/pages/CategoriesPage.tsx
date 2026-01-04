import { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Electrónica', description: 'Dispositivos y gadgets electrónicos', items: 15 },
        { id: 2, name: 'Mobiliario', description: 'Muebles de oficina y hogar', items: 8 },
        { id: 3, name: 'Software', description: 'Licencias y suscripciones digitales', items: 5 },
        { id: 4, name: 'Servicios', description: 'Consultoría y soporte técnico', items: 12 },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setFormData({ name: category.name, description: category.description });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            setCategories(categories.filter(c => c.id !== id));
            toast.success('Categoría eliminada');
        }
    };

    const handleSave = () => {
        if (!formData.name) {
            toast.error('El nombre es requerido');
            return;
        }

        if (editingId) {
            setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c));
            toast.success('Categoría actualizada');
        } else {
            const newCategory = {
                id: Math.max(...categories.map(c => c.id)) + 1,
                ...formData,
                items: 0
            };
            setCategories([...categories, newCategory]);
            toast.success('Categoría creada');
        }
        setShowModal(false);
        setEditingId(null);
        setFormData({ name: '', description: '' });
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
                                {category.items} Productos
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl">
                        <div className="p-6 border-b border-[var(--border)]">
                            <h2 className="text-xl font-bold">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]"
                                    rows={3}
                                />
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
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
