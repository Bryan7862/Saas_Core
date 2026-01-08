import { supabase } from '../../lib/supabase';

// Types
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    sku?: string;
    stock?: number;
    is_active?: boolean;
}

export interface Transaction {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
    user_id?: string;
}

export interface CreateTransactionDto {
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    type?: string;
    limit?: number;
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

// ============ PRODUCTS ============

export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data || [];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('products')
        .insert({
            ...product,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw error;
    }

    return data;
};

// ============ SALES TRANSACTIONS ============

export const getSalesHistory = async (filters: TransactionFilters = {}): Promise<{ data: Transaction[], total: number }> => {
    const userId = getUserId();

    let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('type', 'ingreso')
        .order('date', { ascending: false })
        .limit(filters.limit || 50);

    if (userId) {
        query = query.eq('user_id', userId);
    }

    if (filters.startDate) {
        query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
        query = query.lte('date', filters.endDate);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching sales history:', error);
        throw error;
    }

    return {
        data: data || [],
        total: count || 0
    };
};

export const createSale = async (dto: CreateTransactionDto): Promise<Transaction> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('transactions')
        .insert({
            date: dto.date,
            type: 'ingreso',
            amount: dto.amount,
            description: dto.description,
            category: dto.category || 'Venta POS',
            user_id: userId,
            currency: 'PEN',
            provider: 'manual',
            status: 'COMPLETED'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating sale:', error);
        throw error;
    }

    return data;
};

// ============ RETURNS ============

export const getReturns = async (filters: TransactionFilters = {}): Promise<{ data: Transaction[], total: number }> => {
    const userId = getUserId();

    let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('type', 'REFUND')
        .order('date', { ascending: false })
        .limit(filters.limit || 50);

    if (userId) {
        query = query.eq('user_id', userId);
    }

    if (filters.startDate) {
        query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
        query = query.lte('date', filters.endDate);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching returns:', error);
        throw error;
    }

    return {
        data: data || [],
        total: count || 0
    };
};

export const createReturn = async (dto: CreateTransactionDto): Promise<Transaction> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('transactions')
        .insert({
            date: dto.date,
            type: 'REFUND',
            amount: dto.amount,
            description: dto.description,
            category: dto.category || 'Devolución',
            user_id: userId,
            currency: 'PEN',
            provider: 'manual',
            status: 'COMPLETED'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating return:', error);
        throw error;
    }

    return data;
};
