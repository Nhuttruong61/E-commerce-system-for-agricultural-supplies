import axios from "./axios-costum";

export const createBlog = async (data) => {
  console.log("data", data);
  const res = await axios.post("/blog/create-blog", data, {
    withCredentials: true,
  });
  return res;
};

export const getAllBlog = async () => {
  const res = await axios.get("/blog/get-all-blog", {
    withCredentials: true,
  });
  return res;
};
export const getABlog = async (id) => {
  const res = await axios.get(`/blog/get-a-blog/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateBlog = async (id, data) => {
  const res = await axios.put(`/blog/update-blog/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const deleteBlog = async (id) => {
  const res = await axios.post(`/blog/delete-blog/${id}`, {
    withCredentials: true,
  });
  return res;
};
