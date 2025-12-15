import fetchClient from "./client";

export const addItemToOrder = async (data) => {
  return await fetchClient("/order-items", {
    body: data,
  });
};
