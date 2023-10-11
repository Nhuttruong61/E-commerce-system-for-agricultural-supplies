import { getAllCategory } from "../../service/categoryService";
import * as Type from "../Type/category";
export const getCaterogy = () => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_CATEGORY,
    });
    const res = await getAllCategory();
    dispatch({
      type: Type.GET_CATEGORY_SUCCESS,
      data: res,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_CATEGORY_ERROR,
      data: null,
    });
  }
};
