import { supabase } from '../../lib/supabase';

// Types
export interface UserProfile {
    id?: string;
    user_id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    bio: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    pagina_web: string;
    facebook_url: string;
    instagram_url: string;
    whatsapp_num: string;
    profile_image_url?: string;
    created_at?: string;
    updated_at?: string;
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

// ============ USER PROFILE ============

export const getProfile = async (): Promise<UserProfile | null> => {
    const userId = getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No profile found - return null
            return null;
        }
        console.error('Error fetching profile:', error);
        throw error;
    }

    return data;
};

export const saveProfile = async (profile: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
    const userId = getUserId();
    if (!userId) throw new Error('No user ID found');

    // Check if profile exists
    const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (existing) {
        // Update existing
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                ...profile,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
        return data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('user_profiles')
            .insert({
                user_id: userId,
                ...profile
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
        return data;
    }
};

export const uploadProfileImage = async (file: File): Promise<string> => {
    const userId = getUserId();
    if (!userId) throw new Error('No user ID found');

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return data.publicUrl;
};
