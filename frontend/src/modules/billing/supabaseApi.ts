import { supabase } from '../../lib/supabase';

// Types
export interface Invoice {
    id: string;
    user_id?: string;
    number: string;
    type: 'Boleta' | 'Factura';
    client: string;
    date: string;
    amount: number;
    status: 'Emitido' | 'Aceptado' | 'Rechazado' | 'Anulado';
    xml_url?: string;
    pdf_url?: string;
    created_at?: string;
}

export interface SunatConfig {
    id?: string;
    user_id?: string;
    ruc: string;
    sol_user: string;
    sol_pass: string;
    environment: 'Pruebas' | 'Producción';
    certificate_status: 'Activo' | 'Expirado' | 'Vacio';
    certificate_expiry?: string;
    updated_at?: string;
}

export interface BillingHistoryLog {
    id: string;
    user_id?: string;
    event: string;
    date: string;
    status: 'Exitoso' | 'Pendiente' | 'Error';
    detail: string;
    created_at?: string;
}

export interface CreateInvoiceDto {
    number: string;
    type: 'Boleta' | 'Factura';
    client: string;
    date: string;
    amount: number;
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

// ============ INVOICES ============

export const getInvoices = async (): Promise<Invoice[]> => {
    const userId = getUserId();

    let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
    }

    return (data || []).map(inv => ({
        id: inv.id,
        user_id: inv.user_id,
        number: inv.number,
        type: inv.type,
        client: inv.client,
        date: inv.date,
        amount: inv.amount,
        status: inv.status,
        xml_url: inv.xml_url,
        pdf_url: inv.pdf_url,
        created_at: inv.created_at
    }));
};

export const createInvoice = async (data: CreateInvoiceDto): Promise<Invoice> => {
    const userId = getUserId();

    const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
            user_id: userId,
            number: data.number,
            type: data.type,
            client: data.client,
            date: data.date,
            amount: data.amount,
            status: 'Emitido'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating invoice:', error);
        throw error;
    }

    // Log the event
    await addBillingHistoryLog({
        event: `Emisión de ${data.type} ${data.number}`,
        status: 'Exitoso',
        detail: 'Comprobante generado correctamente'
    });

    return invoice;
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
    const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating invoice:', error);
        throw error;
    }

    return data;
};

export const cancelInvoice = async (id: string, invoiceNumber: string): Promise<Invoice> => {
    const result = await updateInvoice(id, { status: 'Anulado' });

    // Log the cancellation
    await addBillingHistoryLog({
        event: `Anulación de comprobante ${invoiceNumber}`,
        status: 'Exitoso',
        detail: 'Comunicación de baja registrada'
    });

    return result;
};

// ============ SUNAT CONFIG ============

export const getSunatConfig = async (): Promise<SunatConfig | null> => {
    const userId = getUserId();

    let query = supabase
        .from('sunat_config')
        .select('*');

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
        console.error('Error fetching SUNAT config:', error);
        throw error;
    }

    if (!data) return null;

    return {
        id: data.id,
        user_id: data.user_id,
        ruc: data.ruc,
        sol_user: data.sol_user,
        sol_pass: data.sol_pass,
        environment: data.environment,
        certificate_status: data.certificate_status || 'Vacio',
        certificate_expiry: data.certificate_expiry,
        updated_at: data.updated_at
    };
};

export const upsertSunatConfig = async (config: Omit<SunatConfig, 'id' | 'user_id' | 'updated_at'>): Promise<SunatConfig> => {
    const userId = getUserId();

    // Check if config exists
    const existing = await getSunatConfig();

    let result;
    if (existing?.id) {
        // Update existing
        const { data, error } = await supabase
            .from('sunat_config')
            .update({
                ruc: config.ruc,
                sol_user: config.sol_user,
                sol_pass: config.sol_pass,
                environment: config.environment,
                certificate_status: config.certificate_status,
                certificate_expiry: config.certificate_expiry,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw error;
        result = data;

        // Log update
        await addBillingHistoryLog({
            event: 'Actualización de Configuración SUNAT',
            status: 'Exitoso',
            detail: `Ambiente: ${config.environment}`
        });
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('sunat_config')
            .insert({
                user_id: userId,
                ruc: config.ruc,
                sol_user: config.sol_user,
                sol_pass: config.sol_pass,
                environment: config.environment,
                certificate_status: config.certificate_status || 'Vacio',
                certificate_expiry: config.certificate_expiry
            })
            .select()
            .single();

        if (error) throw error;
        result = data;

        // Log creation
        await addBillingHistoryLog({
            event: 'Configuración SUNAT inicial',
            status: 'Exitoso',
            detail: 'Credenciales SOL configuradas'
        });
    }

    return result;
};

// ============ BILLING HISTORY ============

export const getBillingHistory = async (limit: number = 50): Promise<BillingHistoryLog[]> => {
    const userId = getUserId();

    let query = supabase
        .from('billing_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching billing history:', error);
        throw error;
    }

    return (data || []).map(log => ({
        id: log.id,
        user_id: log.user_id,
        event: log.event,
        date: log.date || log.created_at,
        status: log.status,
        detail: log.detail,
        created_at: log.created_at
    }));
};

export const addBillingHistoryLog = async (log: {
    event: string;
    status: 'Exitoso' | 'Pendiente' | 'Error';
    detail: string;
}): Promise<BillingHistoryLog> => {
    const userId = getUserId();
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const { data, error } = await supabase
        .from('billing_history')
        .insert({
            user_id: userId,
            event: log.event,
            date: dateStr,
            status: log.status,
            detail: log.detail
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding billing history log:', error);
        // Don't throw - history logging is secondary
        return {
            id: '',
            event: log.event,
            date: dateStr,
            status: log.status,
            detail: log.detail
        };
    }

    return data;
};
