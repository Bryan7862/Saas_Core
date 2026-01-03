import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const salesData = [
    { name: 'Ene', ventas: 4000 },
    { name: 'Feb', ventas: 3000 },
    { name: 'Mar', ventas: 2000 },
    { name: 'Abr', ventas: 2780 },
    { name: 'May', ventas: 1890 },
    { name: 'Jun', ventas: 2390 },
];

const categoryData = [
    { name: 'Electrónica', value: 400 },
    { name: 'Ropa', value: 300 },
    { name: 'Hogar', value: 300 },
    { name: 'Otros', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text)]">Reportes y Analíticas</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Ventas Mensuales</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                />
                                <Bar dataKey="ventas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Distribución por Categoría</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {categoryData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
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
