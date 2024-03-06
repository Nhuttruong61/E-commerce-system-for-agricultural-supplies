import axios from "./axios-costum";
export const RegisterService = async (newUser) => {
  const res = await axios.post("/user/create-user", newUser);
  return res.data;
};
export const RegisterBusiness = async (data) => {
  const res = await axios.post("/user/create-account-bussiness", data);
  return res.data;
};
export const Activation_token = async (accessToken) => {
  const res = await axios.post("/user/activation", { accessToken });
  return res.data;
};
export const LoginService = async (user) => {
  const res = await axios.post("/user/login-user", user);
  return res.data;
};
export const getUser = async () => {
  const res = await axios.get("/user/get-user", { withCredentials: true });
  return res.data;
};

export const updateAUser = async (user) => {
  const res = await axios.put("/user/update-user", user);
  console.log(res.data);
  return res.data;
};
export const updateUserId = async (id, user) => {
  const res = await axios.put(`/user/update-userId/${id}`, user);
  return res.data;
};
export const updateAddressrId = async (id, data) => {
  const res = await axios.put(`/user/update-addressId/${id}`, data);
  return res.data;
};

export const updateAddress = async (address) => {
  const res = await axios.put("/user/update-address", address);
  return res.data;
};

export const getAllUser = async () => {
  const res = await axios.get("/user/get-all-users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/user/delete/${id}`);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axios.post("/user/request-password", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await axios.put("/user/reset-password", data);
  return res.data;
};
export const getUserById = async (id) => {
  const res = await axios.get(`/user/get-user/${id}`);
  return res.data;
};
export const updateCoupon = async (id, data) => {
  const res = await axios.put(`/user/update-coupon-user/${id}`, data);
  return res.data;
};
export const chagePassword = async (data) => {
  const res = await axios.put("/user/change-password", data);
  return res.data;
};
export const addProductToCart = async (id, data) => {
  const res = axios.put(`/user/add-product/${id}`, data);
  return res.data;
};
export const deleteProductToCart = async (id, data) => {
  const res = axios.put(`/user/delete-product-cart/${id}`, data);
  return res.data;
};
