import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Save, Globe, Moon, Bell } from 'lucide-react';

export const OrganizationSettingsPage = () => {
    // Current org context
    // Assuming route is /organizations/:id/settings or similar
    // Or just /settings/organization using context
    // The previous prompt suggested /organization/settings. 
    // Let's assume we read from context or route. 
    // For now, let's use the current company from localStorage logic maintained in top-bar.
    const currentOrgId = localStorage.getItem('current_company_id');

    const [activeTab, setActiveTab] = useState('preferences');
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (currentOrgId) loadSettings();
    }, [currentOrgId]);

    const loadSettings = async () => {
        try {
            // Backend endpoint: /organizations/:id/settings
            // Headers handled by api auto-interceptor if implemented, or we rely on param.
            const { data } = await api.get(`/organizations/${currentOrgId}/settings`);
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);
        try {
            await api.patch(`/organizations/${currentOrgId}/settings`, settings);
            setMsg({ type: 'success', text: 'Preferencias guardadas correctamente.' });
        } catch (error) {
            console.error('Save failed', error);
            setMsg({ type: 'error', text: 'Error al guardar los cambios.' });
        } finally {
            setSaving(false);
        }
    };

    if (!currentOrgId) return <div className="p-8">Selecciona una organización primero.</div>;
    if (loading) return <div className="p-8">Cargando preferencias...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Configuración de Organización</h1>

            {/* Tabs */}
            <div className="border-b border-[var(--border)] mb-6 flex gap-6">
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'preferences'
                        ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                >
                    Preferencias Regionales
                </button>
                {/* Future: 'General' (Name/Logo) */}
            </div>

            {/* Content */}
            <div className={`space-y-6 ${activeTab === 'preferences' ? 'block' : 'hidden'}`}>
                <form onSubmit={handleSave} className="space-y-8">

                    {/* Time & Region */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="text-[var(--primary)]" size={20} />
                            <h3 className="text-lg font-medium text-[var(--text)]">Región y Formato</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Zona Horaria</label>
                                <select
                                    value={settings.timezone || 'UTC'}
                                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)]"
                                >
                                    <option value="UTC">UTC (Universal)</option>
                                    <option value="America/Lima">America/Lima (Peru)</option>
                                    <option value="America/New_York">America/New_York</option>
                                    <option value="Europe/Madrid">Europe/Madrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Formato de Fecha</label>
                                <select
                                    value={settings.dateFormat || 'DD/MM/YYYY'}
                                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)]"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Moneda Principal</label>
                                <select
                                    value={settings.currency || 'USD'}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)]"
                                >
                                    <option value="USD">Dólar Estadounidense (USD)</option>
                                    <option value="PEN">Sol Peruano (PEN)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Appearance & Notifications */}
                    <div className="bg-[var(--card-bg)] p-6 rounded-lg border border-[var(--border)] shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Moon className="text-[var(--primary)]" size={20} />
                            <h3 className="text-lg font-medium text-[var(--text)]">Apariencia</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tema por defecto</label>
                                <select
                                    value={settings.theme || 'system'}
                                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)]"
                                >
                                    <option value="light">Claro / Light</option>
                                    <option value="dark">Oscuro / Dark</option>
                                    <option value="system">Sistema / Automático</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between pt-6">
                                <span className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                                    <Bell size={16} />
                                    Activar Notificaciones por Email
                                </span>
                                <input
                                    type="checkbox"
                                    checked={settings.notificationsEnabled ?? true}
                                    onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                                    className="h-5 w-5 text-[var(--primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {msg && (
                        <div className={`p-4 rounded-md ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[var(--primary)] text-white px-6 py-2 rounded-md font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
