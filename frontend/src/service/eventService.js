import axios from "./axios-costum";

export const getAllEvents = async () => {
  const res = await axios.get("/event/get-all-events");
  return res;
};
