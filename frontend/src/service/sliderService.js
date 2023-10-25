import axios from "./axios-costum";

export const getAllSlider = async () => {
  const res = await axios.get("/slider/get-all-slider", {
    withCredentials: true,
  });
  return res;
};
export const createSlider = async (data) => {
  const res = await axios.post("/slider/create-slider", data, {
    withCredentials: true,
  });
  return res;
};
export const updateSlider = async (id, data) => {
  const res = await axios.put(`/slider/update-slider/${id}`, data, {
    withCredentials: true,
  });
  return res;
};

export const deleteSlider = async (id) => {
  const res = await axios.delete(`/slider/delete-slider/${id}`, {
    withCredentials: true,
  });
  return res;
};
