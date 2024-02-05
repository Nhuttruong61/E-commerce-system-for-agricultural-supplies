import React, { memo, useEffect, useRef, useState } from "react";
import TableComponent from "../common/Table";
import { Button, Modal, Select, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import * as QuestionService from "../../service/questionService";
import { toast } from "react-toastify";

import { EyeOutlined } from "@ant-design/icons";
function AdminForum() {
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [isShowModalInfor, setIsShowModalInfor] = useState(false);
  const [dataInforQuestion, setdataInforQuestion] = useState({});
  const [questions, setQuestions] = useState([]);
  const fetchAllQuestion = async () => {
    const res = await QuestionService.getAllQuestion();
    setQuestions(res.question);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAllQuestion();
    setIsLoading(false);
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setIdDelete(item._id);
            setShowModalDelete(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const renderInfor = (text, item) => {
    return (
      <div className="cursor-pointer ">
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setIsShowModalInfor(true);
            setdataInforQuestion({
              ...item,
            });
          }}
        >
          <EyeOutlined className="text-blue-600 border border-[blue] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const handleStatusChange = async (value, id) => {
    setIsLoading(true);
    const data = {
      status: value,
    };
    const res = await QuestionService.confirmQuestion(id, data);
    if (res.success) {
      fetchAllQuestion();
    }
    setIsLoading(false);
  };

  const handleRenderStatus = (text, item) => {
    if (item.status === "Prossing") {
      return (
        <Select
          value={item.status}
          onChange={(value) => handleStatusChange(value, item._id)}
        >
          <Select.Option value="Prossing">Chờ xử lý</Select.Option>
          <Select.Option value="Confirm">Đã xữ lý</Select.Option>
        </Select>
      );
    } else {
      return <span>{item.status}</span>;
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tải lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(function () {
          if (searchInput.current) {
            searchInput.current.select();
          }
        }, 100);
      }
    },
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "sst",
    },
    {
      title: "Người đăng",
      dataIndex: "author",
      ...getColumnSearchProps("author"),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (text, record) => (
        <textarea
          defaultValue={record.content}
          readOnly
          cols="30"
          rows="2"
        ></textarea>
      ),
    },
    {
      title: "Xem thêm",
      dataIndex: "data",
      render: renderInfor,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: handleRenderStatus,
    },

    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (questions && questions.length > 0) {
    dataTable = questions.map((question, index) => {
      return {
        ...question,
        key: question._id,
        sst: index + 1,
        author: question.author.name,
      };
    });
  }
  const handleCancel = () => {
    setShowModalDelete(false);
    setIsShowModalInfor(false);
  };
  const handleDelete = async () => {
    setShowModalDelete(false);
    setIsLoading(true);
    const res = await QuestionService.deleteQuestionAdmin(idDelete);
    if (res.success) {
      fetchAllQuestion();
      toast.success("Xóa bài đăng thành công");
    } else {
      toast.error("Đã có lỗi xảy ra");
    }
    setIsLoading(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  return (
    <div className="w-full flex flex-col">
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Xóa bài đăng"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chắc xóa bài đăng?`} </p>
      </Modal>
      <Modal
        title="Chi tiết"
        open={isShowModalInfor}
        onOk={() => setIsShowModalInfor(false)}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <div className="flex flex-col">
          <p className="font-[600] ">{dataInforQuestion?.title}</p>
          {dataInforQuestion?.images?.length > 0 && (
            <img
              src={dataInforQuestion?.images[0]?.url}
              alt=""
              className="h-[120px] w-[120px] object-cover"
            />
          )}
          <p>{dataInforQuestion?.content}</p>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AdminForum);
