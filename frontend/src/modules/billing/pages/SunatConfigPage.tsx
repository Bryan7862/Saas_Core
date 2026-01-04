import { useState } from 'react';
import { Shield, Key, Globe, FileCheck, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBilling, SunatConfig } from '../context/BillingContext';

export const SunatConfigPage = () => {
    const { sunatConfig, updateSunatConfig } = useBilling();
    const [formData, setFormData] = useState<SunatConfig>(sunatConfig);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            updateSunatConfig(formData);
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold">Configuración SUNAT</h1>
                <p className="text-[var(--muted)]">Configura tus credenciales de Facturación Electrónica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Cards */}
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe size={18} className="text-blue-500" />
                        <span className="text-sm font-medium">Ambiente</span>
                    </div>
                    <p className={`text-lg font-bold ${formData.environment === 'Producción' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {formData.environment}
                    </p>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <FileCheck size={18} className="text-emerald-500" />
                        <span className="text-sm font-medium">Certificado Digital</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-emerald-500">Activo</p>
                        <span className="text-[10px] text-[var(--muted)]">Expira en 245 días</span>
                    </div>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={18} className="text-purple-500" />
                        <span className="text-sm font-medium">Conexión</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-500">Estable</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex items-center gap-2">
                        <Key size={20} className="text-[var(--primary)]" />
                        <h3 className="text-lg font-bold">Credenciales SOL</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Número de RUC</label>
                                <input
                                    type="text"
                                    value={formData.ruc}
                                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono"
                                    placeholder="20XXXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Entorno de Emisión</label>
                                <select
                                    value={formData.environment}
                                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                >
                                    <option value="Pruebas">Beta / Pruebas (SUNAT)</option>
                                    <option value="Producción">Producción (En vivo)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Usuario SOL</label>
                                <input
                                    type="text"
                                    value={formData.solUser}
                                    onChange={(e) => setFormData({ ...formData, solUser: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="USUARIO123"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Contraseña SOL</label>
                                <input
                                    type="password"
                                    value={formData.solPass}
                                    onChange={(e) => setFormData({ ...formData, solPass: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex gap-3">
                            <AlertCircle size={20} className="text-blue-500 shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                Las credenciales SOL son necesarias para la comunicación con los servidores de SUNAT u OSE. Asegúrate de usar un usuario secundario con permisos de emisión.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex items-center gap-2">
                        <FileCheck size={20} className="text-[var(--primary)]" />
                        <h3 className="text-lg font-bold">Certificado PFX</h3>
                    </div>
                    <div className="p-6">
                        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--primary)] transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <CheckCircle2 size={24} className="text-emerald-500" />
                            </div>
                            <h4 className="font-bold">Certificado Digital Cargado</h4>
                            <p className="text-sm text-[var(--muted)] mb-4">NOMBRE_CERTIFICADO.pfx (Válido hasta Oct 2026)</p>
                            <button type="button" className="text-xs font-bold text-[var(--primary)] hover:underline">
                                REEMPLAZAR CERTIFICADO
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button type="button" className="px-6 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] transition-colors font-medium">
                        Restablecer
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};
