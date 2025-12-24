import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        const date = new Date(dateStr);
        // Ajuste para zona horaria local si es necesario, pero para nombres de mes simples:
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[date.getUTCMonth()]; // Usar UTC para evitar problemas de timezone con strings YYYY-MM-DD
    };

    const handleAddIngresoGasto = () => {
        if (formData.date && formData.amount) {
            const amount = parseFloat(formData.amount) || 0;
            const monthName = getMonthName(formData.date);
            const isIngreso = formData.type === 'ingreso';

            setDataArea(prev => {
                const newData = [...prev];
                const existingIndex = newData.findIndex(d => d.name === monthName);

                if (existingIndex >= 0) {
                    if (isIngreso) newData[existingIndex].ingresos += amount;
                    else newData[existingIndex].gastos += amount;
                } else {
                    newData.push({
                        name: monthName,
                        ingresos: isIngreso ? amount : 0,
                        gastos: isIngreso ? 0 : amount
                    });
                    // Ordenar por meses (simplificado)
                    // En una app real usaríamos fechas completas para ordenar
                }
                return newData;
            });

            // Actualizar KPI si es Ingreso (opcional, para coherencia)
            if (isIngreso) {
                setKpis(prev => ({ ...prev, ingresos: prev.ingresos + amount }));
            }

            setShowAddDataModal(false);
        }
    };

    const handleAddVenta = () => {
        if (formData.category && formData.amount) {
            const amount = parseFloat(formData.amount) || 0;

            setDataBar(prev => {
                const newData = [...prev];
                const existingIndex = newData.findIndex(d => d.name === formData.category);

                if (existingIndex >= 0) {
                    newData[existingIndex].ventas += amount;
                } else {
                    newData.push({
                        name: formData.category,
                        ventas: amount
                    });
                }
                return newData;
            });
            setShowAddDataModal(false);
        }
    };

    const handleUpdateKpi = () => {
        if (formData.kpiValue) {
            const value = parseFloat(formData.kpiValue) || 0;
            setKpis(prev => ({
                ...prev,
                [formData.kpiType]: value
            }));
            setShowAddDataModal(false);
        }
    };

    const handleGenerateReport = () => {
        // Generar CSV simple
        const headers = ['Mes', 'Ingresos', 'Gastos'];
        const rows = dataArea.map(d => [d.name, d.ingresos, d.gastos]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_financiero.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalIngresos = kpis.ingresos > 0 ? kpis.ingresos : dataArea.reduce((sum, d) => sum + d.ingresos, 0);
    // Mostrar el total de área o el KPI, dependiendo de uso. 
    // Para consistencia con el modal KPI, usamos el KPI si se setea manualmente, o sumamos si se agregan transacciones.
    const displayIngresos = totalIngresos;
    const totalVentas = dataBar.reduce((sum, d) => sum + d.ventas, 0);

    return (
        <div className="space-y-8">
            {/* 1. KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <QuickAction icon={Plus} label="Crear Factura" to="/invoices/new" />
                    <QuickAction icon={UserPlus} label="Añadir Cliente" to="/users" />
                    <QuickAction icon={Package} label="Nuevo Producto" to="/settings/general" />
                    <QuickAction icon={FilePlus} label="Generar Reporte" onClick={handleGenerateReport} />
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
