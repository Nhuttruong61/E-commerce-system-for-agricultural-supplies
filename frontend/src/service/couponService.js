import axios from "./axios-costum";

export const createCoupouns = async (data) => {
  const res = await axios.post("/coupon/create-coupon", data, {
    withCredentials: true,
  });
  return res;
};

export const getCoupouns = async () => {
  const res = await axios.get("/coupon/get-coupons", {
    withCredentials: true,
  });
  return res;
};

export const getCoupoun = async (id) => {
  const res = await axios.get(`/coupon/get-coupons/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const editCoupoun = async (id, data) => {
  const res = await axios.get(`/coupon/edit-coupon/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
export const deleteCoupoun = async (id) => {
  const res = await axios.get(`/coupon/delete-coupon/${id}`, {
    withCredentials: true,
  });
  return res;
};
