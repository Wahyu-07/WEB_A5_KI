import fetchClient from "./client";

export const getLoginLogs = async (params = {}) => {
    const response = await fetchClient("/access-logs", { params });
    return response.data || [];
};

export const getCrudLogs = async (params = {}) => {
    const response = await fetchClient("/db-change-logs", { params });
    return response.data || [];
};

export const getLoginAttempts = async () => {
    // Backend route for System Locks is /api/login-attempts based on server.js route mapping
    // But route file itself queries SystemLock.findAll().
    // Let's assume we want to query that.
    const response = await fetchClient("/login-attempts");
    return response.data || [];
};

export const unlockUser = async (userId) => {
    // Backend user unlock is PUT /api/login-attempts/unlock/:user_id
    return await fetchClient(`/login-attempts/unlock/${userId}`, { method: 'PUT' });
};
