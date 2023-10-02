import * as Type from "../Type/product";

export const getAllProductRd = (data) => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_PRODUCT,
    });
    dispatch({
      type: Type.GET_PRODUCT_SUCCESS,
      data: data.product,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_PRODUCT_ERROR,
      data: null,
    });
  }
};
