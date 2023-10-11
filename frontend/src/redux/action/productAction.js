import { getAllProducts } from "../../service/productService";
import * as Type from "../Type/product";

export const getAllProductRd = () => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_PRODUCT,
    });
    const res = await getAllProducts();
    dispatch({
      type: Type.GET_PRODUCT_SUCCESS,
      data: res.product,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_PRODUCT_ERROR,
      data: null,
    });
  }
};
