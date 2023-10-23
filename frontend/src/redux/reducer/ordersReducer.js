import * as Type from "../Type/order";

const initialState = {
  data: null,
};

export const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_ALL_ORDER_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_ALL_ORDER_ERROR:
      return {
        data: null,
      };
    default:
      return state;
  }
};
