import { useTheme } from '../context/ThemeContext';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="h-full overflow-y-auto space-y-6 pr-2">
            <h1 className="text-2xl font-bold text-[var(--text)]">Configuración General</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-[var(--text)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                        <span>🏢</span> Información de la Organización
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre del Negocio</label>
                        <input type="text" defaultValue="Gym Center" className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Zona Horaria</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                            <option>America/Lima (GMT-5) - Perú</option>
                            <option>America/Bogota (GMT-5)</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <button type="button" className="w-full py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Guardar Información
                        </button>
                    </div>
                </div>

                <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-[var(--text)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                        <span>🎨</span> Personalización y Sistema
                    </h3>

                    <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)]">
                        <div>
                            <p className="font-medium text-[var(--text)]">Apariencia</p>
                            <p className="text-sm text-[var(--muted)]">Alternar entre modo claro y oscuro</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
                        >
                            <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                        </button>
                    </div>
                    <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] text-sm text-[var(--muted)]">
                        <p>Versión del Sistema: <strong>v1.0.2</strong></p>
                        <p>Última actualización: <strong>24 Dic 2025</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
