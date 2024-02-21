import axios from "./axios-costum";

export const getAllCategory = async () => {
  const res = await axios.get("/category/get-all-categories");
  return res.data;
};

export const createCategory = async (data) => {
  const res = await axios.post("/category/create-category", data);
  return res.data;
};
export const updateCategory = async (id, data) => {
  const res = await axios.put(`/category/update-category/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`/category/delete-category/${id}`);
  return res.data;
};
