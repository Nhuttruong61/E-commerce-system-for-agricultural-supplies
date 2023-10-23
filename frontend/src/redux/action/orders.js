import * as Type from "../Type/order";
import * as OrderService from "../../service/orderService";
export const getAllOrder = () => async (dispatch) => {
  try {
    dispatch({
      type: Type.GET_ALL_ORDER,
    });
    const res = await OrderService.getAllOrder();
    console.log(res.order);
    dispatch({
      type: Type.GET_ALL_ORDER_SUCCESS,
      data: res.order,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_ALL_ORDER_ERROR,
      data: null,
    });
  }
};
