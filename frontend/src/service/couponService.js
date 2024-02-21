import axios from "./axios-costum";

export const createCoupouns = async (data) => {
  const res = await axios.post("/coupon/create-coupon", data);
  return res.data;
};

export const getCoupouns = async () => {
  const res = await axios.get("/coupon/get-coupons");
  return res.data;
};

export const getCoupoun = async (id) => {
  const res = await axios.get(`/coupon/get-coupons/${id}`);
  return res.data;
};

export const editCoupoun = async (id, data) => {
  const res = await axios.put(`/coupon/edit-coupon/${id}`, data);
  return res.data;
};
export const deleteCoupoun = async (id) => {
  const res = await axios.delete(`/coupon/delete-coupon/${id}`);
  return res.data;
};
