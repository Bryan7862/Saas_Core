import { supabase } from '../../lib/supabase';

// ============ TYPES ============

export interface Product {
    id: string;
    name: string;
    category: string;
    stock: number;
    min_stock: number;
    price: number;
    status: 'Active' | 'Low Stock' | 'Out of Stock';
    user_id?: string;
    created_at?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    user_id?: string;
    created_at?: string;
}

export interface Adjustment {
    id: string;
    date: string;
    product_id: string;
    product_name: string;
    type: 'increase' | 'decrease';
    quantity: number;
    reason: string;
    user_name: string;
    user_id?: string;
    created_at?: string;
}

export interface CreateProductDto {
    name: string;
    category: string;
    stock: number;
    min_stock: number;
    price: number;
}

export interface CreateCategoryDto {
    name: string;
    description: string;
}

export interface CreateAdjustmentDto {
    product_id: string;
    product_name: string;
    type: 'increase' | 'decrease';
    quantity: number;
    reason: string;
    user_name: string;
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

// Calculate status based on stock levels
const calculateStatus = (stock: number, minStock: number): Product['status'] => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'Active';
};

// ============ PRODUCTS ============

export const getProducts = async (): Promise<Product[]> => {
    const userId = getUserId();

    let query = supabase
        .from('inventory_products')
        .select('*')
        .order('name');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return (data || []).map(p => ({
        ...p,
        status: calculateStatus(p.stock, p.min_stock)
    }));
};

export const createProduct = async (dto: CreateProductDto): Promise<Product> => {
    const userId = getUserId();
    const status = calculateStatus(dto.stock, dto.min_stock);

    const { data, error } = await supabase
        .from('inventory_products')
        .insert({
            name: dto.name,
            category: dto.category,
            stock: dto.stock,
            min_stock: dto.min_stock,
            price: dto.price,
            status,
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

export const updateProduct = async (id: string, dto: Partial<CreateProductDto>): Promise<Product> => {
    // Get current product to calculate new status
    const { data: current } = await supabase
        .from('inventory_products')
        .select('stock, min_stock')
        .eq('id', id)
        .single();

    const newStock = dto.stock ?? current?.stock ?? 0;
    const newMinStock = dto.min_stock ?? current?.min_stock ?? 0;
    const status = calculateStatus(newStock, newMinStock);

    const { data, error } = await supabase
        .from('inventory_products')
        .update({ ...dto, status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        throw error;
    }

    return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('inventory_products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// ============ CATEGORIES ============

export const getCategories = async (): Promise<Category[]> => {
    const userId = getUserId();

    let query = supabase
        .from('inventory_categories')
        .select('*')
        .order('name');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }

    return data || [];
};

export const createCategory = async (dto: CreateCategoryDto): Promise<Category> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('inventory_categories')
        .insert({
            name: dto.name,
            description: dto.description,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating category:', error);
        throw error;
    }

    return data;
};

export const updateCategory = async (id: string, dto: Partial<CreateCategoryDto>): Promise<Category> => {
    const { data, error } = await supabase
        .from('inventory_categories')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating category:', error);
        throw error;
    }

    return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('inventory_categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

// ============ ADJUSTMENTS ============

export const getAdjustments = async (): Promise<Adjustment[]> => {
    const userId = getUserId();

    let query = supabase
        .from('inventory_adjustments')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching adjustments:', error);
        throw error;
    }

    return data || [];
};

export const createAdjustment = async (dto: CreateAdjustmentDto): Promise<Adjustment> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('inventory_adjustments')
        .insert({
            product_id: dto.product_id,
            product_name: dto.product_name,
            type: dto.type,
            quantity: dto.quantity,
            reason: dto.reason,
            user_name: dto.user_name,
            date: new Date().toISOString().split('T')[0],
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating adjustment:', error);
        throw error;
    }

    return data;
};

// ============ COMBINED OPERATIONS ============

export const adjustStock = async (
    productId: string,
    productName: string,
    type: 'increase' | 'decrease',
    quantity: number,
    reason: string,
    userName: string
): Promise<void> => {
    // 1. Get current stock
    const { data: product, error: fetchError } = await supabase
        .from('inventory_products')
        .select('stock, min_stock')
        .eq('id', productId)
        .single();

    if (fetchError || !product) {
        throw new Error('Product not found');
    }

    // 2. Calculate new stock
    const newStock = type === 'increase'
        ? product.stock + quantity
        : Math.max(0, product.stock - quantity);

    // 3. Update product stock
    await updateProduct(productId, { stock: newStock });

    // 4. Create adjustment record
    await createAdjustment({
        product_id: productId,
        product_name: productName,
        type,
        quantity,
        reason,
        user_name: userName
    });
};
