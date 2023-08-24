import * as UserService from "../../service/userService";
import * as Type from "../Type/user";
export const getUser = () => async (dispatch) => {
  try {
    const res = await UserService.getUser();
    dispatch({
      type: Type.LOG_USER_SUCCESS,
      data: res.user,
    });
  } catch (e) {
    dispatch({
      type: Type.LOG_USER_ERROR,
    });
  }
};
