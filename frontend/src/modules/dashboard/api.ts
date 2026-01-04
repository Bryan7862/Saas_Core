import { api } from '../../lib/api';

export interface Transaction {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
    userId: string;
}

export interface CreateTransactionDto {
    date: string;
    type: 'ingreso' | 'gasto' | 'REFUND';
    amount: number;
    description: string;
    category?: string;
}

export interface KpiData {
    clientes: number;
    facturas: number;
    inventario: number;
    ingresos: number;
    gastos: number;
    balance: number;
}

export interface UpdateKpiDto {
    kpiType: string;
    value: number;
    month?: number;
    year?: number;
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
}

export const getTransactions = async (filters: TransactionFilters = {}): Promise<{ data: Transaction[], total: number }> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data; // Backend returns { data: [], total: number }
};


export const createTransaction = async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
};

// KPI API functions
export const getKpis = async (): Promise<KpiData> => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
};

export const updateKpi = async (data: UpdateKpiDto): Promise<void> => {
    await api.post('/dashboard/kpis', data);
};
