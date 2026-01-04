import { useState } from 'react';
import { CreditCard, Wallet, Banknote, QrCode, Smartphone, Save, ShieldCheck, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentMethodsPage = () => {
    const [methods, setMethods] = useState([
        { id: 1, name: 'Efectivo', icon: Banknote, enabled: true, description: 'Pagos directamente en caja (Soles)', color: 'text-emerald-500' },
        { id: 2, name: 'Tarjetas (POS)', icon: CreditCard, enabled: true, description: 'Crédito y Débito (Visa, MC, Amex)', color: 'text-blue-500' },
        { id: 3, name: 'Yape', icon: Smartphone, enabled: true, description: 'Transferencia móvil rápida BCP', color: 'text-purple-600', extra: '999 999 999' },
        { id: 4, name: 'Plin', icon: QrCode, enabled: true, description: 'Transferencia móvil interbancaria', color: 'text-cyan-500', extra: '999 999 999' },
        { id: 5, name: 'Transferencia', icon: Wallet, enabled: false, description: 'Cuentas BCP, BBVA, Scotiabank', color: 'text-orange-500' },
    ]);

    const handleToggle = (id: number) => {
        setMethods(methods.map(m =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ));
    };

    const handleSave = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: 'Guardando configuración...',
                success: 'Métodos de pago actualizados',
                error: 'Error al guardar',
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Métodos de Pago</h1>
                    <p className="text-[var(--muted)]">Configura cómo tus clientes pueden pagar en tu negocio</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                    <Save size={18} />
                    Guardar Cambios
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        className={`bg-[var(--surface)] p-6 rounded-xl border transition-all duration-200 ${method.enabled ? 'border-[var(--primary)] shadow-sm' : 'border-[var(--border)] opacity-60'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-[var(--bg-primary)] ${method.color}`}>
                                <method.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{method.name}</h3>
                                    {method.enabled && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded dark:bg-emerald-900/30 dark:text-emerald-400 tracking-tighter">ACTIVO</span>}
                                </div>
                                <p className="text-sm text-[var(--muted)]">{method.description}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                {method.enabled && method.extra && (
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] text-[var(--muted)] uppercase font-bold">Dato Visible</p>
                                        <p className="text-sm font-mono">{method.extra}</p>
                                    </div>
                                )}

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={method.enabled}
                                        onChange={() => handleToggle(method.id)}
                                    />
                                    <div className="w-11 h-6 bg-[var(--border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                                </label>
                            </div>
                        </div>

                        {method.enabled && (
                            <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Comisión / Recargo (%)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    />
                                    <p className="mt-1 text-[10px] text-[var(--muted)]">Se aplicará automáticamente al total de la venta.</p>
                                </div>
                                {method.name !== 'Efectivo' && (
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-2">Número de cuenta / Celular</label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa el dato para mostrar al cliente"
                                            defaultValue={method.extra}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-300">Seguridad y Transparencia</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                        Los métodos de pago configurados aquí aparecerán como opciones en tu Punto de Venta (POS). Las comisiones configuradas se sumarán al precio final para cubrir costos operativos de pasarelas.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Info size={20} className="text-amber-500" />
                        ¿Deseas integrar pasarelas?
                    </h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">
                        Actualmente solo admitimos registro manual. Próximamente podrás integrar **Niubiz**, **Izipay** o **MercadoPago** directamente para conciliación automática.
                    </p>
                </div>
            </div>
        </div>
    );
};
