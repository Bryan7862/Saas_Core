import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface Invoice {
    id: string;
    number: string;
    type: 'Boleta' | 'Factura';
    client: string;
    date: string;
    amount: number;
    status: 'Emitido' | 'Aceptado' | 'Rechazado' | 'Anulado';
    xmlUrl?: string;
    pdfUrl?: string;
}

export interface SunatConfig {
    ruc: string;
    solUser: string;
    solPass: string;
    environment: 'Pruebas' | 'Producción';
    certificateStatus: 'Activo' | 'Expirado' | 'Vacio';
}

interface BillingContextType {
    invoices: Invoice[];
    sunatConfig: SunatConfig;
    updateSunatConfig: (config: SunatConfig) => void;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'status'>) => void;
    cancelInvoice: (id: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([
        { id: '1', number: 'F001-0001', type: 'Factura', client: 'Corporación Alpha', date: '2026-01-02', amount: 1540.50, status: 'Aceptado' },
        { id: '2', number: 'B001-0042', type: 'Boleta', client: 'Juan Perez', date: '2026-01-03', amount: 85.00, status: 'Aceptado' },
        { id: '3', number: 'F001-0002', type: 'Factura', client: 'Servicios Logísticos SAC', date: '2026-01-04', amount: 2400.00, status: 'Emitido' },
    ]);

    const [sunatConfig, setSunatConfig] = useState<SunatConfig>({
        ruc: '20601234567',
        solUser: 'MODDATOS',
        solPass: 'moddatos',
        environment: 'Pruebas',
        certificateStatus: 'Activo'
    });

    const updateSunatConfig = (config: SunatConfig) => {
        setSunatConfig(config);
        toast.success('Configuración SUNAT actualizada correctamente');
    };

    const addInvoice = (invoice: Omit<Invoice, 'id' | 'status'>) => {
        const newInvoice: Invoice = {
            ...invoice,
            id: Math.random().toString(36).substr(2, 9),
            status: 'Emitido'
        };
        setInvoices([newInvoice, ...invoices]);
        toast.success(`Comprobante ${newInvoice.number} generado`);
    };

    const cancelInvoice = (id: string) => {
        setInvoices(invoices.map(inv =>
            inv.id === id ? { ...inv, status: 'Anulado' } : inv
        ));
        toast.error('Comprobante anulado');
    };

    return (
        <BillingContext.Provider value={{
            invoices, sunatConfig, updateSunatConfig, addInvoice, cancelInvoice
        }}>
            {children}
        </BillingContext.Provider>
    );
};

export const useBilling = () => {
    const context = useContext(BillingContext);
    if (!context) throw new Error('useBilling must be used within BillingProvider');
    return context;
};
