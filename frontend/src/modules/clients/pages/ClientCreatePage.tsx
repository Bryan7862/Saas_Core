import React, { useState } from 'react';
import { Save, ArrowLeft, Mail, Phone, MapPin, Building, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useClients } from '../context/ClientsContext';

export const ClientCreatePage = () => {
    const navigate = useNavigate();
    const { addClient } = useClients();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        type: 'Personal'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        setLoading(true);

        try {
            await addClient(formData);
            navigate('/clients');
        } catch {
            // Error handled by context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-[var(--bg-soft)] rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
            </div>

            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Concepto / Nombre */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre Completo o Razón Social</label>
                            <div className="relative">
                                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="Ej: Juan Pérez / Empresa SAC"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>

                        {/* Telefono */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Teléfono</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="+51 999 999 999"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tipo de Cliente</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Corporativo">Corporativo</option>
                            </select>
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Dirección Fiscal</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="Av. Principal 123, Lima"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Notas Adicionales</label>
                            <textarea
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)]"
                                placeholder="Detalles extra..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Cliente
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
