import fetchClient from "./client";

export const getAllUsers = async () => {
  const response = await fetchClient("/users");
  // Backend returns { success: true, data: [...] }
  const users = response.data || [];
  
  // Normalize 'roles' (array of objects) to 'role' (array of strings) for frontend compatibility
  return users.map(u => ({
      ...u,
      role: u.roles ? u.roles.map(r => r.name) : [] // Map [{name:'admin'}] to ['admin']
  }));
};

export const createUser = async (userData) => {
  return await fetchClient("/users/create", {
    body: userData,
  });
};

export const updateUser = async (id, userData) => {
    return await fetchClient(`/users/${id}`, {
        method: "PUT",
        body: userData
    });
};

export const deleteUser = async (id) => {
    return await fetchClient(`/users/${id}`, {
        method: "DELETE"
    });
};
