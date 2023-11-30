import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as questionService from "../../service/questionService";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "antd";
import Loading from "../../components/Loading";
import { UserOutlined } from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";
import { getAllQuestionRd } from "../../redux/action/questionAction";
import { toast } from "react-toastify";
import { AiOutlineSend } from "react-icons/ai";
import moment from "moment/moment";
import { MdReportGmailerrorred } from "react-icons/md";
function ForumInfomation() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [commentData, setCommentData] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [isModalEditQuetion, setIsModalEditQuetion] = useState(false);
  const [isModalDeleteQuetion, setIsModalDeleteQuetion] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalReport, setIsModalReport] = useState(false);
  const [idQuestion, setIdQuestion] = useState(null);
  const [editQuestion, setEditQuestion] = useState({
    title: "",
    content: "",
    images: null,
  });
  const [idComment, setIdComment] = useState(null);
  const [idQuestionUser, setIdQuestionUser] = useState(null);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(null);
  const navigate = useNavigate();
  const getAdata = async () => {
    const res = await questionService.getAQuestion(id);
    if (res.success) {
      setData(res);
      setEditQuestion({
        title: res?.question.title,
        content: res?.question.content,
        images: res?.question?.images[0]?.url,
      });
      setIdQuestion(res?.question._id);
      setCommentData(res?.question?.comments);
      setIdQuestionUser(res?.question?.author._id);
    }
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
  const showModalEdit = (item) => {
    setIsModalEdit(true);
    setIdComment(item._id);
    setComment(item?.content);
  };
  const showModalDelete = (id) => {
    setIsModalDelete(true);
    setIdComment(id);
  };
  const handleDelete = async () => {
    try {
      setIsModalDelete(false);
      setIsLoading(true);
      const res = await questionService.deleteComment(idQuestion, idComment);
      setIsLoading(false);
      if (res.success) {
        toast.success("Xóa bình luận thành công");
        getAdata();
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalEdit(false);
    setIsModalEditQuetion(false);
    setIsModalDeleteQuetion(false);
    setIsModalDelete(false);
    setIsModalReport(false);
    setImages([]);
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

  useEffect(() => {
    if (images) {
      setEditQuestion({
        ...editQuestion,
        images: images,
      });
    } else if (!images && editQuestion?.images?.length > 0) {
      setEditQuestion({
        ...editQuestion,
        images: editQuestion.images,
      });
    } else {
      setEditQuestion({
        ...editQuestion,
      });
    }
  }, [images]);
  const handleEditQuestion = async () => {
    try {
      setIsLoading(true);
      setIsShow(false);
      const res = await questionService.editQuestion(idQuestion, editQuestion);
      setIsLoading(false);
      if (res.success) {
        getAdata();
        setIsModalEditQuetion(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  const handleDeleteQuestion = async () => {
    setIsShow(false);
    setIsLoading(true);
    const res = await questionService.deleteQuestion(idQuestion);
    if (res.success) {
      dispatch(getAllQuestionRd());
      toast.success("Xóa bài đăng thành công");
    } else {
      toast.error("Có lỗi xãy ra");
    }
    setIsModalDeleteQuetion(false);
    navigate("/m");
    return res;
  };

  const handleEditComment = async () => {
    try {
      setIsModalEdit(false);
      setIsLoading(true);
      const data = {
        content: comment,
      };
      const res = await questionService.editComment(
        idQuestion,
        idComment,
        data
      );
      setIsLoading(false);
      if (res.success) {
        getAdata();
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
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
    localStorage.setItem("redirectPath", window.location.pathname);
    navigate("/login");
  };
  const handlleOnchangeImage = (e) => {
    const files = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      setImages(reader.result);
    };
    reader.readAsDataURL(files);
  };
  const showModleReport = (id) => {
    if (user && user.isAuthenticated) {
      setIsModalReport(true);
      setIdComment(id);
    }
    localStorage.setItem("redirectPath", window.location.pathname);
    navigate("/login");
  };

  const handleReport = async () => {
    try {
      const userId = {
        userid: idUser,
      };
      setIsModalReport(false);
      setIsLoading(true);
      const res = await questionService.reportComment(
        idQuestion,
        idComment,
        userId
      );
      setIsLoading(false);
      if (res.success) {
        toast.success("Báo cáo bình luận thành công");
        getAdata();
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  const filterReport = data?.question?.comments.filter((el) => el.report >= 10);
  const deleteCommentReport = async () => {
    try {
      if (filterReport?.length > 0) {
        await Promise.all(
          filterReport.map(async (item) => {
            await questionService.deleteComment(idQuestion, item._id);
          })
        );
        getAdata();
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (filterReport?.length > 0) {
      deleteCommentReport();
    }
  }, [filterReport]);

  const handleClickOutside = () => {
    setIsShow(false);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <Loading isLoading={isLoading}>
      <div className="flex md:p-[4%] p-2 ">
        <div className="flex flex-col w-2/12">
          <img
            src={data?.question?.author?.avatar?.url}
            alt=""
            className="md:w-[80px] md:h-[80px] w-[40px] h-[40px] rounded-[50%]"
          />
          <p className="text-[80%] md:text-[100%]">
            {" "}
            {data?.question?.author.name}
          </p>
          <p className="text-[80%]  md:text-[100%]">
            Ngày đăng:{" "}
            {data?.question?.createdAt.length > 0
              ? format(new Date(data?.question?.createdAt), "dd/MM/yyyy")
              : null}
          </p>
        </div>
        <div className="flex flex-col w-10/12 ml-4">
          <p className="font-[600] text-[80%]  md:text-[100%]">
            {data?.question?.title}
          </p>
          {data?.question?.images?.length > 0 && (
            <img
              src={data?.question?.images[0].url}
              className="h-[160px] w-[160px] object-cover"
              alt=""
            />
          )}
          <p className="text-[80%]  md:text-[100%]">
            {data?.question?.content}
          </p>
          <div className="flex w-full  flex-col">
            <div className="w-full flex ">
              {idQuestionUser && idQuestionUser === idUser ? (
                <div
                  className="flex justify-between w-full "
                  onClick={(e) => e.stopPropagation()}
                >
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
                            className="text-blue-600 px-2 font-[600]  cursor-pointer hover:bg-[#0e9c49] hover:text-white"
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
                            width={800}
                            footer={[
                              <Button key="cancel" onClick={handleCancel}>
                                Hủy
                              </Button>,
                              <Button key="submit" onClick={handleEditQuestion}>
                                Xác nhận
                              </Button>,
                            ]}
                          >
                            <input
                              type="text"
                              value={editQuestion.title}
                              onChange={(e) =>
                                setEditQuestion({
                                  ...editQuestion,
                                  title: e.target.value,
                                })
                              }
                              className="w-full md:px-4 h-auto py-2 border-[2px] sm:px-0 rounded-[4px] my-2 break-words"
                            />
                            <textarea
                              type="text"
                              rows={8}
                              value={editQuestion.content}
                              onChange={(e) =>
                                setEditQuestion({
                                  ...editQuestion,
                                  content: e.target.value,
                                })
                              }
                              className="w-full md:px-4 h-auto py-2 border-[2px] sm:px-0 rounded-[4px] break-words"
                            />
                            <div className="flex items-center my-8 w-[30%] ">
                              <label
                                htmlFor="input"
                                className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
                              >
                                Ảnh
                              </label>
                              <input
                                id="input"
                                type="file"
                                hidden
                                onChange={handlleOnchangeImage}
                              />
                              {images?.length > 0 ? (
                                <img
                                  src={images}
                                  value={images}
                                  alt=""
                                  className="w-[50px] h-[50px] object-cover "
                                />
                              ) : (
                                <div>
                                  {editQuestion?.images?.length > 0 ? (
                                    <img
                                      className="w-[50px] h-[50px] object-cover "
                                      src={editQuestion?.images}
                                      alt=""
                                    />
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </Modal>
                        </div>
                        <div>
                          <p
                            className="text-red-600  cursor-pointer px-2 font-[600]  hover:bg-[#0e9c49] hover:text-white"
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
                            footer={[
                              <Button key="cancel" onClick={handleCancel}>
                                Hủy
                              </Button>,
                              <Button
                                key="submit"
                                onClick={handleDeleteQuestion}
                              >
                                Xác nhận
                              </Button>,
                            ]}
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
                  <div key={item._id} className="flex w-full my-1 flex-col">
                    <div className="flex items-center w-full">
                      <img
                        src={item?.author?.avatar?.url}
                        alt=""
                        className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-[50%]"
                      />
                      <div className="ml-4 shadow-md px-2 py-1 w-full border rounded">
                        <p className="font-[600] text-[80%]  md:text-[100%]">
                          {item?.author.name}
                        </p>
                        <p className="text-[80%]  md:text-[100%]">
                          {item?.content}
                        </p>
                        <div className="w-full flex justify-end ">
                          {idUser === item.author._id && (
                            <div>
                              <p
                                className="text-blue-600 px-2  cursor-pointer"
                                onClick={() => showModalEdit(item)}
                              >
                                Chỉnh sửa
                              </p>
                              <Modal
                                title="Chỉnh sửa"
                                open={isModalEdit}
                                onOk={handleEditComment}
                                onCancel={handleCancel}
                                okButtonProps={okButtonEdit}
                                okType="none"
                                footer={[
                                  <Button key="cancel" onClick={handleCancel}>
                                    Hủy
                                  </Button>,
                                  <Button
                                    key="submit"
                                    onClick={handleEditComment}
                                  >
                                    Xác nhận
                                  </Button>,
                                ]}
                              >
                                <textarea
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="w-full md:px-4  h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
                                />
                              </Modal>
                            </div>
                          )}
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
                                footer={[
                                  <Button key="cancel" onClick={handleCancel}>
                                    Hủy
                                  </Button>,
                                  <Button key="submit" onClick={handleDelete}>
                                    Xác nhận
                                  </Button>,
                                ]}
                              >
                                <p>{`Bạn có chắc muốn xóa bình luận này!`} </p>
                              </Modal>
                            </div>
                          )}
                          {idUser !== item.author._id &&
                            !item.userReport.includes(idUser) && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <div
                                  className="relative cursor-pointer"
                                  onClick={() => {
                                    showModleReport(item._id);
                                  }}
                                >
                                  <MdReportGmailerrorred className="text-[20px]" />
                                </div>

                                <Modal
                                  title="Báo cáo"
                                  open={isModalReport}
                                  onOk={handleReport}
                                  onCancel={handleCancel}
                                  okButtonProps={okButtonDelete}
                                  okType="none"
                                  footer={[
                                    <Button key="cancel" onClick={handleCancel}>
                                      Hủy
                                    </Button>,
                                    <Button key="submit" onClick={handleReport}>
                                      Xác nhận
                                    </Button>,
                                  ]}
                                >
                                  <p>
                                    {`Bạn có chắc muốn báo cáo bình luận này!`}{" "}
                                  </p>
                                </Modal>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <p className="text-[#373636] text-[12px]">
                        {moment(item.createdAt).fromNow()}
                      </p>
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
                  <UserOutlined className="text-[24px] p-2 text-[#009b49]" />
                </div>
              )}

              <div className="flex flex-col ml-4 w-full h-auto  border-[2px] sm:px-0 rounded-[4px]">
                <textarea
                  type="text"
                  value={newComment}
                  className="w-full h-auto outline-none py-2 pl-2"
                  maxLength={1000}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="w-full flex justify-end">
                  <button
                    className="px-4 rounded-r-[4px] text-[#0e9c49]   pb-2 flex justify-end"
                    style={{
                      cursor:
                        newComment.length === 0 ? "not-allowed" : "pointer",
                    }}
                    disabled={newComment.length === 0}
                    onClick={handleSubmitCommmet}
                  >
                    <AiOutlineSend className="text-[28px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default memo(ForumInfomation);
