import axios from "./axios-costum";
export const RegisterService = async (newUser) => {
  const res = await axios.post("/user/create-user", newUser);
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
  const res = await axios.get("user/getUser", { withCredentials: true });
  return res;
};
