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

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    return response.data;
};

export const createTransaction = async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
};
