import { getUser } from "../../service/userService";
import * as Type from "../Type/Cart";

export const getDataCart = () => async (dispatch) => {
  try {
    const res = await getUser();
    dispatch({
      type: Type.GET_DATA_CART,
      data: res.user.cart,
    });
  } catch (e) {
    dispatch({
      data: [],
    });
  }
};

export const increaseQuantity = (data) => async (dispatch) => {
  dispatch({
    type: Type.INCREASE_QUALTTY_CART,
    data: data,
  });
};

export const decreaseQuantity = (data) => async (dispatch) => {
  dispatch({
    type: Type.DECREASE_QUALTTY_CART,
    data: data,
  });
};
export const deteteProductCart = (data) => async (dispatch) => {
  dispatch({
    type: Type.DELETE_PRODUCT_CART,
    data: data,
  });
};

export const clearQuantity = () => async (dispatch) => {
  dispatch({
    type: Type.CLEAR_QUALTTY_CART,
    data: [],
  });
};
