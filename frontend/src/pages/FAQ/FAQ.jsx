import React, { useEffect, useState } from "react";
import * as questionService from "../../service/questionService";
import Loading from "../../components/Loading";
import Footer from "../../components/Layout/Footer";
import { MessageFilled } from "@ant-design/icons";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestionRd } from "../../redux/action/questionAction";

export default function FAQ() {
  const questionData = useSelector((state) => state.question);
  const [dataQuetion, setDataQuetion] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
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
  const handleNavigate = (id) => {
    navigate(`/faq/${id}`);
  };
  const showModalAdd = () => {
    setIsModalAdd(true);
  };
  const handleOnchageTitle = (e) => {
    setQuestionTitle(e.target.value);
  };
  const handleOnchageContent = (e) => {
    setQuestionContent(e.target.value);
  };
  const handleAdd = async () => {
    const data = {
      title: questionTitle,
      content: questionContent,
    };
    const res = await questionService.createQuestion(data);
    if (res?.success) {
      dispatch(getAllQuestionRd());
      toast.success("Xin chờ admin kiểm duyệt");
    }
    setIsModalAdd(false);
    return res;
  };

  const handleCancel = () => {
    setIsModalAdd(false);
  };
  const okButtonAdd = {
    style: {
      color: "#0e9c49",
      border: "1px solid #ccc",
    },
  };
  return (
    <Loading isLoading={isLoading}>
      <div className="grid-cols-1 min-h-[100vh] bg-[#f4f1f4f4]">
        <div className="flex justify-between md:px-[10%] py-4 items-center px-4 text-[100%]  shadow">
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
                placeholder="Nội dung"
                onChange={handleOnchageContent}
                className="w-full md:px-4 px-2 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
              />
            </Modal>
          </div>
        </div>

        <div className="md:px-[10%] my-8">
          {data &&
            data.map((item) => {
              if (item.status === "Confirm") {
                return (
                  <div
                    className="flex  shadow-md px-10 py-2 rounded hover:bg-slate-200 cursor-pointer mb-2"
                    key={item._id}
                    onClick={() => handleNavigate(item._id)}
                  >
                    <div className="flex  items-center pr-2 ">
                      <MessageFilled className="text-[#009b49] md:text-[30px]" />
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
                );
              }
            })}
        </div>
      </div>
      <Footer />
    </Loading>
  );
}
