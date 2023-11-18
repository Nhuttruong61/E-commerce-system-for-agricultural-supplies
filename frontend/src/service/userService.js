import axios from "./axios-costum";
export const RegisterService = async (newUser) => {
  const res = await axios.post("/user/create-user", newUser);
  return res;
};
export const RegisterBusiness = async (data) => {
  const res = await axios.post("/user/create-account-bussiness", data);
  return res;
};
export const Activation_token = async (accessToken) => {
  const res = await axios.post("/user/activation", { accessToken });
  return res;
};
export const LoginService = async (user) => {
  const res = await axios.post("/user/login-user", user, {
    withCredentials: true,
  });
  return res;
};
export const getUser = async () => {
  const res = await axios.get("/user/get-user", { withCredentials: true });
  return res;
};

export const Logout = async () => {
  const res = await axios.get("/user/logout", { withCredentials: true });
  return res;
};

export const updateAUser = async (user) => {
  const res = await axios.put("/user/update-user", user, {
    withCredentials: true,
  });
  return res;
};
export const updateUserId = async (id, user) => {
  const res = await axios.put(`/user/update-userId/${id}`, user, {
    withCredentials: true,
  });
  return res;
};
export const updateAddressrId = async (id, data) => {
  const res = await axios.put(`/user/update-addressId/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const updateAddress = async (address) => {
  const res = await axios.put("/user/update-address", address, {
    withCredentials: true,
  });
  return res;
};

export const getAllUser = async () => {
  const res = await axios.get("/user/get-all-users", {
    withCredentials: true,
  });
  return res;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/user/delete/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const forgotPassword = async (data) => {
  const res = await axios.post("/user/request-password", data, {
    withCredentials: true,
  });
  return res;
};

export const resetPassword = async (data) => {
  const res = await axios.put("/user/reset-password", data, {
    withCredentials: true,
  });
  return res;
};
export const getUserById = async (id) => {
  const res = await axios.get(`/user/get-user/${id}`, {
    withCredentials: true,
  });
  return res;
};
export const updateCoupon = async (id, data) => {
  const res = await axios.put(`/user/update-coupon-user/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
export const chagePassword = async (data) => {
  const res = await axios.put("/user/change-password", data, {
    withCredentials: true,
  });
  return res;
};
