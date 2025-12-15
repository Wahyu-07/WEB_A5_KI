import fetchClient from "./client";

export const getUserRoles = async () => {
  return await fetchClient("/user-roles");
};

export const assignRoleToUser = async (data) => {
  return await fetchClient("/user-roles", {
    body: data,
  });
};

// Fungsi update ini menggunakan PUT sesuai diskusi sebelumnya
export const updateUserRoles = async (data) => {
    return await fetchClient("/user-roles", { // Asumsi endpoint PUT /user-roles sync
      method: "PUT",
      body: data,
    });
};
