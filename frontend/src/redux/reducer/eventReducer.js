import * as Type from "../Type/event";

const initialState = {
  data: null,
};

export const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_EVENT_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_EVENT_ERROR:
      return {
        data: null,
      };
    default:
      return state;
  }
};
