import fetchClient from "./client";

export const login = async (username, password) => {
  return await fetchClient("/auth/login", {
    body: { username, password },
  });
};

export const registerAdmin = async (username, password) => {
  return await fetchClient("/auth/register-admin", {
    body: { username, password },
  });
};
