import * as Type from "../Type/productType";

export const getAllProductRd = (data) => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_PRODUCT,
    });
    dispatch({
      type: Type.GET_PRODUCT_SUCCESS,
      data: data,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_PRODUCT_ERROR,
      data: null,
    });
  }
};
