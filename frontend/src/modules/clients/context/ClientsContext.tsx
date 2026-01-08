import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as clientsApi from '../supabaseApi';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    address?: string;
    notes?: string;
}

interface ClientsContextType {
    clients: Client[];
    loading: boolean;
    error: string | null;
    addClient: (client: Omit<Client, 'id'>) => Promise<void>;
    updateClient: (id: string, client: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    refreshClients: () => Promise<void>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await clientsApi.getClients();
            setClients(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar clientes';
            setError(message);
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const addClient = async (data: Omit<Client, 'id'>) => {
        try {
            const newClient = await clientsApi.createClient(data);
            setClients(prev => [...prev, newClient]);
            toast.success('Cliente registrado exitosamente');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al crear cliente';
            toast.error(message);
            throw err;
        }
    };

    const updateClient = async (id: string, data: Partial<Client>) => {
        try {
            const updated = await clientsApi.updateClient(id, data);
            setClients(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
            toast.success('Cliente actualizado exitosamente');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al actualizar cliente';
            toast.error(message);
            throw err;
        }
    };

    const deleteClient = async (id: string) => {
        try {
            await clientsApi.deleteClient(id);
            setClients(prev => prev.filter(c => c.id !== id));
            toast.success('Cliente eliminado');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al eliminar cliente';
            toast.error(message);
            throw err;
        }
    };

    return (
        <ClientsContext.Provider value={{
            clients,
            loading,
            error,
            addClient,
            updateClient,
            deleteClient,
            refreshClients: fetchClients
        }}>
            {children}
        </ClientsContext.Provider>
    );
};

export const useClients = () => {
    const context = useContext(ClientsContext);
    if (!context) throw new Error('useClients must be used within ClientsProvider');
    return context;
};
