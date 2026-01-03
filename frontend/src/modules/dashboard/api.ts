import { api } from '../../lib/api';

export interface Transaction {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto';
    amount: number;
    description: string;
    category?: string;
    userId: string;
}

export interface CreateTransactionDto {
    date: string;
    type: 'ingreso' | 'gasto';
    amount: number;
    description: string;
    category?: string;
}

export interface KpiData {
    clientes: number;
    facturas: number;
    inventario: number;
}

export interface UpdateKpiDto {
    kpiType: string;
    value: number;
    month?: number;
    year?: number;
}

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    // Backend returns paginated response: { data: Transaction[], total: number }
    // We need to return just the array for the dashboard
    return response.data.data || [];
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
