import { useState } from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventory, Product } from '../context/InventoryContext';

export const ProductsPage = () => {
    const { products, addProduct, updateProduct, deleteProduct, categories, loading } = useInventory();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: 0,
        min_stock: 5,
        price: 0
    });

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            stock: product.stock,
            min_stock: product.min_stock,
            price: product.price
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.category) {
            toast.error('Nombre y categoría son requeridos');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await updateProduct(editingId, formData);
            } else {
                await addProduct(formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: '', category: '', stock: 0, min_stock: 5, price: 0 });
        } catch (error) {
            // Error handled in context
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            await deleteProduct(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Inventario</h1>
                    <p className="text-[var(--muted)]">Gestiona tus productos y servicios</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', category: '', stock: 0, min_stock: 5, price: 0 });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {/* Filters */}
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-primary)]">
                        <Filter size={18} />
                        Filtros
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No hay productos. Agrega uno nuevo.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--muted)]">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[var(--text)]">{product.name}</div>
                                                    <div className="text-xs text-[var(--muted)]">ID: {product.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)]">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)] font-medium">
                                            {product.stock} un.
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)]">
                                            S/ {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                                product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-rose-500/10 text-rose-500'
                                                }`}>
                                                {product.status === 'Active' ? 'Activo' :
                                                    product.status === 'Low Stock' ? 'Bajo Stock' : 'Agotado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-[var(--muted)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--bg-soft)]"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-[var(--muted)] hover:text-red-500 rounded-lg hover:bg-[var(--bg-soft)]"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Clean Neutral Design */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl overflow-hidden">
                        {/* Header - Subtle accent */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                            <h2 className="text-lg font-semibold text-[var(--text)]">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <p className="text-sm text-[var(--muted)] mt-0.5">Complete los datos del producto</p>
                        </div>

                        {/* Form */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Laptop Gamer X"
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Categoría</label>
                                <input
                                    type="text"
                                    list="category-options"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder={categories.length > 0 ? "Seleccionar o escribir..." : "Escribir categoría..."}
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                />
                                <datalist id="category-options">
                                    {categories.map(c => <option key={c.id} value={c.name} />)}
                                </datalist>
                                {categories.length === 0 && (
                                    <p className="text-xs text-[var(--muted)] mt-1">Escribe el nombre de la categoría</p>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] text-center focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Mínimo</label>
                                    <input
                                        type="number"
                                        value={formData.min_stock}
                                        onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] text-center focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Precio S/</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] text-center focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    />
                                </div>
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
