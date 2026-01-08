import { useState } from 'react';
import { ArrowUp, ArrowDown, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventory } from '../context/InventoryContext';

export const StockAdjustmentsPage = () => {
    const { adjustments, addAdjustment, products, loading } = useInventory();

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalType, setModalType] = useState<'increase' | 'decrease'>('increase');
    const [formData, setFormData] = useState({
        product: '',
        quantity: 0,
        reason: '',
        user_name: 'Admin'
    });

    const handleOpenModal = (type: 'increase' | 'decrease') => {
        setModalType(type);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.product || formData.quantity <= 0 || !formData.reason) {
            toast.error('Complete todos los campos');
            return;
        }
        setSaving(true);
        try {
            await addAdjustment({
                ...formData,
                type: modalType
            });
            setShowModal(false);
            setFormData({ product: '', quantity: 0, reason: '', user_name: 'Admin' });
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
                    <h1 className="text-2xl font-bold text-[var(--text)]">Ajustes de Stock</h1>
                    <p className="text-[var(--muted)]">Registra entradas y salidas manuales</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal('increase')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                        <ArrowUp size={20} />
                        Entrada
                    </button>
                    <button
                        onClick={() => handleOpenModal('decrease')}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                    >
                        <ArrowDown size={20} />
                        Salida
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[var(--border)] flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar ajuste..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-primary)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Motivo</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase">Usuario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                        Cargando ajustes...
                                    </td>
                                </tr>
                            ) : adjustments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[var(--muted)]">
                                        No hay ajustes registrados.
                                    </td>
                                </tr>
                            ) : (
                                adjustments.map((adj) => (
                                    <tr key={adj.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                        <td className="px-6 py-4 text-sm text-[var(--text)] whitespace-nowrap">{adj.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-[var(--text)]">{adj.product_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit ${adj.type === 'increase'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}>
                                                {adj.type === 'increase' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                                {adj.type === 'increase' ? 'Entrada' : 'Salida'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text)] font-mono">{adj.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-[var(--muted)]">{adj.reason}</td>
                                        <td className="px-6 py-4 text-sm text-[var(--muted)]">{adj.user_name}</td>
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
                        {/* Header with subtle type indicator */}
                        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${modalType === 'increase'
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                                    {modalType === 'increase' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[var(--text)]">
                                        {modalType === 'increase' ? 'Nueva Entrada' : 'Nueva Salida'}
                                    </h2>
                                    <p className="text-sm text-[var(--muted)]">
                                        {modalType === 'increase' ? 'Agregar stock' : 'Restar stock'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Producto</label>
                                {products.length === 0 ? (
                                    <div className="px-3 py-2.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
                                        No hay productos. Crea uno primero.
                                    </div>
                                ) : (
                                    <select
                                        value={formData.product}
                                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                    >
                                        <option value="">Seleccionar producto...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Cantidad</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    placeholder="0"
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Motivo</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors resize-none"
                                    rows={3}
                                    placeholder="Ej: Ajuste de inventario..."
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
                                disabled={saving || products.length === 0}
                                className={`px-5 py-2 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-colors ${modalType === 'increase' ? 'bg-emerald-600' : 'bg-rose-600'}`}
                            >
                                {saving && <Loader2 className="animate-spin" size={16} />}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
