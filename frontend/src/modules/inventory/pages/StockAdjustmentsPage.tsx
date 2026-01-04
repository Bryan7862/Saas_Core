import { useState } from 'react';
import { ClipboardList, ArrowUp, ArrowDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventory } from '../context/InventoryContext';

export const StockAdjustmentsPage = () => {
    const { adjustments, addAdjustment, products } = useInventory();

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'increase' | 'decrease'>('increase');
    const [formData, setFormData] = useState({
        product: '',
        quantity: 0,
        reason: '',
        user: 'Admin'
    });

    const handleOpenModal = (type: 'increase' | 'decrease') => {
        setModalType(type);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.product || formData.quantity <= 0 || !formData.reason) {
            toast.error('Complete todos los campos');
            return;
        }

        addAdjustment({
            ...formData,
            type: modalType
        });

        setShowModal(false);
        setFormData({ product: '', quantity: 0, reason: '', user: 'Admin' });
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
                            {adjustments.map((adj) => (
                                <tr key={adj.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text)] whitespace-nowrap">{adj.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text)]">{adj.product}</td>
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
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">{adj.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] rounded-xl w-full max-w-md border border-[var(--border)] shadow-xl">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {modalType === 'increase' ? 'Nueva Entrada' : 'Nueva Salida'}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Producto</label>
                                <select
                                    value={formData.product}
                                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Motivo</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)]"
                                    rows={3}
                                    placeholder="Ej: Ajuste de inventario, devolución, etc."
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
                                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${modalType === 'increase' ? 'bg-emerald-600' : 'bg-rose-600'
                                    }`}
                            >
                                Guardar Ajuste
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
