import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as suppliersApi from '../supabaseApi';

export interface Supplier {
    id: string;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    category: string;
    status: 'Activo' | 'Inactivo';
    address?: string;
}

interface SuppliersContextType {
    suppliers: Supplier[];
    loading: boolean;
    error: string | null;
    addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;
    refreshSuppliers: () => Promise<void>;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

// Helper to map database fields to frontend fields
const mapDbToFrontend = (dbSupplier: suppliersApi.Supplier): Supplier => ({
    id: dbSupplier.id,
    name: dbSupplier.name,
    contactName: dbSupplier.contact_name,
    email: dbSupplier.email,
    phone: dbSupplier.phone,
    category: dbSupplier.category,
    status: dbSupplier.status,
    address: dbSupplier.address
});

export const SuppliersProvider = ({ children }: { children: ReactNode }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await suppliersApi.getSuppliers();
            setSuppliers(data.map(mapDbToFrontend));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar proveedores';
            setError(message);
            console.error('Error fetching suppliers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const addSupplier = async (data: Omit<Supplier, 'id'>) => {
        try {
            const newSupplier = await suppliersApi.createSupplier(data);
            setSuppliers(prev => [...prev, mapDbToFrontend(newSupplier)]);
            toast.success('Proveedor registrado correctamente');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear proveedor';
            toast.error(message);
            throw err;
        }
    };

    const updateSupplier = async (id: string, data: Partial<Supplier>) => {
        try {
            const updated = await suppliersApi.updateSupplier(id, data);
            setSuppliers(prev => prev.map(s => s.id === id ? mapDbToFrontend(updated) : s));
            toast.success('Proveedor actualizado correctamente');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al actualizar proveedor';
            toast.error(message);
            throw err;
        }
    };

    const deleteSupplier = async (id: string) => {
        try {
            await suppliersApi.deleteSupplier(id);
            setSuppliers(prev => prev.filter(s => s.id !== id));
            toast.success('Proveedor eliminado');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al eliminar proveedor';
            toast.error(message);
            throw err;
        }
    };

    return (
        <SuppliersContext.Provider value={{
            suppliers,
            loading,
            error,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            refreshSuppliers: fetchSuppliers
        }}>
            {children}
        </SuppliersContext.Provider>
    );
};

export const useSuppliers = () => {
    const context = useContext(SuppliersContext);
    if (!context) throw new Error('useSuppliers debe usarse dentro de SuppliersProvider');
    return context;
};
