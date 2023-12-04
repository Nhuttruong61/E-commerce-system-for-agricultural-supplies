import axios from "./axios-costum";

export const creatReceipt = async (data) => {
  const res = await axios.post("/receipt/create-receipt", data, {
    withCredentials: true,
  });
  return res;
};

export const getAllReceipt = async () => {
  const res = await axios.get("/receipt/get-all-receipt", {
    withCredentials: true,
  });
  return res;
};
export const getAReceipt = async (id) => {
  const res = await axios.get(`/receipt/get-a-receipt/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateReceipt = async (id, data) => {
  const res = await axios.put(`/receipt/update-receipt/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
export const deleteReceipt = async (id) => {
  const res = await axios.delete(`/receipt/delete-receipt/${id}`, {
    withCredentials: true,
  });
  return res;
};
