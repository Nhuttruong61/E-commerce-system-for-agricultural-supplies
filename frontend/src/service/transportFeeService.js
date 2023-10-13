import axios from "./axios-costum";

export const getAlltransportFee = async () => {
  const res = await axios.get("/transportfee/get-transport-fee", {
    withCredentials: true,
  });
  return res;
};
export const createTransportFee = async (data) => {
  const res = await axios.post("transportfee/create-transport-fee/", data, {
    withCredentials: true,
  });
  return res;
};
export const updateTransportFee = async (id, data) => {
  const res = await axios.put(`/transportfee/edit-transport-fee/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
export const deleteTransportFee = async (id) => {
  const res = await axios.delete(`/transportfee/delete-transport-fee/${id}`, {
    withCredentials: true,
  });
  return res;
};
