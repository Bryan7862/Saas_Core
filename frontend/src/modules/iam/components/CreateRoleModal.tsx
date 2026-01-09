import React, { useState } from 'react';
import { createRole } from '../api';

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoleCreated: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ isOpen, onClose, onRoleCreated }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createRole({
                code,
                name,
                description,
            });
            onRoleCreated();
            onClose();
            // Reset form
            setCode('');
            setName('');
            setDescription('');
        } catch (err: any) {
            console.error('Failed to create role', err);
            setError(err.response?.data?.message || 'Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center
            items-center z-50">
            <div className="bg-[var(--card-bg)] p-8
                rounded-lg w-full max-w-md shadow-xl border border-[var(--border)]">
                <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Crear Nuevo Rol</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Código (Identificador de Sistema)</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Ej. GERENTE"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        />
                        <p className="text-xs text-[var(--muted)] mt-1">Mayúsculas, sin espacios.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Nombre Visible</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Gerente de Proyectos"
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--muted)] mb-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[var(--text)] hover:bg-[var(--bg-primary)] rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Rol'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
