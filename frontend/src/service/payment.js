import axios from "./axios-costum";

export const payment = async (data) => {
  const res = await axios.post("/payment/vnpay", data);
  return res.data;
};

export const peymentReturn = async (data) => {
  const res = await axios.get(`/payment/vnpay-return?${data}`);
  return res.data;
};
