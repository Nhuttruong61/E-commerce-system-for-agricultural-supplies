import * as Type from "../Type/Cart";

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
