import { api } from '../../lib/api';

export const getRoles = async () => {
    const response = await api.get('/admin/iam/roles');
    return response.data;
};

export const getUsers = async () => {
    // Reusing Auth Module endpoint which returns users + roles
    const response = await api.get('/admin/auth/users');
    return response.data;
};

export const assignRole = async (userId: string, roleId: string, companyId?: string) => {
    const response = await api.post('/admin/iam/users/assign-role', {
        userId,
        roleId,
        companyId,
    });
    return response.data;
};
