import { supabase } from '../../lib/supabase';

// Types
export interface SalesTrend {
    name: string;
    monto: number;
    transacciones: number;
}

export interface CategorySale {
    name: string;
    value: number;
}

export interface TopProduct {
    name: string;
    sales: number;
    revenue: number;
    stock: number;
}

export interface FinanceData {
    month: string;
    ingresos: number;
    egresos: number;
    margen: number;
}

export interface ClientFrequency {
    id: string;
    name: string;
    purchases: number;
    volume: number;
    points: number;
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

// ============ SALES REPORT ============

export const getSalesTrend = async (months: number = 6): Promise<SalesTrend[]> => {
    const userId = getUserId();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    let query = supabase
        .from('transactions')
        .select('date, amount, type')
        .eq('type', 'ingreso')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching sales trend:', error);
        throw error;
    }

    // Aggregate by month
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData: Record<string, { monto: number; transacciones: number }> = {};

    (data || []).forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { monto: 0, transacciones: 0 };
        }
        monthlyData[monthKey].monto += t.amount || 0;
        monthlyData[monthKey].transacciones += 1;
    });

    // Convert to array and sort
    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
            const [, monthIdx] = key.split('-');
            return {
                name: monthNames[parseInt(monthIdx)],
                monto: value.monto,
                transacciones: value.transacciones
            };
        });
};

export const getCategorySales = async (): Promise<CategorySale[]> => {
    const userId = getUserId();

    let query = supabase
        .from('transactions')
        .select('category, amount')
        .eq('type', 'ingreso');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching category sales:', error);
        throw error;
    }

    // Aggregate by category
    const categoryData: Record<string, number> = {};
    let total = 0;

    (data || []).forEach(t => {
        const category = t.category || 'Otros';
        categoryData[category] = (categoryData[category] || 0) + (t.amount || 0);
        total += t.amount || 0;
    });

    // Convert to percentages
    return Object.entries(categoryData)
        .map(([name, value]) => ({
            name,
            value: total > 0 ? Math.round((value / total) * 100) : 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
};

export const getSalesKPIs = async (): Promise<{
    totalSales: number;
    transactions: number;
    avgTicket: number;
    salesChange: number;
    transactionsChange: number;
}> => {
    const userId = getUserId();
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // This month
    let thisMonthQuery = supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'ingreso')
        .gte('date', thisMonthStart.toISOString().split('T')[0]);

    if (userId) thisMonthQuery = thisMonthQuery.eq('user_id', userId);

    const { data: thisMonthData } = await thisMonthQuery;

    // Last month
    let lastMonthQuery = supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'ingreso')
        .gte('date', lastMonthStart.toISOString().split('T')[0])
        .lte('date', lastMonthEnd.toISOString().split('T')[0]);

    if (userId) lastMonthQuery = lastMonthQuery.eq('user_id', userId);

    const { data: lastMonthData } = await lastMonthQuery;

    const thisMonthTotal = (thisMonthData || []).reduce((acc, t) => acc + (t.amount || 0), 0);
    const thisMonthCount = (thisMonthData || []).length;
    const lastMonthTotal = (lastMonthData || []).reduce((acc, t) => acc + (t.amount || 0), 0);
    const lastMonthCount = (lastMonthData || []).length;

    return {
        totalSales: thisMonthTotal,
        transactions: thisMonthCount,
        avgTicket: thisMonthCount > 0 ? thisMonthTotal / thisMonthCount : 0,
        salesChange: lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0,
        transactionsChange: lastMonthCount > 0 ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0
    };
};

// ============ FINANCE REPORT ============

