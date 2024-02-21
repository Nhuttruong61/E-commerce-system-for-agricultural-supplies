import axios from "./axios-costum";

export const getAllProducts = async (data) => {
  const res = await axios.get(`product/get-all-products?${data}`);
  return res.data;
};

export const getaProduct = async (id) => {
  const res = await axios.get(`/product/get-products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post("/product/create-product", data);
  return res.data;
};

export const updateProduct = async (editProduct, idProduct) => {
  const res = await axios.put(
    `/product/update-product/${idProduct}`,
    editProduct,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const deleteProduct = async (id) => {
  const res = await axios.delete(`/product/delete-product/${id}`);
  return res.data;
};

export const reviewProduct = async (data) => {
  const res = axios.post("/product/create-review", data);
  return res.data;
};
