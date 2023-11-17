import React, { useEffect, useState } from "react";
import * as questionService from "../../service/questionService";
import Loading from "../../components/Loading";
import Footer from "../../components/Layout/Footer";
import { MessageFilled } from "@ant-design/icons";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Pagination } from "antd";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestionRd } from "../../redux/action/questionAction";

export default function Forum() {
  const questionData = useSelector((state) => state.question);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [dataQuetion, setDataQuetion] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [optionSort, setOptionSort] = useState("all");
  const [dataSort, setDataSort] = useState(null);
  const itemsPerPage = 10;
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuestionRd());
  }, []);
  useEffect(() => {
    setIsLoading(true);
    if (questionData && questionData?.data?.length > 0) {
      const res = questionData.data;
      setDataQuetion(res);
    }
    setIsLoading(false);
  }, [questionData]);
  useEffect(() => {
    if (dataQuetion && dataQuetion.length > 0) {
      const data = dataQuetion?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(data);
    }
  }, [dataQuetion]);
  const handleNavigate = async (id) => {
    navigate(`/forum/${id}`);
    await questionService.updateView(id);
  };
  const showModalAdd = () => {
    if (isAuthenticated === true) {
      setIsModalAdd(true);
    } else {
      navigate("/login");
    }
  };
  const handleOnchageTitle = (e) => {
    setQuestionTitle(e.target.value);
  };
  const handleOnchageContent = (e) => {
    setQuestionContent(e.target.value);
  };
  const handleAdd = async () => {
    try {
      const data = {
        title: questionTitle,
        content: questionContent,
        images: images,
      };
      setIsLoading(true);
      const res = await questionService.createQuestion(data);
      setIsLoading(false);
      if (res?.success) {
        dispatch(getAllQuestionRd());
        toast.success("Xin chờ admin kiểm duyệt");
        setQuestionTitle("");
        setQuestionContent("");
      }
      setIsModalAdd(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalAdd(false);
    setImages([]);
  };
  const okButtonAdd = {
    style: {
      color: "#0e9c49",
      border: "1px solid #ccc",
    },
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    dataSort?.length > 0
      ? dataSort?.slice(indexOfFirstItem, indexOfLastItem)
      : data?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handlleOnchangeImage = (e) => {
    const files = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function () {
      setImages(reader.result);
    };
    reader.readAsDataURL(files);
  };
  useEffect(() => {
    switch (optionSort) {
      case "all":
        setDataSort(currentItems);
        break;
      case "new":
        const newest = data?.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setDataSort(newest);
        break;
      case "old":
        const oldest = data?.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setDataSort(oldest);
        break;
      case "view-many":
        const view = data?.sort((a, b) => b.view - a.view);
        setDataSort(view);
        break;
      default:
        setDataSort(data);
    }
  }, [optionSort]);
  return (
    <Loading isLoading={isLoading}>
      <div className="grid-cols-1 min-h-[100vh] bg-[#f4f1f4f4]">
        <div className="flex justify-between md:px-[10%] py-4 items-center px-4 text-[100%]  shadow bg-white">
          <h1 className="font-[600]">Diễn đàn nông nghiệp</h1>

          <div>
            <p
              className="bg-[#0e9c49] text-white px-4 py-1 font-[600] rounded hover:bg-[#4c8600f3] cursor-pointer"
              onClick={showModalAdd}
            >
              Đăng bài
            </p>
            <Modal
              title="Bài đăng"
              open={isModalAdd}
              onOk={handleAdd}
              onCancel={handleCancel}
              okButtonProps={okButtonAdd}
              okType="none"
              width={800}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Hủy
                </Button>,
                <Button key="submit" onClick={handleAdd}>
                  Xác nhận
                </Button>,
              ]}
            >
              <input
                type="text"
                value={questionTitle}
                onChange={handleOnchageTitle}
                placeholder="Tiêu đề"
                className="w-full md:px-4 px-2 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
              />
              <textarea
                value={questionContent}
                rows={8}
                placeholder="Nội dung"
                onChange={handleOnchageContent}
                className="w-full md:px-4 px-2 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
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
                    className="w-[40px] h-[40px] object-cover rounded-full"
                  />
                ) : null}
              </div>
            </Modal>
          </div>
        </div>
        <div className="md:px-[10%] flex mt-8 mb-4 justify-end w-full">
          <select
            value={optionSort}
            onChange={(e) => setOptionSort(e.target.value)}
            className="outline-none font-[600] rounded py-1"
          >
            <option value="all">Tất cả</option>
            <option value="new">Mới nhất</option>
            <option value="old">Cũ nhất</option>
            <option value="view-many">Nhiều lược xem nhất</option>
          </select>
        </div>
        <div className="md:px-[10%] ">
          {currentItems &&
            currentItems?.map((item) => {
              if (item.status === "Confirm") {
                return (
                  <div
                    className="flex  shadow-md px-10 items-center py-2 rounded hover:bg-slate-200 cursor-pointer mb-2 bg-white"
                    key={item._id}
                    onClick={() => handleNavigate(item._id)}
                  >
                    <div className=" w-[70%] flex">
                      <div className="flex  items-center pr-2 ">
                        <MessageFilled className="text-[#009b49] text-[30px]" />
                      </div>
                      <div className="flex flex-col">
                        <p className=" font-[600] flex  items-center">
                          {item.title}
                        </p>
                        <div className="flex">
                          <p className="mr-2">Đăng bởi:</p>
                          <p className="font-[600]">{item.author.name}</p>
                        </div>
                        <div className="flex">
                          <p className="mr-2">Ngày:</p>
                          <p className="font-[600]">
                            {format(new Date(item.createdAt), "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className=" w-[30%] flex flex-col h-full  ">
                      <div className="flex  items-center justify-center">
                        <p className="pr-2 text-[#a8a7a7]">Trả lời: </p>
                        {item?.comments?.length ? (
                          <p>{item?.comments.length}</p>
                        ) : (
                          <p>0</p>
                        )}
                      </div>
                      <div className="flex  items-center justify-center ">
                        <p className="pr-2 text-[#a8a7a7]">Lượt xem: </p>
                        <p>{item?.view}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
        <div className="grid grid-cols-1 justify-center items-center text-center py-4">
          <Pagination
            current={currentPage}
            total={data?.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
        )
      </div>
      <Footer />
    </Loading>
  );
}
