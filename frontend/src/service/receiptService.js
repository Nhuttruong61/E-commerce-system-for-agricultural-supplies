import axios from "./axios-costum";

export const creatReceipt = async (data) => {
  const res = await axios.post("/receipt/create-receipt", data);
  return res.data;
};

export const getAllReceipt = async () => {
  const res = await axios.get("/receipt/get-all-receipt");
  return res.data;
};
export const getAReceipt = async (id) => {
  const res = await axios.get(`/receipt/get-a-receipt/${id}`);
  return res.data;
};

export const updateReceipt = async (id, data) => {
  const res = await axios.put(`/receipt/update-receipt/${id}`, data);
  return res.data;
};
export const deleteReceipt = async (id) => {
  const res = await axios.delete(`/receipt/delete-receipt/${id}`);
  return res.data;
};
