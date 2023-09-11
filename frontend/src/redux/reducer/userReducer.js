import * as Type from "../Type/user";

const initialState = {
  isAuthenticated: false,
  account: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.LOG_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        account: action.data,
      };
    case Type.LOG_USER_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        account: null,
      };
    case Type.LOG_OUT_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        account: null,
      };
    case Type.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        account: action.data,
      };
    case Type.UPDATE_USER_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        account: null,
      };
    default:
      return state;
  }
};
