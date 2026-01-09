import { supabase } from '../../lib/supabase';

// ============== GENERAL SETTINGS ==============

export interface GeneralSettings {
    id?: string;
    org_id: string;
    business_name: string;
    legal_name: string;
    ruc: string;
    phone: string;
    address: string;
    language: string;
    timezone: string;
    currency: string;
    tax_rate: number;
    logo_url?: string;
}

export const getGeneralSettings = async (orgId: string): Promise<GeneralSettings | null> => {
    const { data, error } = await supabase
        .from('general_settings')
        .select('*')
        .eq('org_id', orgId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching general settings:', error);
        throw error;
    }

    return data;
};

export const saveGeneralSettings = async (orgId: string, settings: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    // Check if settings exist
    const existing = await getGeneralSettings(orgId);

    if (existing) {
        // Update
        const { data, error } = await supabase
            .from('general_settings')
            .update({ ...settings, updated_at: new Date().toISOString() })
            .eq('org_id', orgId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } else {
        // Insert
        const { data, error } = await supabase
            .from('general_settings')
            .insert({ ...settings, org_id: orgId })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

// Upload logo to Supabase Storage
export const uploadLogo = async (orgId: string, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orgId}/logo.${fileExt}`;

    // Upload to storage bucket 'logos'
    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

    return data.publicUrl;
};

// ============== PAYMENT METHODS ==============

export interface PaymentMethod {
    id?: string;
    org_id: string;
    name: string;
    icon: string;
    enabled: boolean;
    description: string;
    extra?: string;
    commission: number;
    color: string;
    display_order: number;
}

export const getPaymentMethods = async (orgId: string): Promise<PaymentMethod[]> => {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('org_id', orgId)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }

    return data || [];
};

export const createDefaultPaymentMethods = async (orgId: string): Promise<PaymentMethod[]> => {
    const defaults: Omit<PaymentMethod, 'id'>[] = [
        { org_id: orgId, name: 'Efectivo', icon: 'Banknote', enabled: true, description: 'Pagos directamente en caja (Soles)', color: 'text-emerald-500', commission: 0, display_order: 1 },
        { org_id: orgId, name: 'Tarjetas (POS)', icon: 'CreditCard', enabled: true, description: 'Crédito y Débito (Visa, MC, Amex)', color: 'text-blue-500', commission: 0, display_order: 2 },
        { org_id: orgId, name: 'Yape', icon: 'Smartphone', enabled: true, description: 'Transferencia móvil rápida BCP', color: 'text-purple-600', extra: '', commission: 0, display_order: 3 },
        { org_id: orgId, name: 'Plin', icon: 'QrCode', enabled: true, description: 'Transferencia móvil interbancaria', color: 'text-cyan-500', extra: '', commission: 0, display_order: 4 },
        { org_id: orgId, name: 'Transferencia', icon: 'Wallet', enabled: false, description: 'Cuentas BCP, BBVA, Scotiabank', color: 'text-orange-500', commission: 0, display_order: 5 },
    ];

    const { data, error } = await supabase
        .from('payment_methods')
        .insert(defaults)
        .select();

    if (error) throw error;
    return data || [];
};

export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const { data, error } = await supabase
        .from('payment_methods')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const togglePaymentMethod = async (id: string, enabled: boolean): Promise<void> => {
    const { error } = await supabase
        .from('payment_methods')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
};

export const saveAllPaymentMethods = async (methods: PaymentMethod[]): Promise<void> => {
    for (const method of methods) {
        if (method.id) {
            await updatePaymentMethod(method.id, method);
        }
    }
};
