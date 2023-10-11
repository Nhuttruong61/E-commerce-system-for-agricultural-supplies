import * as Type from "../Type/question";
import * as questionService from "../../service/questionService";

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
