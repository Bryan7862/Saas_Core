import React, { useState } from 'react';
import { Save, ArrowLeft, Mail, Phone, MapPin, Building, User, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSuppliers } from '../context/SuppliersContext';

export const SupplierCreatePage = () => {
    const navigate = useNavigate();
    const { addSupplier } = useSuppliers();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        address: '',
        status: 'Activo' as 'Activo' | 'Inactivo'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulation
        setTimeout(() => {
            addSupplier(formData);
            setLoading(false);
            navigate('/suppliers');
        }, 800);
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
                <h1 className="text-2xl font-bold">Nuevo Proveedor</h1>
            </div>

            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Razón Social / Empresa</label>
                            <div className="relative">
                                <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="Ej: Distribuidora Norte SAC"
                                />
                            </div>
                        </div>

                        {/* Contact Person */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre del Contacto</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    required
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="Ej: Pedro Martínez"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Categoría de Suministro</label>
                            <div className="relative">
                                <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    required
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="Ej: Electrónica, Alimentos..."
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
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="proveedor@empresa.com"
                                />
                            </div>
                        </div>

                        {/* Telefono */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Teléfono / WhatsApp</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="+51 999 ..."
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Dirección de Almacén/Oficina</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    placeholder="Ej: Av. Las Begonias 123, San Isidro"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2 transition-all shadow-md active:scale-95"
                        >
                            <Save size={18} />
                            {loading ? 'Registrando...' : 'Registrar Proveedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
