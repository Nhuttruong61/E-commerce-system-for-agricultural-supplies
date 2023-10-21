import axios from "./axios-costum";

export const createMessage = async (data) => {
  console.log("data", data);
  const res = await axios.post("/message/create-message", data, {
    withCredentials: true,
  });
  return res;
};

export const getAllMessage = async (id) => {
  const res = await axios.get(`/message/get-all-message/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const UpdateMessage = async (id, data) => {
  console.log(id, data);
  const res = await axios.put(`/message/update-message/${id}`, data, {
    withCredentials: true,
  });
  return res;
};
