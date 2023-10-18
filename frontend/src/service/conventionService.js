import axios from "./axios-costum";

export const createConversation = async (data) => {
  const res = await axios.post("/convertion/create-new-convention", data, {
    withCredentials: true,
  });
  return res;
};
export const getAllConversations = async (id) => {
  const res = await axios.get(`/convertion/get-all-convention/${id}`, {
    withCredentials: true,
  });
  return res;
};
