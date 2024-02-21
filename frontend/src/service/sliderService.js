import axios from "./axios-costum";

export const getAllSlider = async () => {
  const res = await axios.get("/slider/get-all-slider");
  return res.data;
};
export const createSlider = async (data) => {
  const res = await axios.post("/slider/create-slider", data);
  return res.data;
};
export const updateSlider = async (id, data) => {
  const res = await axios.put(`/slider/update-slider/${id}`, data);
  return res.data;
};

export const deleteSlider = async (id) => {
  const res = await axios.delete(`/slider/delete-slider/${id}`);
  return res.data;
};
