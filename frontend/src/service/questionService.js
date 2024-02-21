import axios from "./axios-costum";

export const createQuestion = async (data) => {
  const res = await axios.post("/question/create-question", data);
  return res.data;
};
export const editQuestion = async (questionId, data) => {
  const res = await axios.put(`/question/edit-question/${questionId}`, data);
  return res.data;
};
export const deleteQuestion = async (questionId) => {
  const res = await axios.delete(
    `/question/delete-question-user/${questionId}`,

    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const getAllQuestion = async () => {
  const res = await axios.get("/question/get-all-questions");
  return res.data;
};
export const getAQuestion = async (id) => {
  const res = await axios.get(`/question/get-question/${id}`);
  return res.data;
};

export const getComment = async (questionid, commentId) => {
  const res = await axios.get(
    `/question/get-comment/${questionid}/comment/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const createComment = async (questionid, data) => {
  const res = await axios.post(`/question/create-comment/${questionid}`, data);
  return res.data;
};

export const deleteComment = async (questionid, commentId) => {
  const res = await axios.delete(
    `/question/delete-comment/${questionid}/comment/${commentId}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const editComment = async (questionid, commentId, data) => {
  const res = await axios.put(
    `/question/edit-comment/${questionid}/comment/${commentId}`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const reportComment = async (questionid, commentId, userid) => {
  const res = await axios.put(
    `/question/report-comment/${questionid}/comment/${commentId}`,
    userid,
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export const confirmQuestion = async (id, data) => {
  const res = await axios.put(`/question/confirm-question/${id}`, data);
  return res.data;
};
export const deleteQuestionAdmin = async (id) => {
  const res = await axios.delete(`/question/delete-question-admin/${id}`);
  return res.data;
};
export const updateView = async (id) => {
  const res = await axios.put(`/question/updateView/${id}`);
  return res.data;
};
