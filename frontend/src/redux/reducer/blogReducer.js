import * as Type from "../Type/blog";

const initialState = {
  data: null,
};

export const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_ALL_BLOG_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_ALL_BLOG_ERROR:
      return {
        data: null,
      };
    default:
      return state;
  }
};
