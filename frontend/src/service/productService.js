import axios from "./axios-costum";

export const getAllProducts = async (data) => {
  const res = await axios.get(`product/get-all-products?${data}`);
  return res;
};

export const getaProduct = async (id) => {
  const res = await axios.get(`/product/get-products/${id}`);
  return res;
};
