import * as Type from "../Type/product";

const initialState = {
  data: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_PRODUCT_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_PRODUCT_ERROR:
      return null;
    default:
      return state;
  }
};
