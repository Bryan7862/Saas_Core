import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import * as api from '../supabaseApi';

// Re-export types with UI-friendly property names
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
    loading: boolean;
    error: string | null;
    updateSunatConfig: (config: SunatConfig) => Promise<void>;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'status'>) => Promise<void>;
    cancelInvoice: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const defaultSunatConfig: SunatConfig = {
    ruc: '',
    solUser: '',
    solPass: '',
    environment: 'Pruebas',
    certificateStatus: 'Vacio'
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [sunatConfig, setSunatConfig] = useState<SunatConfig>(defaultSunatConfig);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load data from Supabase on mount
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [invoicesData, configData] = await Promise.all([
                api.getInvoices().catch(() => []),
                api.getSunatConfig().catch(() => null)
            ]);

            // Map API data to UI format
            setInvoices(invoicesData.map(inv => ({
                id: inv.id,
                number: inv.number,
                type: inv.type,
                client: inv.client,
                date: inv.date,
                amount: inv.amount,
                status: inv.status,
                xmlUrl: inv.xml_url,
                pdfUrl: inv.pdf_url
            })));

            if (configData) {
                setSunatConfig({
                    ruc: configData.ruc,
                    solUser: configData.sol_user,
                    solPass: configData.sol_pass,
                    environment: configData.environment,
                    certificateStatus: configData.certificate_status
                });
            }
        } catch (err) {
            console.error('Error loading billing data:', err);
            setError('Error al cargar datos de facturación');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = async () => {
        await loadData();
    };

    const updateSunatConfig = async (config: SunatConfig) => {
        try {
            await api.upsertSunatConfig({
                ruc: config.ruc,
                sol_user: config.solUser,
                sol_pass: config.solPass,
                environment: config.environment,
                certificate_status: config.certificateStatus
            });
            setSunatConfig(config);
            toast.success('Configuración SUNAT actualizada correctamente');
        } catch (err) {
            console.error('Error updating SUNAT config:', err);
            toast.error('Error al actualizar configuración SUNAT');
            throw err;
        }
    };

    const addInvoice = async (invoice: Omit<Invoice, 'id' | 'status'>) => {
        try {
            const newInvoice = await api.createInvoice({
                number: invoice.number,
                type: invoice.type,
                client: invoice.client,
                date: invoice.date,
                amount: invoice.amount
            });

            setInvoices(prev => [{
                id: newInvoice.id,
                number: newInvoice.number,
                type: newInvoice.type,
                client: newInvoice.client,
                date: newInvoice.date,
                amount: newInvoice.amount,
                status: newInvoice.status,
                xmlUrl: newInvoice.xml_url,
                pdfUrl: newInvoice.pdf_url
            }, ...prev]);

            toast.success(`Comprobante ${invoice.number} generado`);
        } catch (err) {
            console.error('Error creating invoice:', err);
            toast.error('Error al generar comprobante');
            throw err;
        }
    };

    const cancelInvoice = async (id: string) => {
        try {
            const invoice = invoices.find(inv => inv.id === id);
            if (!invoice) {
                toast.error('Comprobante no encontrado');
                return;
            }

            await api.cancelInvoice(id, invoice.number);

            setInvoices(prev => prev.map(inv =>
                inv.id === id ? { ...inv, status: 'Anulado' } : inv
            ));

            toast.error('Comprobante anulado');
        } catch (err) {
            console.error('Error canceling invoice:', err);
            toast.error('Error al anular comprobante');
            throw err;
        }
    };

    return (
        <BillingContext.Provider value={{
            invoices, sunatConfig, loading, error,
            updateSunatConfig, addInvoice, cancelInvoice, refreshData
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
