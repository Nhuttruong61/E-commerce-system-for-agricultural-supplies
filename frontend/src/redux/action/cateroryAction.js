import * as Type from "../Type/category";
export const getCaterogy = (data) => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_CATEGORY,
    });
    dispatch({
      type: Type.GET_CATEGORY_SUCCESS,
      data: data,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_CATEGORY_ERROR,
      data: null,
    });
  }
};
