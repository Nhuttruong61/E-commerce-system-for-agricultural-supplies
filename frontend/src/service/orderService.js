import axios from "./axios-costum";

export const getAllOrderUser = async (id) => {
  const res = await axios.get(`/order/get-orders/${id}`);
  return res.data;
};

export const getAOrder = async (id) => {
  const res = await axios.get(`/order/get-order/${id}`);
  return res.data;
};

export const getAllOrder = async () => {
  const res = await axios.get("/order/get-all-orders");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await axios.post("/order/create-order", data);
  return res.data;
};
export const cancelOrder = async (id, data) => {
  const res = await axios.put(`/order/cancel-order/${id}`, data);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await axios.put(`/order/update-order-status/${id}`, status);
  return res.data;
};
export const deleteOrder = async (id) => {
  const res = await axios.delete(`/order/delete-order/${id}`);
  return res.data;
};
