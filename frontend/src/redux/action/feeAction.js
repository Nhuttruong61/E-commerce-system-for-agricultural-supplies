import * as Type from "../Type/fee";
import * as TransportFeeService from "../../service/transportFeeService";
export const getAllFee = () => async (dispatch) => {
  try {
    const res = await TransportFeeService.getAlltransportFee();
    dispatch({
      type: Type.GET_FEE_SUCCESS,
      data: res.transportFees,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_FEE_ERROR,
      data: null,
    });
  }
};
