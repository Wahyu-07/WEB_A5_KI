import fetchClient from "./client";

export const createOrder = async (data) => {
  return await fetchClient("/orders", {
    body: data,
  });
};

export const getAllOrders = async (params = {}) => {
  return await fetchClient("/orders", { params });
};
