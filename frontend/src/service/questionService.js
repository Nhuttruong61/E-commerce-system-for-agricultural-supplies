import axios from "./axios-costum";

export const createQuestion = async (data) => {
  const res = await axios.post("/question/create-question", data, {
    withCredentials: true,
  });
  return res;
};
export const editQuestion = async (questionId, data) => {
  const res = await axios.put(`/question/edit-question/${questionId}`, data, {
    withCredentials: true,
  });
  return res;
};
export const deleteQuestion = async (questionId) => {
  const res = await axios.delete(
    `/question/delete-question-user/${questionId}`,

    {
      withCredentials: true,
    }
  );
  return res;
};
export const getAllQuestion = async () => {
  const res = await axios.get("/question/get-all-questions");
  return res;
};
export const getAQuestion = async (id) => {
  const res = await axios.get(`/question/get-question/${id}`);
  return res;
};

export const getComment = async (questionid, commentId) => {
  const res = await axios.get(
    `/question/get-comment/${questionid}/comment/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return res;
};
export const createComment = async (questionid, data) => {
  const res = await axios.post(`/question/create-comment/${questionid}`, data, {
    withCredentials: true,
  });
  return res;
};

export const deleteComment = async (questionid, commentId) => {
  const res = await axios.delete(
    `/question/delete-comment/${questionid}/comment/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return res;
};
export const editComment = async (questionid, commentId, data) => {
  const res = await axios.put(
    `/question/edit-comment/${questionid}/comment/${commentId}`,
    data,
    {
      withCredentials: true,
    }
  );
  return res;
};
