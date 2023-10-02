import * as Type from "../Type/question";
import * as questionService from "../../service/questionService";
export const createQuestionRd = (data) => async (dispastch) => {
  try {
    dispastch({
      type: Type.CREATE_QUESTION,
    });
    dispastch({
      type: Type.CREATE_QUESTION_SUCCESS,
      data: data,
    });
  } catch (e) {
    dispastch({
      type: Type.CREATE_QUESTION_ERROR,
      data: null,
    });
  }
};

export const getAllQuestionRd = () => async (dispastch) => {
  try {
    dispastch({
      type: Type.GET_QUESTION,
    });
    const res = await questionService.getAllQuestion();
    dispastch({
      type: Type.GET_QUESTION_SUCCESS,
      data: res.question,
    });
  } catch (e) {
    dispastch({
      type: Type.GET_QUESTION_ERROR,
      data: null,
    });
  }
};
