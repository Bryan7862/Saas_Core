import { useInventory } from '../../inventory/context/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingDown, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const InventoryReportPage = () => {
    const { products } = useInventory();

    // Data Processing
    const categoryDistribution = products.reduce((acc: any[], product) => {
        const existing = acc.find(item => item.name === product.category);
        if (existing) {
            existing.value += product.stock;
        } else {
            acc.push({ name: product.category, value: product.stock });
        }
        return acc;
    }, []);

    const stockLevels = products.slice(0, 8).map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
        stock: p.stock,
        min: p.minStock
    }));

    const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text)]">Reporte de Inventario</h1>
                <p className="text-[var(--muted)]">Análisis detallado de existencias y valorización</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/20">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--muted)]">Total Unidades</p>
                            <p className="text-2xl font-bold">{totalItems}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg dark:bg-amber-900/20">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--muted)]">Productos Agotándose</p>
                            <p className="text-2xl font-bold">{lowStockCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/20">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--muted)]">Valor del Inventario</p>
                            <p className="text-2xl font-bold">S/ {inventoryValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock per Product */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Niveles de Stock por Producto</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockLevels} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                />
                                <Bar dataKey="stock" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution by Category */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Distribución por Categoría</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {categoryDistribution.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-[var(--muted)]">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
