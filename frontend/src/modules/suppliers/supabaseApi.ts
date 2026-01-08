import { supabase } from '../../lib/supabase';

// Types
export interface Supplier {
    id: string;
    name: string;
    contact_name: string;
    email: string;
    phone: string;
    category: string;
    status: 'Activo' | 'Inactivo';
    address?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateSupplierDto {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    category: string;
    status: 'Activo' | 'Inactivo';
    address?: string;
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

// ============ SUPPLIERS ============

export const getSuppliers = async (): Promise<Supplier[]> => {
    const userId = getUserId();

    let query = supabase
        .from('suppliers')
        .select('*')
        .order('name');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }

    return data || [];
};

export const createSupplier = async (supplier: CreateSupplierDto): Promise<Supplier> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('suppliers')
        .insert({
            name: supplier.name,
            contact_name: supplier.contactName,
            email: supplier.email,
            phone: supplier.phone,
            category: supplier.category,
            status: supplier.status,
            address: supplier.address,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }

    return data;
};

export const updateSupplier = async (id: string, updates: Partial<CreateSupplierDto>): Promise<Supplier> => {
    const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.contactName !== undefined) updateData.contact_name = updates.contactName;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.address !== undefined) updateData.address = updates.address;

    const { data, error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating supplier:', error);
        throw error;
    }

    return data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting supplier:', error);
        throw error;
    }
};
