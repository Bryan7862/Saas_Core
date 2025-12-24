import { useTheme } from '../context/ThemeContext';

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text">Configuración General</h1>

            <div className="bg-surface p-6 rounded-xl shadow-sm max-w-3xl space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-text mb-4">Información de la Organización</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Nombre del Negocio</label>
                            <input type="text" defaultValue="Gym Center" className="w-full px-4 py-2 rounded-lg border border-border bg-input text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>

                        {/* Theme Toggle Section */}
                        <div className="mt-4 pt-4 border-t border-border">
                            <h3 className="text-lg font-medium text-text mb-4">Personalización</h3>
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                                <div>
                                    <p className="font-medium text-text">Apariencia</p>
                                    <p className="text-sm text-muted">Alternar entre modo claro y oscuro</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Zona Horaria</label>
                            <div className="w-full px-4 py-2 rounded-lg border border-border bg-input text-text">
                                America/Lima (GMT-5) - Perú
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <button type="button" className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
}
