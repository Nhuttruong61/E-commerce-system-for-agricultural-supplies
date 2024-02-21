import axios from "./axios-costum";

export const createMessage = async (data) => {
  const res = await axios.post("/message/create-message", data);
  return res.data;
};

export const getAllMessage = async (id) => {
  const res = await axios.get(`/message/get-all-message/${id}`);
  return res.data;
};

export const UpdateMessage = async (id, data) => {
  const res = await axios.put(`/message/update-message/${id}`, data);
  return res.data;
};
