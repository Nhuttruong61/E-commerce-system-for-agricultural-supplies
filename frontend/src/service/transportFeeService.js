import axios from "./axios-costum";

export const getAlltransportFee = async () => {
  const res = await axios.get("/transportfee/get-transport-fee");
  return res.data;
};
export const createTransportFee = async (data) => {
  const res = await axios.post("transportfee/create-transport-fee/", data);
  return res.data;
};
export const updateTransportFee = async (id, data) => {
  const res = await axios.put(`/transportfee/edit-transport-fee/${id}`, data);
  return res.data;
};
export const deleteTransportFee = async (id) => {
  const res = await axios.delete(`/transportfee/delete-transport-fee/${id}`);
  return res.data;
};
