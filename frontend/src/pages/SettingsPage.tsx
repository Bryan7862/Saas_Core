import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
    Building2, Globe, Percent, ShieldCheck,
    Save, Camera, Languages, Coins,
    Bell, Lock, Smartphone, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getGeneralSettings, saveGeneralSettings, uploadLogo, GeneralSettings } from '../modules/settings/supabaseApi';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState<Partial<GeneralSettings>>({
        business_name: '',
        legal_name: '',
        ruc: '',
        phone: '',
        address: '',
        language: 'es-PE',
        timezone: 'America/Lima',
        currency: 'PEN',
        tax_rate: 18,
        logo_url: '',
    });
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const orgId = localStorage.getItem('current_company_id') || 'default';

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const data = await getGeneralSettings(orgId);
            if (data) {
                setFormData({
                    business_name: data.business_name || '',
                    legal_name: data.legal_name || '',
                    ruc: data.ruc || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    language: data.language || 'es-PE',
                    timezone: data.timezone || 'America/Lima',
                    currency: data.currency || 'PEN',
                    tax_rate: data.tax_rate || 18,
                    logo_url: data.logo_url || '',
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Error al cargar configuración');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof GeneralSettings, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveGeneralSettings(orgId, formData);
            toast.success('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Error al guardar configuración');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen');
            return;
        }

        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('La imagen debe ser menor a 2MB');
            return;
        }

        setIsUploadingLogo(true);
        try {
            const logoUrl = await uploadLogo(orgId, file);
            setFormData(prev => ({ ...prev, logo_url: logoUrl }));
            // Guardar inmediatamente
            await saveGeneralSettings(orgId, { ...formData, logo_url: logoUrl });
            toast.success('Logo actualizado');
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Error al subir logo');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <span className="ml-3 text-[var(--muted)]">Cargando configuración...</span>
            </div>
        );
    }

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
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-2xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--muted)] group-hover:border-[var(--primary)] transition-colors cursor-pointer overflow-hidden"
                                    >
                                        {isUploadingLogo ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : formData.logo_url ? (
                                            <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Camera size={24} className="mb-1" />
                                                <span className="text-[10px] uppercase font-bold text-center">Subir<br />Logo</span>
                                            </>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform cursor-pointer"
                                    >
                                        <Camera size={12} />
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Nombre Comercial</label>
                                        <input
                                            type="text"
                                            value={formData.business_name || ''}
                                            onChange={(e) => handleChange('business_name', e.target.value)}
                                            placeholder="Ej: Mi Negocio"
                                            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Razón Social</label>
                                        <input
                                            type="text"
                                            value={formData.legal_name || ''}
                                            onChange={(e) => handleChange('legal_name', e.target.value)}
                                            placeholder="Ej: Mi Negocio S.A.C."
                                            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Número de RUC</label>
                                    <input
                                        type="text"
                                        value={formData.ruc || ''}
                                        onChange={(e) => handleChange('ruc', e.target.value)}
                                        placeholder="20XXXXXXXXX"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Teléfono Principal</label>
                                    <div className="relative">
                                        <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                        <input
                                            type="text"
                                            value={formData.phone || ''}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="+51 999 999 999"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Dirección Fiscal / Local</label>
                                    <input
                                        type="text"
                                        value={formData.address || ''}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Av. Principal 123, Distrito, Ciudad"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
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
                                    <select
                                        value={formData.language || 'es-PE'}
                                        onChange={(e) => handleChange('language', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none"
                                    >
                                        <option value="es-PE">Español (Perú)</option>
                                        <option value="en-US">English (United States)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Zona Horaria</label>
                                    <select
                                        value={formData.timezone || 'America/Lima'}
                                        onChange={(e) => handleChange('timezone', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none"
                                    >
                                        <option value="America/Lima">America/Lima (GMT-5)</option>
                                        <option value="America/Bogota">America/Bogota (GMT-5)</option>
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
                                        <Coins size={14} /> Moneda Principal
                                    </label>
                                    <select
                                        value={formData.currency || 'PEN'}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] outline-none"
                                    >
                                        <option value="PEN">Soles Peruanos (S/)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--muted)] uppercase mb-1">Impuesto (IGV %)</label>
                                    <input
                                        type="number"
                                        value={formData.tax_rate || 18}
                                        onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
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

