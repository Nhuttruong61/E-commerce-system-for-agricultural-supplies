import * as Type from "../Type/question";

const initialState = {
  data: null,
};
export const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_QUESTION_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case Type.GET_QUESTION_ERROR:
      return {
        data: null,
      };

    default:
      return state;
  }
};
