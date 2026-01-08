import { supabase } from '../../lib/supabase';

// Types
export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    address?: string;
    notes?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClientPurchase {
    id: string;
    client_id: string;
    date: string;
    items: string;
    total: number;
    status: string;
    user_id?: string;
    created_at?: string;
}

export interface CreateClientDto {
    name: string;
    email: string;
    phone: string;
    type: string;
    address?: string;
    notes?: string;
}

// Get current user ID from localStorage
const getUserId = (): string | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || null;
    } catch {
        return null;
    }
};

// ============ CLIENTS ============

export const getClients = async (): Promise<Client[]> => {
    const userId = getUserId();

    let query = supabase
        .from('clients')
        .select('*')
        .order('name');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }

    return data || [];
};

export const createClient = async (client: CreateClientDto): Promise<Client> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('clients')
        .insert({
            ...client,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating client:', error);
        throw error;
    }

    return data;
};

export const updateClient = async (id: string, updates: Partial<CreateClientDto>): Promise<Client> => {
    const { data, error } = await supabase
        .from('clients')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating client:', error);
        throw error;
    }

    return data;
};

export const deleteClient = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
};

// ============ CLIENT PURCHASES ============

export const getClientPurchases = async (clientId: string): Promise<ClientPurchase[]> => {
    const { data, error } = await supabase
        .from('client_purchases')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching client purchases:', error);
        throw error;
    }

    return data || [];
};

// ============ TABLE VERIFICATION ============

export const verifyTablesExist = async (): Promise<{ clients: boolean; purchases: boolean }> => {
    let clientsExist = false;
    let purchasesExist = false;

    try {
        const { error: clientsError } = await supabase
            .from('clients')
            .select('id')
            .limit(1);
        clientsExist = !clientsError;
    } catch {
        clientsExist = false;
    }

    try {
        const { error: purchasesError } = await supabase
            .from('client_purchases')
            .select('id')
            .limit(1);
        purchasesExist = !purchasesError;
    } catch {
        purchasesExist = false;
    }

    return { clients: clientsExist, purchases: purchasesExist };
};
