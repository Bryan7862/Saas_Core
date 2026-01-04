import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface Supplier {
    id: number;
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
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: number, supplier: Partial<Supplier>) => void;
    deleteSupplier: (id: number) => void;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider = ({ children }: { children: ReactNode }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        { id: 1, name: 'TecnoDistribuidora S.A.', contactName: 'Carlos Ruiz', email: 'ventas@tecnodist.com', phone: '988123456', category: 'Hardware', status: 'Activo', address: 'Av. Wilson 456, Lima' },
        { id: 2, name: 'Suministros Office Pro', contactName: 'Ana Smith', email: 'anasmith@officepro.pe', phone: '977654321', category: 'Oficina', status: 'Activo', address: 'Calle Las Orquideas 123, San Isidro' },
        { id: 3, name: 'Global Logistics Peru', contactName: 'Roberto Gomez', email: 'rgomez@globallogistics.com', phone: '01 5554433', category: 'Logística', status: 'Inactivo', address: 'Puerto del Callao Muelle 5' },
    ]);

    const addSupplier = (data: Omit<Supplier, 'id'>) => {
        const newSupplier = { ...data, id: Math.max(...suppliers.map(s => s.id), 0) + 1 };
        setSuppliers([...suppliers, newSupplier]);
        toast.success('Proveedor registrado correctamente');
    };

    const updateSupplier = (id: number, data: Partial<Supplier>) => {
        setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...data } : s));
        toast.success('Proveedor actualizado correctamente');
    };

    const deleteSupplier = (id: number) => {
        setSuppliers(suppliers.filter(s => s.id !== id));
        toast.success('Proveedor eliminado');
    };

    return (
        <SuppliersContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
            {children}
        </SuppliersContext.Provider>
    );
};

export const useSuppliers = () => {
    const context = useContext(SuppliersContext);
    if (!context) throw new Error('useSuppliers debe usarse dentro de SuppliersProvider');
    return context;
};
