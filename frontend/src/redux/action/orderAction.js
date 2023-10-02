import * as Type from "../Type/order";
import * as OrderService from "../../service/orderService";
export const getAllUserOrder = (id) => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_ALL_ORDER_USER,
    });
    const res = await OrderService.getAllOrderUser(id);
    dispatch({
      type: Type.GET_ALL_ORDER_USER_SUCCESS,
      data: res.order,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_ALL_ORDER_USER_ERROR,
      data: null,
    });
  }
};
