import { supabase } from '../../lib/supabase';

// Types
export interface AuditLog {
    id?: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    details?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at?: string;
}

export type AuditAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'EXPORT'
    | 'VIEW'
    | 'PASSWORD_RESET'
    | 'SETTINGS_CHANGE';

export type EntityType =
    | 'USER'
    | 'PRODUCT'
    | 'CLIENT'
    | 'SUPPLIER'
    | 'SALE'
    | 'INVOICE'
    | 'REPORT'
    | 'SETTINGS'
    | 'PROFILE';

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

// ============ AUDIT LOGGING ============

/**
 * Log an audit event
 */
export const logAuditEvent = async (
    action: AuditAction,
    entityType: EntityType,
    entityId?: string,
    details?: Record<string, any>
): Promise<void> => {
    const userId = getUserId();
    if (!userId) return;

    try {
        await supabase.from('audit_logs').insert({
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details,
            user_agent: navigator.userAgent
        });
    } catch (error) {
        console.error('Error logging audit event:', error);
        // Don't throw - audit logging should not break app flow
    }
};

/**
 * Get audit logs with filters
 */
export const getAuditLogs = async (
    filters?: {
        userId?: string;
        action?: AuditAction;
        entityType?: EntityType;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }
): Promise<AuditLog[]> => {
    const userId = getUserId();
    if (!userId) return [];

    let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 100);

    if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
    }
    if (filters?.action) {
        query = query.eq('action', filters.action);
    }
    if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType);
    }
    if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }

    return data || [];
};

// ============ ACTION TRANSLATIONS ============

export const actionLabels: Record<AuditAction, string> = {
    LOGIN: 'Inicio de sesión',
    LOGOUT: 'Cierre de sesión',
    CREATE: 'Creación',
    UPDATE: 'Actualización',
    DELETE: 'Eliminación',
    EXPORT: 'Exportación',
    VIEW: 'Visualización',
    PASSWORD_RESET: 'Cambio de contraseña',
    SETTINGS_CHANGE: 'Cambio de configuración'
};

export const entityLabels: Record<EntityType, string> = {
    USER: 'Usuario',
    PRODUCT: 'Producto',
    CLIENT: 'Cliente',
    SUPPLIER: 'Proveedor',
    SALE: 'Venta',
    INVOICE: 'Factura',
    REPORT: 'Reporte',
    SETTINGS: 'Configuración',
    PROFILE: 'Perfil'
};
