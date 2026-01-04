import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const StockAlertsPage = () => {
    const { products, restockProduct } = useInventory();

    // Filter products that have Low Stock or are Out of Stock
    const alerts = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');

    // Summary counts
    const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
    const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text)]">Alertas de Stock</h1>
                    <p className="text-[var(--muted)]">Productos con stock bajo o agotado</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-orange-600 dark:text-orange-400" />
                        <h3 className="font-bold text-orange-800 dark:text-orange-200">Bajo Stock</h3>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{lowStockCount}</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">Productos por debajo del mínimo</p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-red-600 dark:text-red-400" />
                        <h3 className="font-bold text-red-800 dark:text-red-200">Agotados</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">{outOfStockCount}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Productos sin stock</p>
                </div>
            </div>

            {/* List */}
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[var(--bg-primary)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Stock Mínimo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {alerts.map((item) => (
                            <tr key={item.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                <td className="px-6 py-4 font-medium text-[var(--text)]">{item.name}</td>
                                <td className="px-6 py-4 text-sm text-[var(--muted)]">{item.category}</td>
                                <td className="px-6 py-4 font-bold text-[var(--text)]">{item.stock}</td>
                                <td className="px-6 py-4 text-sm text-[var(--muted)]">{item.minStock}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                        }`}>
                                        {item.status === 'Low Stock' ? 'Bajo Stock' : 'Agotado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => restockProduct(item.id, 20)} // Mocking adding 20 units
                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <ShoppingCart size={14} />
                                        Reabastecer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {alerts.length === 0 && (
                    <div className="p-8 text-center text-[var(--muted)]">
                        No hay alertas de stock en este momento.
                    </div>
                )}
            </div>
        </div>
    );
};