export const getFinanceData = async (months: number = 6): Promise<FinanceData[]> => {
    const userId = getUserId();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    let query = supabase
        .from('transactions')
        .select('date, amount, type')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching finance data:', error);
        throw error;
    }

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData: Record<string, { ingresos: number; egresos: number }> = {};

    (data || []).forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { ingresos: 0, egresos: 0 };
        }

        if (t.type === 'ingreso') {
            monthlyData[monthKey].ingresos += t.amount || 0;
        } else if (t.type === 'gasto') {
            monthlyData[monthKey].egresos += t.amount || 0;
        }
    });

    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
            const [, monthIdx] = key.split('-');
            return {
                month: monthNames[parseInt(monthIdx)],
                ingresos: value.ingresos,
                egresos: value.egresos,
                margen: value.ingresos - value.egresos
            };
        });
};

export const getFinanceKPIs = async (): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    incomeChange: number;
}> => {
    const userId = getUserId();
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // This month
    let thisMonthQuery = supabase
        .from('transactions')
        .select('amount, type')
        .gte('date', thisMonthStart.toISOString().split('T')[0]);

    if (userId) thisMonthQuery = thisMonthQuery.eq('user_id', userId);

    const { data: thisMonthData } = await thisMonthQuery;

    // Last month income
    let lastMonthQuery = supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'ingreso')
        .gte('date', lastMonthStart.toISOString().split('T')[0])
        .lte('date', lastMonthEnd.toISOString().split('T')[0]);

    if (userId) lastMonthQuery = lastMonthQuery.eq('user_id', userId);

    const { data: lastMonthData } = await lastMonthQuery;

    const thisMonthIncome = (thisMonthData || [])
        .filter(t => t.type === 'ingreso')
        .reduce((acc, t) => acc + (t.amount || 0), 0);

    const thisMonthExpenses = (thisMonthData || [])
        .filter(t => t.type === 'gasto')
        .reduce((acc, t) => acc + (t.amount || 0), 0);

    const lastMonthIncome = (lastMonthData || []).reduce((acc, t) => acc + (t.amount || 0), 0);

    const netProfit = thisMonthIncome - thisMonthExpenses;
    const profitMargin = thisMonthIncome > 0 ? (netProfit / thisMonthIncome) * 100 : 0;
    const incomeChange = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

    return {
        totalIncome: thisMonthIncome,
        totalExpenses: thisMonthExpenses,
        netProfit,
        profitMargin,
        incomeChange
    };
};

// ============ FREQUENT CLIENTS REPORT ============

export const getFrequentClients = async (): Promise<ClientFrequency[]> => {
    const userId = getUserId();

    // Get clients with their purchase counts
    let clientsQuery = supabase
        .from('clients')
        .select('id, name');

    if (userId) {
        clientsQuery = clientsQuery.eq('user_id', userId);
    }

    const { data: clients, error: clientsError } = await clientsQuery;

    if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        throw clientsError;
    }

    if (!clients || clients.length === 0) {
        return [];
    }

    // Get purchases for each client
    const clientIds = clients.map(c => c.id);

    const { data: purchases, error: purchasesError } = await supabase
        .from('client_purchases')
        .select('client_id, total')
        .in('client_id', clientIds);

    if (purchasesError) {
        console.error('Error fetching purchases:', purchasesError);
        // Return clients with zero purchases if purchases table doesn't exist
        return clients.map(c => ({
            id: c.id,
            name: c.name,
            purchases: 0,
            volume: 0,
            points: 0
        }));
    }

    // Aggregate purchases by client
    const purchaseData: Record<string, { count: number; volume: number }> = {};

    (purchases || []).forEach(p => {
        if (!purchaseData[p.client_id]) {
            purchaseData[p.client_id] = { count: 0, volume: 0 };
        }
        purchaseData[p.client_id].count += 1;
        purchaseData[p.client_id].volume += p.total || 0;
    });

    // Map and sort by volume
    return clients
        .map(c => ({
            id: c.id,
            name: c.name,
            purchases: purchaseData[c.id]?.count || 0,
            volume: purchaseData[c.id]?.volume || 0,
            points: Math.floor((purchaseData[c.id]?.volume || 0) / 10) // 1 point per S/10
        }))
        .sort((a, b) => b.volume - a.volume);
};
