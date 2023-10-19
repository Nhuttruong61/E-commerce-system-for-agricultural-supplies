import * as Type from "../Type/blog";
import * as BlogService from "../../service/blogService";
export const getAllBlog = () => async (dispatch) => {
  try {
    const res = await BlogService.getAllBlog();

    dispatch({
      type: Type.GET_ALL_BLOG_SUCCESS,
      data: res.blog,
    });
  } catch (e) {
    dispatch({
      type: Type.GET_ALL_BLOG_ERROR,
      data: null,
    });
  }
};
