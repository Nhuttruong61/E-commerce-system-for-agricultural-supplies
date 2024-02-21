import axios from "./axios-costum";

export const getAllEvents = async () => {
  const res = await axios.get("/event/get-all-events");
  return res.data;
};
export const createEvent = async (event) => {
  const res = await axios.post("/event/create-event", event);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`/event/delete-event/${id}`);
  return res.data;
};
