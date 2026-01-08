import { supabase } from '../../lib/supabase';

// Types
export interface Transaction {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
    user_id?: string;
}

export interface KpiData {
    clientes: number;
    facturas: number;
    inventario: number;
    ingresos: number;
    gastos: number;
    balance: number;
}

export interface CreateTransactionDto {
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
}

export interface UpdateKpiDto {
    kpiType: string;
    value: number;
    month?: number;
    year?: number;
}

// Get current user ID from localStorage (to filter by user)
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

// ============ TRANSACTIONS ============

export const getTransactions = async (): Promise<{ data: Transaction[], total: number }> => {
    const userId = getUserId();

    let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })
        .limit(100);

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }

    return {
        data: data || [],
        total: count || 0
    };
};

export const createTransaction = async (dto: CreateTransactionDto): Promise<Transaction> => {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('transactions')
        .insert({
            date: dto.date,
            type: dto.type,
            amount: dto.amount,
            description: dto.description,
            category: dto.category || 'General',
            user_id: userId,
            currency: 'PEN',
            provider: 'manual',
            status: 'COMPLETED'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }

    return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

// ============ KPIs ============

export const getKpis = async (): Promise<KpiData> => {
    const userId = getUserId();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // 1. Get manual KPIs (clientes, facturas, inventario)
    let kpiQuery = supabase
        .from('dashboard_kpis')
        .select('*')
        .eq('month', month)
        .eq('year', year);

    if (userId) {
        kpiQuery = kpiQuery.eq('user_id', userId);
    }

    const { data: kpiData, error: kpiError } = await kpiQuery;

    if (kpiError) {
        console.error('Error fetching KPIs:', kpiError);
    }

    // 2. Get financial data from transactions (ingresos, gastos)
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

    let txQuery = supabase
        .from('transactions')
        .select('type, amount')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

    if (userId) {
        txQuery = txQuery.eq('user_id', userId);
    }

    const { data: txData, error: txError } = await txQuery;

    if (txError) {
        console.error('Error fetching transactions for KPIs:', txError);
    }

    // Calculate ingresos and gastos from transactions
    let ingresos = 0;
    let gastos = 0;

    (txData || []).forEach(tx => {
        const amount = Number(tx.amount);
        if (tx.type === 'ingreso') {
            ingresos += amount;
        } else if (tx.type === 'gasto') {
            gastos += amount;
        }
    });

    // Build result from manual KPIs
    const result: KpiData = {
        clientes: 0,
        facturas: 0,
        inventario: 0,
        ingresos,
        gastos,
        balance: ingresos - gastos
    };

    // Apply manual KPIs
    (kpiData || []).forEach(kpi => {
        const key = kpi.kpi_type as keyof KpiData;
        if (key in result && key !== 'ingresos' && key !== 'gastos' && key !== 'balance') {
            result[key] = Number(kpi.value);
        }
    });

    return result;
};

export const updateKpi = async (dto: UpdateKpiDto): Promise<void> => {
    const userId = getUserId();
    const now = new Date();
    const month = dto.month ?? now.getMonth() + 1;
    const year = dto.year ?? now.getFullYear();

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Check if KPI exists
    const { data: existing } = await supabase
        .from('dashboard_kpis')
        .select('id')
        .eq('user_id', userId)
        .eq('kpi_type', dto.kpiType)
        .eq('month', month)
        .eq('year', year)
        .single();

    if (existing) {
        // Update existing
        const { error } = await supabase
            .from('dashboard_kpis')
            .update({
                value: dto.value,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

        if (error) {
            console.error('Error updating KPI:', error);
            throw error;
        }
    } else {
        // Insert new
        const { error } = await supabase
            .from('dashboard_kpis')
            .insert({
                user_id: userId,
                kpi_type: dto.kpiType,
                value: dto.value,
                month,
                year
            });

        if (error) {
            console.error('Error inserting KPI:', error);
            throw error;
        }
    }
};
