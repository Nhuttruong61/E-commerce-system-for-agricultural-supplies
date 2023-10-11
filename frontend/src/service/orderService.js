import axios from "./axios-costum";

export const getAllOrderUser = async (id) => {
  const res = await axios.get(`/order/get-orders/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const getAOrder = async (id) => {
  const res = await axios.get(`/order/get-order/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const getAllOrder = async () => {
  const res = await axios.get("/order/get-all-orders", {
    withCredentials: true,
  });
  return res;
};

export const createOrder = async (data) => {
  const res = await axios.post("/order/create-order", data, {
    withCredentials: true,
  });
  return res;
};
export const cancelOrder = async (id, data) => {
  const res = await axios.put(`/order/cancel-order/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
