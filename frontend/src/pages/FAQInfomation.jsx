import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as questionService from "../service/questionService";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Modal} from "antd";
import Loading from "../components/Loading";
import { UserOutlined } from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";

function FAQInfomation() {
  const user = useSelector((state) => state.user);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [isModalEditQuetion, setIsModalEditQuetion] = useState(false);
  const [isModalDeleteQuetion, setIsModalDeleteQuetion] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idQuestion, setIdQuestion] = useState(null);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [idComment, setIdComment] = useState(null);
  const [idQuestionUser, setIdQuestionUser] = useState(null);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getAdata = async () => {
    setIsLoading(true);
    const res = await questionService.getAQuestion(id);
    console.log(res);
    if (res.success) {
      setData(res);
      setQuestionTitle(res.question.title);
      setQuestionContent(res.question.content);
      setIdQuestion(res?.question._id);
      setCommentData(res?.question?.comments);
      setIdQuestionUser(res?.question?.author._id);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getAdata();
  }, []);
  useEffect(() => {
    if (user && user.isAuthenticated) {
      const res = user.account._id;
      setIdUser(res);
    }
  }, [user]);

  const showModalEditQuetion = () => {
    setIsModalEditQuetion(true);
  };
  const showModalDeleteQuetion = () => {
    setIsModalDeleteQuetion(true);
  };
  const showModalEdit = (id) => {
    setIsModalEdit(true);
    setIdComment(id);
  };
  const showModalDelete = (id) => {
    setIsModalDelete(true);
    setIdComment(id);
  };

  const getComment = async () => {
    const res = await questionService.getComment(idQuestion, idComment);
    if (res && res.success) {
      setComment(res.comment?.content);
    }
  };
  useEffect(() => {
    if (idQuestion && idComment) {
      getComment();
    }
  }, [idQuestion, idComment]);

  const handleDelete = async () => {
    const res = await questionService.deleteComment(idQuestion, idComment);
    getAdata();
    setIsModalDelete(false);
    return res;
  };

  const handleCancel = () => {
    setIsModalEdit(false);
    setIdQuestionUser(false);
    setIsModalDelete(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const okButtonEdit = {
    style: {
      color: "blue",
      border: "1px solid #ccc",
    },
  };

  const handleEditQuestion = async () => {
    const data = {
      title: questionTitle,
      content: questionContent,
    };
    const res = await questionService.editQuestion(idQuestion, data);
    getAdata();
    setIsModalEditQuetion(false);
    setIsShow(false);
    return res;
  };
  const handleDeleteQuestion = async () => {
    const res = await questionService.deleteQuestion(idQuestion);
    setIsModalDeleteQuetion(false);
    setIsShow(false);
    navigate("/faq");
    return res;
  };

  const handleOnchageEdit = (e) => {
    setComment(e.target.value);
  };
  const handleEdit = async () => {
    const data = {
      content: comment,
    };
    const res = await questionService.editComment(idQuestion, idComment, data);
    setIsModalEdit(false);
    getAdata();
    return res;
  };
  const handleOnchageTitle = (e) => {
    setQuestionTitle(e.target.value);
  };
  const handleOnchageContent = (e) => {
    setQuestionContent(e.target.value);
  };
  const handleOnchangeNewComment = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmitCommmet = async () => {
    if (user && user.isAuthenticated) {
      const data = {
        content: newComment,
      };
      const res = await questionService.createComment(idQuestion, data);
      getAdata();
      setNewComment("");
      return res;
    }
    navigate("/login");
  };
  return (
    <Loading isLoading={isLoading}>
      <div className="flex md:p-[4%] p-2 ">
        <div className="flex flex-col w-2/12">
          <img
            src={data?.question?.author.avatar.url}
            alt=""
            className="md:w-[80px] md:h-[80px] w-[40px] h-[40px] rounded-[50%]"
          />
          <p className="text-[50%] md:text-[100%]">
            {" "}
            {data?.question?.author.name}
          </p>
          <p className="text-[50%]  md:text-[100%]">
            Ngày đăng:{" "}
            {data?.question?.createdAt.length > 0
              ? format(new Date(data?.question?.createdAt), "dd/MM/yyyy")
              : null}
          </p>
        </div>
        <div className="flex flex-col w-10/12 ml-4">
          <p className="font-[600] text-[50%]  md:text-[100%]">
            {data?.question?.title}
          </p>
          <p className="text-[50%]  md:text-[100%]">
            {data?.question?.content}
          </p>
          <div className="flex w-full  flex-col">
            <div className="w-full flex ">
              {idQuestionUser && idQuestionUser === idUser ? (
                <div className="flex justify-between w-full ">
                  <div className="flex flex-col items-start">
                    <span onClick={() => setIsShow(!isShow)}>
                      <BsThreeDots
                        className="mt-2 relative cursor-pointer"
                        style={{ fontSize: "20px" }}
                      />
                    </span>
                    {isShow && (
                      <div className=" absolute mt-6 bg-white shadow-md py-2 rounded">
                        <div>
                          <p
                            className="text-blue-600 px-2 font-[600]  cursor-pointer hover:bg-[#4b8600] hover:text-white"
                            onClick={showModalEditQuetion}
                          >
                            Chỉnh sửa
                          </p>
                          <Modal
                            title="Chỉnh sửa"
                            open={isModalEditQuetion}
                            onOk={handleEditQuestion}
                            onCancel={handleCancel}
                            okButtonProps={okButtonEdit}
                            okType="none"
                          >
                            <input
                              type="text"
                              value={questionTitle}
                              onChange={handleOnchageTitle}
                              className="w-full md:px-4 h-auto py-2 border-[2px] sm:px-0 rounded-[4px] my-2 break-words"
                            />
                            <textarea
                              type="text"
                              value={questionContent}
                              onChange={handleOnchageContent}
                              className="w-full md:px-4 h-auto py-2 border-[2px] sm:px-0 rounded-[4px] break-words"
                            />
                          </Modal>
                        </div>
                        <div>
                          <p
                            className="text-red-600  cursor-pointer px-2 font-[600]  hover:bg-[#4b8600] hover:text-white"
                            onClick={showModalDeleteQuetion}
                          >
                            Xóa
                          </p>
                          <Modal
                            title="Xóa"
                            open={isModalDeleteQuetion}
                            onOk={handleDeleteQuestion}
                            onCancel={handleCancel}
                            okButtonProps={okButtonDelete}
                            okType="none"
                          >
                            <p>{`Bạn có chắc muốn xóa bài đăng này!`} </p>
                          </Modal>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className=" font-[600] cursor-pointer p-2">Bình luận</p>
                </div>
              ) : (
                <div className="flex flex-row-reverse w-full ">
                  <p className=" font-[600] cursor-pointer p-2">Bình luận</p>
                </div>
              )}
            </div>
            <div className="flex  flex-col">
              {commentData?.map((item) => {
                return (
                  <div key={item._id} className="flex w-full my-2 flex-col">
                    <div className="flex items-center w-full">
                      <img
                        src={item?.author.avatar.url}
                        alt=""
                        className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-[50%]"
                      />
                      <div className="ml-4 shadow-md p-4 w-full border rounded">
                        <p className="font-[600] text-[50%]  md:text-[100%]">
                          {item?.author.name}
                        </p>
                        <p className="text-[50%]  md:text-[100%]">
                          {item?.content}
                        </p>
                        <div className="w-full flex flex-row-reverse ">
                          {idUser === item.author._id && (
                            <div>
                              <p
                                className="text-red-600  cursor-pointer"
                                onClick={() => showModalDelete(item._id)}
                              >
                                Xóa
                              </p>
                              <Modal
                                title="Xóa"
                                open={isModalDelete}
                                onOk={handleDelete}
                                onCancel={handleCancel}
                                okButtonProps={okButtonDelete}
                                okType="none"
                              >
                                <p>{`Bạn có chắc muốn xóa bình luận này!`} </p>
                              </Modal>
                            </div>
                          )}
                          {idUser === item.author._id && (
                            <div>
                              <p
                                className="text-blue-600 px-2  cursor-pointer"
                                onClick={() => showModalEdit(item._id)}
                              >
                                Chỉnh sửa
                              </p>
                              <Modal
                                title="Chỉnh sửa"
                                open={isModalEdit}
                                onOk={handleEdit}
                                onCancel={handleCancel}
                                okButtonProps={okButtonEdit}
                                okType="none"
                              >
                                <textarea
                                  value={comment}
                                  onChange={handleOnchageEdit}
                                  className="w-full md:px-4  h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
                                />
                              </Modal>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className=" flex items-center w-full my-1">
              {user.account?.avatar?.url ? (
                <img
                  src={user.account?.avatar?.url}
                  alt=""
                  className=" md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-[50%]"
                />
              ) : (
                <div className="border rounded-[50%]">
                  <UserOutlined className="text-[24px] p-2 text-[#73C509]" />
                </div>
              )}

              <div className="flex ml-4 w-full h-auto  border-[2px] sm:px-0 rounded-[4px]">
                <input
                  type="text"
                  value={newComment}
                  className="w-full h-auto outline-none py-2 pl-2"
                  onChange={handleOnchangeNewComment}
                />
                <button
                  className="bg-[#4b8600] px-4 rounded-r-[4px] text-white"
                  style={{
                    cursor: newComment.length === 0 ? "not-allowed" : "pointer",
                  }}
                  disabled={newComment.length === 0}
                  onClick={handleSubmitCommmet}
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default FAQInfomation;
