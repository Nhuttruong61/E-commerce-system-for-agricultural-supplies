import * as Type from "../Type/event";
import * as EventService from "../../service/eventService";
export const getAllEvents = () => async (dispatch) => {
  try {
    const res = await EventService.getAllEvents();
    dispatch({
      type: Type.GET_EVENT_SUCCESS,
      data: res.events,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_EVENT_ERROR,
      data: null,
    });
  }
};
