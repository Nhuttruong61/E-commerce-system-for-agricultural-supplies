import * as Type from "../Type/category";

const initialState = {
  data: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_CATEGORY_SUCCESS:
      return {
        ...state,
        data: action.data,
      };

    case Type.GET_CATEGORY_ERROR:
      return {
        data: null,
      };

    default:
      return state;
  }
};
