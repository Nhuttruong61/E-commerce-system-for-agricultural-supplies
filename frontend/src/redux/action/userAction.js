import * as UserService from "../../service/userService";
import * as Type from "../Type/user";
export const getUser = () => async (dispatch) => {
  try {
    dispatch({
      type: Type.LOG_USER,
    });
    const res = await UserService.getUser();
    dispatch({
      type: Type.LOG_USER_SUCCESS,
      data: res.user,
    });
  } catch (e) {
    dispatch({
      type: Type.LOG_USER_ERROR,
      data: null,
    });
  }
};
export const updateUser = (data) => async (dispatch) => {
  try {
    dispatch({
      type: Type.UPDATE_USER,
    });
    dispatch({
      type: Type.UPDATE_USER_SUCCESS,
      data: data,
    });
  } catch (e) {
    dispatch({
      type: Type.UPDATE_USER_ERROR,
      data: null,
    });
  }
};

export const LogoutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: Type.LOGOUT_USER,
    });
    await UserService.Logout();
    dispatch({
      type: Type.LOG_OUT_USER_SUCCESS,
      data: null,
    });
  } catch (err) {
    dispatch({
      type: Type.LOG_OUT_USER_ERROR,
    });
  }
};
