import * as Type from "../Type/fee";

const initialState = {
  data: null,
};

export const feeReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_FEE_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_FEE_ERROR:
      return {
        data: null,
      };
    default:
      return state;
  }
};
