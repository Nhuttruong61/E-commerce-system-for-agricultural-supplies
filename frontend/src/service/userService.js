import axios from "./axios-costum";
export const RegisterService = async (newUser) => {
  const res = await axios.post("/user/create-user", newUser);
  return res;
};
export const Activation_token = async (accessToken) => {
  const res = await axios.post("/user/activation", {accessToken});
  return res;
};
