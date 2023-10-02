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
