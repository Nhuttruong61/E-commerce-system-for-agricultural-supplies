import * as Type from "../Type/order";

const initialState = {
  data: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_ALL_ORDER_USER_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_ALL_ORDER_USER_ERROR:
      return {
        data: null,
      };
    default:
      return state;
  }
};
