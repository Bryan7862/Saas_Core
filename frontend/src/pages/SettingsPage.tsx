import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
    Building2, Globe, Percent, ShieldCheck,
    Save, Camera, Languages, DollarSign,
    Bell, Lock, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Configuración guardada correctamente');
        }, 1200);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Configuración General</h1>
                    <p className="text-[var(--muted)]">Gestiona la identidad y parámetros básicos de tu sistema</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Business & Identity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Identity */}
                    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                            <Building2 size={20} className="text-[var(--primary)]" />
                            <h3 className="text-lg font-bold">Identidad del Negocio</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--muted)] group-hover:border-[var(--primary)] transition-colors cursor-pointer overflow-hidden">
                                        <Camera size={24} className="mb-1" />
                                        <span className="text-[10px] uppercase font-bold text-center">Subir<br />Logo</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                        <Camera size={12} />
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Nombre Comercial</label>
                                        <input type="text" defaultValue="Gym Center" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Razón Social</label>
                                        <input type="text" defaultValue="Gym Center S.A.C." className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Número de RUC</label>
                                    <input type="text" defaultValue="20601234567" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Teléfono Principal</label>
                                    <div className="relative">
                                        <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input type="text" defaultValue="+51 987 654 321" className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Dirección Fiscal / Local</label>
                                    <input type="text" defaultValue="Av. Central 456, San Isidro, Lima" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional & Sales Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                                <Globe size={20} className="text-[var(--primary)]" />
                                <h3 className="text-lg font-bold">Regional</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase mb-1 flex items-center gap-1.5">
                                        <Languages size={14} /> Idioma del Sistema
                                    </label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none">
                                        <option>Español (Perú)</option>
                                        <option>English (United States)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Zona Horaria</label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none">
                                        <option>America/Lima (GMT-5)</option>
                                        <option>America/Bogota (GMT-5)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                                <Percent size={20} className="text-[var(--primary)]" />
                                <h3 className="text-lg font-bold">Parámetros</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[var(--muted)] uppercase mb-1 flex items-center gap-1.5">
                                        <DollarSign size={14} /> Moneda Principal
                                    </label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none">
                                        <option>Soles (S/)</option>
                                        <option>Dólares ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Impuesto (IGV %)</label>
                                    <input type="number" defaultValue="18" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: System & Security */}
                <div className="space-y-6">
                    {/* Appearance */}
                    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)]">
                            <h3 className="text-lg font-bold">Personalización</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                                <div>
                                    <p className="font-bold text-sm">Modo Oscuro</p>
                                    <p className="text-[10px] text-[var(--muted)]">Reduce la fatiga visual</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
                                >
                                    <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Quick Link */}
                    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            <h3 className="text-lg font-bold">Seguridad</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors group">
                                <Lock size={18} className="text-[var(--muted)] group-hover:text-[var(--primary)]" />
                                <div className="text-left">
                                    <p className="font-bold text-sm">Contraseña</p>
                                    <p className="text-[10px] text-[var(--muted)]">Actualiza tu clave de acceso</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors group">
                                <Bell size={18} className="text-[var(--muted)] group-hover:text-[var(--primary)]" />
                                <div className="text-left">
                                    <p className="font-bold text-sm">Notificaciones</p>
                                    <p className="text-[10px] text-[var(--muted)]">Alertas de stock y ventas</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* App Version */}
                    <div className="p-6 text-center">
                        <div className="inline-block px-4 py-1.5 bg-[var(--bg-primary)] rounded-full border border-[var(--border)] text-[10px] font-black tracking-widest text-[var(--muted)] uppercase mb-2">
                            Versión 1.0.4 - Pro
                        </div>
                        <p className="text-[10px] text-[var(--muted)] uppercase font-bold">Motor SaaS Core © 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

