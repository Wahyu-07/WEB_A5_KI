import fetchClient from "./client";

export const getAllProducts = async () => {
  return await fetchClient("/products");
};

export const createProduct = async (data) => {
  return await fetchClient("/products", {
    body: data,
  });
};

export const updateProduct = async (id, data) => {
  return await fetchClient(`/products/${id}`, {
    method: "PUT",
    body: data,
  });
};

export const deleteProduct = async (id) => {
  return await fetchClient(`/products/${id}`, {
    method: "DELETE",
  });
};
