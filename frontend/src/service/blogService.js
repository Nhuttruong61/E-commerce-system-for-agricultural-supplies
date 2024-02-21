import axios from "./axios-costum";

export const createBlog = async (data) => {
  const res = await axios.post("/blog/create-blog", data);
  return res.data;
};

export const getAllBlog = async () => {
  const res = await axios.get("/blog/get-all-blog");
  return res.data;
};
export const getABlog = async (id) => {
  const res = await axios.get(`/blog/get-a-blog/${id}`);
  return res.data;
};

export const updateBlog = async (id, data) => {
  const res = await axios.put(`/blog/update-blog/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await axios.delete(`/blog/delete-blog/${id}`);
  return res.data;
};
