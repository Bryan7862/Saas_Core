import { useState } from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
    // Mock Data
    const [products, setProducts] = useState([
        { id: 1, name: 'Laptop Gamer X', category: 'Electrónica', stock: 12, price: 3500.00, status: 'Active' },
        { id: 2, name: 'Silla Ergonómica', category: 'Mobiliario', stock: 45, price: 450.00, status: 'Active' },
        { id: 3, name: 'Teclado Mecánico', category: 'Electrónica', stock: 8, price: 120.00, status: 'Low Stock' },
        { id: 4, name: 'Monitor 24"', category: 'Electrónica', stock: 0, price: 600.00, status: 'Out of Stock' },
    ]);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== id));
            toast.success('Producto eliminado');
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
                    onClick={() => toast('Función de agregar próximamente')}
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
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--muted)]">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-[var(--text)]">{product.name}</div>
                                                <div className="text-xs text-[var(--muted)]">SKU: {1000 + product.id}</div>
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
                                            <button className="p-2 text-[var(--muted)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--bg-soft)]">
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
