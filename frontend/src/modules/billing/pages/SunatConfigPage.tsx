import { useState, useEffect, useRef } from 'react';
import { Shield, Key, Globe, FileCheck, Save, AlertCircle, CheckCircle2, Loader2, RotateCcw, Upload, AlertTriangle, X } from 'lucide-react';
import { useBilling, SunatConfig } from '../context/BillingContext';
import toast from 'react-hot-toast';

export const SunatConfigPage = () => {
    const { sunatConfig, updateSunatConfig, loading, error } = useBilling();
    const [formData, setFormData] = useState<SunatConfig>(sunatConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync form data when context loads
    useEffect(() => {
        setFormData(sunatConfig);
    }, [sunatConfig]);

    // Track changes
    useEffect(() => {
        const changed =
            formData.ruc !== sunatConfig.ruc ||
            formData.solUser !== sunatConfig.solUser ||
            formData.solPass !== sunatConfig.solPass ||
            formData.environment !== sunatConfig.environment ||
            certificateFile !== null;
        setHasChanges(changed);
    }, [formData, sunatConfig, certificateFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.ruc || !formData.solUser || !formData.solPass) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }

        setIsSaving(true);
        try {
            // If certificate was uploaded, mark it as active
            const configToSave = {
                ...formData,
                certificateStatus: certificateFile ? 'Activo' as const : formData.certificateStatus
            };
            await updateSunatConfig(configToSave);
            setCertificateFile(null);
            setHasChanges(false);
        } catch (err) {
            console.error('Error saving SUNAT config:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setFormData(sunatConfig);
        setCertificateFile(null);
        setHasChanges(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith('.pfx') && !file.name.endsWith('.p12')) {
                toast.error('El archivo debe ser .pfx o .p12');
                return;
            }
            setCertificateFile(file);
            toast.success(`Certificado "${file.name}" seleccionado`);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const getCertificateStatusColor = () => {
        if (certificateFile) return 'text-blue-500';
        switch (formData.certificateStatus) {
            case 'Activo': return 'text-emerald-500';
            case 'Expirado': return 'text-rose-500';
            default: return 'text-amber-500';
        }
    };

    const getCertificateStatusText = () => {
        if (certificateFile) return 'Pendiente de guardar';
        switch (formData.certificateStatus) {
            case 'Activo': return 'Activo';
            case 'Expirado': return 'Expirado';
            default: return 'No configurado';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <span className="ml-2 text-[var(--muted)]">Cargando configuración...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const isConfigured = formData.ruc && formData.solUser && formData.solPass;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold">Configuración SUNAT</h1>
                <p className="text-[var(--muted)]">Configura tus credenciales de Facturación Electrónica</p>
            </div>

            {/* Status Cards - Show current saved state */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe size={18} className="text-blue-500" />
                        <span className="text-sm font-medium">Ambiente</span>
                    </div>
                    <p className={`text-lg font-bold ${sunatConfig.environment === 'Producción' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {sunatConfig.environment || 'Pruebas'}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] mt-1">
                        {sunatConfig.environment === 'Producción' ? 'Comprobantes válidos' : 'Solo pruebas'}
                    </p>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <FileCheck size={18} className={getCertificateStatusColor()} />
                        <span className="text-sm font-medium">Certificado Digital</span>
                    </div>
                    <p className={`text-lg font-bold ${getCertificateStatusColor()}`}>
                        {getCertificateStatusText()}
                    </p>
                </div>
                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={18} className="text-purple-500" />
                        <span className="text-sm font-medium">RUC</span>
                    </div>
                    <p className={`text-lg font-bold font-mono ${sunatConfig.ruc ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {sunatConfig.ruc || 'Sin configurar'}
                    </p>
                </div>
            </div>

            {!isConfigured && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex gap-3">
                    <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                    <div>
                        <p className="font-bold text-amber-700 dark:text-amber-400">Configuración incompleta</p>
                        <p className="text-sm text-amber-600 dark:text-amber-500">
                            Completa todos los campos del formulario y haz clic en "Guardar Cambios" para habilitar la emisión de comprobantes.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)] flex items-center gap-2">
                        <Key size={20} className="text-[var(--primary)]" />
                        <h3 className="text-lg font-bold">Credenciales SOL</h3>
                        <span className="text-xs text-rose-500 ml-1">* Obligatorio</span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                                    Número de RUC <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ruc}
                                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value.replace(/\D/g, '') })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none font-mono text-lg"
                                    placeholder="20XXXXXXXXX"
                                    maxLength={11}
                                    required
                                />
                                <p className="text-[10px] text-[var(--muted)] mt-1">11 dígitos sin guiones ni espacios</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                                    Entorno de Emisión
                                </label>
                                <select
                                    value={formData.environment}
                                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as 'Pruebas' | 'Producción' })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                >
                                    <option value="Pruebas">Beta / Pruebas (SUNAT)</option>
                                    <option value="Producción">Producción (En vivo)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                                    Usuario SOL <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.solUser}
                                    onChange={(e) => setFormData({ ...formData, solUser: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none uppercase"
                                    placeholder="USUARIO123"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted)] mb-1">
                                    Contraseña SOL <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.solPass}
                                    onChange={(e) => setFormData({ ...formData, solPass: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="********"
                                    required
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pfx,.p12"
                            className="hidden"
                        />

                        {certificateFile ? (
                            <div className="border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                            <FileCheck size={20} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{certificateFile.name}</p>
                                            <p className="text-xs text-[var(--muted)]">
                                                {(certificateFile.size / 1024).toFixed(1)} KB - Pendiente de guardar
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCertificateFile(null)}
                                        className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors text-[var(--muted)] hover:text-rose-500"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : formData.certificateStatus === 'Activo' ? (
                            <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-8 text-center bg-emerald-50/50 dark:bg-emerald-900/10">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                </div>
                                <h4 className="font-bold">Certificado Digital Activo</h4>
                                <p className="text-sm text-[var(--muted)] mb-4">Tu certificado está configurado correctamente</p>
                                <button
                                    type="button"
                                    onClick={handleUploadClick}
                                    className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                                >
                                    <Upload size={12} />
                                    REEMPLAZAR CERTIFICADO
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={handleUploadClick}
                                className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--primary)] transition-colors cursor-pointer group"
                            >
                                <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <Upload size={24} className="text-[var(--muted)] group-hover:text-[var(--primary)]" />
                                </div>
                                <h4 className="font-bold">Subir Certificado Digital</h4>
                                <p className="text-sm text-[var(--muted)] mb-4">
                                    Arrastra o haz clic para subir tu archivo .pfx o .p12
                                </p>
                                <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-bold inline-flex items-center gap-2">
                                    <Upload size={16} />
                                    Seleccionar Archivo
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    {hasChanges && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                            <AlertTriangle size={14} />
                            Tienes cambios sin guardar
                        </p>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="px-6 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            Restablecer
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !hasChanges}
                            className="px-8 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
