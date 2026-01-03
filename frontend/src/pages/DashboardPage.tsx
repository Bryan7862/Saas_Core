import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions, createTransaction, Transaction, getKpis, updateKpi } from '../modules/dashboard/api';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    FileText,
    Package,
    Plus,
    UserPlus,
    FilePlus,
    X,
    Calendar,
    Tag,
    Type
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Tipos para los datos
interface DataPoint {
    name: string;
    ingresos: number;
    gastos: number;
    fullDate?: string; // Para referencia
}

interface CategoryData {
    name: string;
    ventas: number;
}

interface KpiData {
    ingresos: number;
    clientes: number;
    facturas: number;
    inventario: number;
}

export function DashboardPage() {
    const { theme } = useTheme();
    // Estado para KPIs
    const [kpis, setKpis] = useState<KpiData>({
        ingresos: 0,
        clientes: 0,
        facturas: 0,
        inventario: 0
    });

    // Estado para datos de gráficos
    const [dataArea, setDataArea] = useState<DataPoint[]>([]);
    const [dataBar, setDataBar] = useState<CategoryData[]>([]);

    // Estado para modales
    const [showAddDataModal, setShowAddDataModal] = useState(false);
    const [modalType, setModalType] = useState<'ingreso' | 'venta' | 'kpi'>('ingreso');

    // Estados para formulario
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        type: 'ingreso', // ingreso | gasto
        amount: '',
        description: '', // Qué objeto/producto
        category: 'Electronica',
        kpiType: 'ingresos',
        kpiValue: ''
    });

    const categories = [
        'Electrónica',
        'Ropa',
        'Hogar',
        'Juguetes',
        'Libros',
        'Deportes',
        'Alimentos',
        'Otros'
    ];

    const openModal = (type: 'ingreso' | 'venta' | 'kpi') => {
        setModalType(type);
        setShowAddDataModal(true);
        // Reset form with defaults
        setFormData({
            date: new Date().toISOString().split('T')[0],
            type: 'ingreso',
            amount: '',
            description: '',
            category: 'Electrónica',
            kpiType: 'ingresos',
            kpiValue: ''
        });
    };

    const getMonthName = (dateStr: string) => {
        if (!dateStr) return 'Desconocido';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Desconocido';

        // Ajuste para zona horaria local si es necesario, pero para nombres de mes simples:
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[date.getUTCMonth()];
    };

    const [loading, setLoading] = useState(true);

    const processChartData = (txs: Transaction[]) => {
        const monthsData = new Map<string, { name: string, ingresos: number, gastos: number, monthId: number }>();
        const categoryMap = new Map<string, number>();

        txs.forEach(tx => {
            // Area Chart Processing
            const date = new Date(tx.date);
            // Ignore invalid dates
            if (isNaN(date.getTime())) return;

            const monthName = getMonthName(tx.date);
            const monthId = date.getUTCMonth(); // 0-11
            const key = `${date.getUTCFullYear()}-${monthId}`; // Unique key per month/year

            if (!monthsData.has(key)) {
                monthsData.set(key, { name: monthName, ingresos: 0, gastos: 0, monthId });
            }

            const monthEntry = monthsData.get(key)!;
            if (tx.type === 'ingreso') {
                monthEntry.ingresos += Number(tx.amount);
            } else {
                monthEntry.gastos += Number(tx.amount);
            }

            // Category Processing (simplified logic - assuming category field used for sales too or strictly sales)
            // If the user uses "Venta" modal, it sends type='ingreso' usually, but let's assume specific logic or category field usage
            if (tx.category) {
                const current = categoryMap.get(tx.category) || 0;
                // Sum strict amounts regardless of type? Or only income? Let's sum income for "Sales"
                if (tx.type === 'ingreso') {
                    categoryMap.set(tx.category, current + Number(tx.amount));
                }
            }
        });

        // Convert Map to Array and Sort
        const monthsOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const areaResult = Array.from(monthsData.values()).sort((a, b) => {
            // Simple sort by month index
            return monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name);
        });

        const barResult = Array.from(categoryMap.entries()).map(([name, ventas]) => ({ name, ventas }));

        setDataArea(areaResult);
        setDataBar(barResult);

        // Update total ingresos KPI from processed data
        setKpis(prev => ({ ...prev, ingresos: areaResult.reduce((sum, d) => sum + d.ingresos, 0) }));
    };

    const loadData = async () => {
        try {
            // Load transactions and KPIs in parallel
            const [txs, kpisData] = await Promise.all([
                getTransactions().catch(() => []),
                getKpis().catch(() => ({ clientes: 0, facturas: 0, inventario: 0 }))
            ]);

            processChartData(txs);

            // Update KPIs from backend (except ingresos which comes from transactions)
            setKpis(prev => ({
                ...prev,
                clientes: kpisData.clientes || 0,
                facturas: kpisData.facturas || 0,
                inventario: kpisData.inventario || 0
            }));
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Loading state - show spinner while data is being fetched
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center text-[var(--muted)]">
                <div className="animate-pulse">Cargando dashboard...</div>
            </div>
        );
    }

    const handleAddIngresoGasto = async () => {
        if (formData.date && formData.amount) {
            try {
                const payload = {
                    date: formData.date,
                    type: formData.type as 'ingreso' | 'gasto',
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    category: 'General'
                };
                console.log("Sending transaction:", payload); // Debug log

                await createTransaction(payload);

                await loadData();
                setShowAddDataModal(false);
            } catch (error: any) {
                console.error("Error creating transaction", error);
                const msg = error.response?.data?.message || error.message || "Error desconocido";
                alert(`Error al guardar: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
            }
        } else {
            alert("Por favor completa la fecha y el monto");
        }
    };

    const handleAddVenta = async () => {
        if (formData.category && formData.amount) {
            try {
                const payload = {
                    date: formData.date,
                    type: 'ingreso' as const, // Salesforce bug fix: forced literal type
                    amount: parseFloat(formData.amount),
                    description: formData.description || 'Venta',
                    category: formData.category
                };
                console.log("Sending sale:", payload);

                await createTransaction(payload);
                await loadData();
                setShowAddDataModal(false);
            } catch (error: any) {
                console.error("Error creating sale", error);
                const msg = error.response?.data?.message || error.message || "Error desconocido";
                alert(`Error al guardar venta: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
            }
        }
    };

    const handleUpdateKpi = async () => {
        if (formData.kpiValue) {
            const value = parseFloat(formData.kpiValue) || 0;

            try {
                // Persist to backend
                await updateKpi({
                    kpiType: formData.kpiType,
                    value: value
                });

                // Update local state
                setKpis(prev => ({
                    ...prev,
                    [formData.kpiType]: value
                }));
                setShowAddDataModal(false);
            } catch (error: any) {
                console.error("Error updating KPI", error);
                const msg = error.response?.data?.message || error.message || "Error desconocido";
                alert(`Error al guardar KPI: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
            }
        }
    };

    const totalIngresos = kpis.ingresos > 0 ? kpis.ingresos : dataArea.reduce((sum, d) => sum + d.ingresos, 0);
    // Mostrar el total de área o el KPI, dependiendo de uso. 
    // Para consistencia con el modal KPI, usamos el KPI si se setea manualmente, o sumamos si se agregan transacciones.
    const displayIngresos = totalIngresos;
    const totalVentas = dataBar.reduce((sum, d) => sum + d.ventas, 0);

    return (
        <div className="h-full flex flex-col overflow-y-auto gap-6 pr-2">
            {/* 1. KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 flex-none">
                <KpiCard
                    title="Ingresos del Mes"
                    value={`S/ ${displayIngresos.toLocaleString()}`}
                    trend={displayIngresos > 0 ? "+0%" : "0%"}
                    isPositive={displayIngresos > 0}
                    icon={DollarSign}
                    onAdd={() => openModal('kpi')}
                />
                <KpiCard
                    title="Nuevos Clientes"
                    value={kpis.clientes.toString()}
                    trend={kpis.clientes > 0 ? "+0%" : "0%"}
                    isPositive={kpis.clientes > 0}
                    icon={Users}
                    onAdd={() => openModal('kpi')}
                />
                <KpiCard
                    title="Facturas Abiertas"
                    value={kpis.facturas.toString()}
                    trend="0%"
                    isPositive={false}
                    icon={FileText}
                    onAdd={() => openModal('kpi')}
                />
                <KpiCard
                    title="Nivel de Inventario"
                    value={kpis.inventario.toLocaleString()}
                    trend={kpis.inventario > 0 ? "+0%" : "0%"}
                    isPositive={kpis.inventario > 0}
                    icon={Package}
                    onAdd={() => openModal('kpi')}
                />
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ingresos vs Gastos */}
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-[var(--muted)] text-sm font-medium mb-1">Ingresos vs. Gastos</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[var(--text)]">S/ {dataArea.reduce((acc, curr) => acc + curr.ingresos, 0).toLocaleString()}</span>
                                {dataArea.length > 0 && (
                                    <span className="text-sm font-medium text-green-600">Total acumulado</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => openModal('ingreso')}
                            className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                        >
                            <Plus size={16} />
                            Agregar
                        </button>
                    </div>

                    <div className="h-[300px] w-full">
                        {dataArea.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--muted)]">
                                <FileText size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Sin datos aún.</p>
                                <p className="text-sm">Añade tus primeros registros de ingresos y gastos.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dataArea}>
                                    <defs>
                                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: 'var(--muted)' }}
                                        dy={10}
                                    />
                                    <CartesianGrid vertical={false} stroke="var(--border)" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text)'
                                        }}
                                        formatter={(value) => [`S/ ${(value as number)?.toLocaleString() ?? 0}`, '']}
                                        itemStyle={{ color: 'var(--text)' }}
                                        labelStyle={{ color: 'var(--muted)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ingresos"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorIngresos)"
                                        name="Ingresos"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="gastos"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorGastos)"
                                        name="Gastos"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h3 className="text-[var(--muted)] text-sm font-medium mb-1">Ventas por Categoría</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[var(--text)]">S/ {totalVentas.toLocaleString()}</span>
                                {dataBar.length > 0 && (
                                    <span className="text-sm font-medium text-green-600">Total ventas</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => openModal('venta')}
                            className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                        >
                            <Plus size={16} />
                            Agregar
                        </button>
                    </div>

                    <div className="h-[300px] w-full">
                        {dataBar.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--muted)]">
                                <Package size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Sin datos aún.</p>
                                <p className="text-sm">Añade tus primeras ventas por categoría.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataBar}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: 'var(--muted)' }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-primary)' }}
                                        contentStyle={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text)'
                                        }}
                                        formatter={(value) => [`S/ ${(value as number)?.toLocaleString() ?? 0}`, 'Ventas']}
                                        itemStyle={{ color: 'var(--text)' }}
                                        labelStyle={{ color: 'var(--muted)' }}
                                    />
                                    <Bar
                                        dataKey="ventas"
                                        fill="var(--border)"
                                        radius={[4, 4, 0, 0]}
                                        activeBar={{ fill: 'var(--primary)' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Quick Access */}
            <div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-4">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAction icon={Plus} label="Nueva Venta" to="/sales/pos" />
                    <QuickAction icon={UserPlus} label="Añadir Cliente" to="/clients/new" />
                    <QuickAction icon={Package} label="Nuevo Producto" to="/inventory/products" />
                    <QuickAction icon={FilePlus} label="Reportes" to="/reports/sales" />
                </div>
            </div>

            {/* Modal para agregar datos */}
            {showAddDataModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-xl w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[var(--text)]">
                                {modalType === 'ingreso' && 'Agregar Transacción'}
                                {modalType === 'venta' && 'Agregar Venta por Categoría'}
                                {modalType === 'kpi' && 'Actualizar KPI'}
                            </h3>
                            <button
                                onClick={() => setShowAddDataModal(false)}
                                className="text-[var(--muted)] hover:text-[var(--text)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {modalType === 'ingreso' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tipo</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="ingreso"
                                                checked={formData.type === 'ingreso'}
                                                onChange={() => setFormData({ ...formData, type: 'ingreso' })}
                                                className="accent-[var(--primary)]"
                                            />
                                            <span className="text-[var(--text)]">Ingreso</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="gasto"
                                                checked={formData.type === 'gasto'}
                                                onChange={() => setFormData({ ...formData, type: 'gasto' })}
                                                className="accent-red-500"
                                            />
                                            <span className="text-[var(--text)]">Gasto</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Fecha</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Concepto / Descripción</label>
                                    <div className="relative">
                                        <Type size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="text"
                                            placeholder="Ej: Venta de Laptop / Pago de Luz"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Monto (S/)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddIngresoGasto}
                                    className="w-full py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 mt-2"
                                >
                                    Guardar Transacción
                                </button>
                            </div>
                        )}

                        {modalType === 'venta' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Categoría</label>
                                    <div className="relative">
                                        <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <select
                                            value={formData.category} // Use 'category' for category selection
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Fecha de Venta</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Producto / Descripción</label>
                                    <div className="relative">
                                        <Type size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="text"
                                            placeholder="Ej: Camiseta Talla M"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Monto de Venta (S/)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddVenta}
                                    className="w-full py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 mt-2"
                                >
                                    Registrar Venta
                                </button>
                            </div>
                        )}

                        {modalType === 'kpi' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tipo de KPI</label>
                                    <select
                                        value={formData.kpiType}
                                        onChange={(e) => setFormData({ ...formData, kpiType: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                    >
                                        <option value="ingresos">Ingresos del Mes</option>
                                        <option value="clientes">Nuevos Clientes</option>
                                        <option value="facturas">Facturas Abiertas</option>
                                        <option value="inventario">Nivel de Inventario</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted)] mb-1">Valor</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.kpiValue}
                                        onChange={(e) => setFormData({ ...formData, kpiValue: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)]"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateKpi}
                                    className="w-full py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90"
                                >
                                    Actualizar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function KpiCard({ title, value, trend, isPositive, onAdd }: any) {
    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm transition-all hover:shadow-md relative group">
            <button
                onClick={onAdd}
                className="absolute top-3 right-3 w-8 h-8 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--primary)] hover:text-white"
                title="Editar"
            >
                <Plus size={16} />
            </button>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-[var(--text)]">{value}</h3>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isPositive ? (
                    <TrendingUp size={16} className="text-green-500" />
                ) : (
                    <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {trend}
                </span>
                <span className="text-sm text-[var(--muted)]">vs mes anterior</span>
            </div>
        </div>
    );
}

function QuickAction({ icon: Icon, label, to, onClick }: any) {
    if (to) {
        return (
            <Link to={to} className="flex flex-col items-center justify-center p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--muted)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-soft)] transition-colors">
                    <Icon size={24} />
                </div>
                <span className="font-medium text-[var(--text)]">{label}</span>
            </Link>
        );
    }
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-sm transition-all group"
        >
            <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--muted)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-[var(--bg-soft)] transition-colors">
                <Icon size={24} />
            </div>
            <span className="font-medium text-[var(--text)]">{label}</span>
        </button>
    );
}
