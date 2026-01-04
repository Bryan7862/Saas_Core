import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: string;
    address?: string;
    notes?: string;
}

interface ClientsContextType {
    clients: Client[];
    addClient: (client: Omit<Client, 'id'>) => void;
    updateClient: (id: number, client: Partial<Client>) => void;
    deleteClient: (id: number) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([
        { id: 1, name: 'Empresa ABC S.A.C.', email: 'contacto@abc.pe', phone: '999123456', type: 'Corporativo', address: 'Av. Industrial 123, Lima' },
        { id: 2, name: 'Juan Pérez', email: 'juan.perez@gmail.com', phone: '987654321', type: 'Personal', address: 'Calle Los Alamos 456, Surco' },
        { id: 3, name: 'Innovaciones Tech', email: 'ventas@innotech.com', phone: '01 4567890', type: 'Corporativo', address: 'Parque Tecnológico 789, San Isidro' },
    ]);

    const addClient = (data: Omit<Client, 'id'>) => {
        const newClient = { ...data, id: Math.max(...clients.map(c => c.id), 0) + 1 };
        setClients([...clients, newClient]);
        toast.success('Cliente registrado exitosamente');
    };

    const updateClient = (id: number, data: Partial<Client>) => {
        setClients(clients.map(c => c.id === id ? { ...c, ...data } : c));
        toast.success('Cliente actualizado exitosamente');
    };

    const deleteClient = (id: number) => {
        setClients(clients.filter(c => c.id !== id));
        toast.success('Cliente eliminado');
    };

    return (
        <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient }}>
            {children}
        </ClientsContext.Provider>
    );
};

export const useClients = () => {
    const context = useContext(ClientsContext);
    if (!context) throw new Error('useClients must be used within ClientsProvider');
    return context;
};
