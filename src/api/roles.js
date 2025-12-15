import fetchClient from "./client";

export const getAllRoles = async () => {
  return await fetchClient("/roles");
};

export const createRole = async (roleData) => {
  return await fetchClient("/roles/create", {
    body: roleData,
  });
};

export const updateUserRole = async (userId, roles) => {
    return await fetchClient("/user-roles", {
        method: "PUT",
        body: { user_id: userId, role_ids: roles }
    });
};
