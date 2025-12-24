import { api } from '../../lib/api';

export interface UserProfile {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    phone?: string;
    address?: string;
    department?: string;
    province?: string;
    district?: string;
    website?: string;
    socialLinks?: Record<string, string>;
    avatarUrl?: string; // Optional if we add avatar support later
}

export const getProfile = async (): Promise<UserProfile> => {
    const response = await api.get('/admin/auth/profile');
    return response.data;
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/admin/auth/profile', data);
    return response.data;
};
