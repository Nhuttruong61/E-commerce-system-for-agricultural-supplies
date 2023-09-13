import axios from "./axios-costum";

export const getAllCategory = async () => {
  const res = await axios.get("/category/get-all-categories");
  return res;
};
