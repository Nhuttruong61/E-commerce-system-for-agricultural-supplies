import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../../../redux/action/blog";
import { SearchOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import TableComponent from "../../Table";
import * as BlogService from "../../../service/blogService.js";
import { toast } from "react-toastify";
function AdminBlog() {
  const blogs = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showModalSeeMoreBlog, setShowModalSeeMoreBlog] = useState(false);
  const [dataSeeMore, setDataSeeMore] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllBlog());
    setIsLoading(false);
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
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
  const renderSeeMore = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setDataSeeMore(item);
            setShowModalSeeMoreBlog(true);
          }}
        >
          <EyeOutlined className="text-blue-600 border border-[blue] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
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
      dataIndex: "stt",
    },

    {
      title: "Tiêu đề",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Xem thêm",
      dataIndex: "see",
      render: renderSeeMore,
    },

    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (blogs && blogs.data?.length > 0) {
    dataTable = blogs.data.map((blog, index) => {
      return {
        ...blog,
        key: index,
        stt: index + 1,
      };
    });
  }
  const handleSeeMoreblog = () => {
    setShowModalSeeMoreBlog(false);
  };
  const handleCancel = () => {
    setShowModalSeeMoreBlog(false);
    setShowModalDelete(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleDelete = async () => {
    setShowModalDelete(false);
    setIsLoading(true);
    try {
      const res = await BlogService.deleteBlog(idDelete);
      setIsLoading(false);
      if (res.status) {
        toast.success("Xóa bài đăng thành công");
        dispatch(getAllBlog());
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {" "}
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thông tin"
        open={showModalSeeMoreBlog}
        onOk={handleSeeMoreblog}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        width={800}
      >
        <label htmlFor="" className="flex justify-between items-center my-2">
          <p className="w-[20%] font-[500]">Tiêu đề bài viết</p>
          <input
            value={dataSeeMore?.title}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
            readOnly
          />
        </label>
        <label
          htmlFor=""
          className="flex justify-between items-center h-[42vh]"
        >
          <p className="w-[20%] font-[500]">Nội dung</p>
          <div className="w-[80%] md:px-4  my-1 py-2 border-[2px] sm:px-0 rounded-[4px] h-[38vh] overflow-y-scroll ">
            {dataSeeMore?.content &&
              dataSeeMore?.content.length > 0 &&
              dataSeeMore?.content.map((item, index) => {
                return (
                  <div className="w-full" key={item._id}>
                    <div className="flex justify-between items-center">
                      <p className="w-[20%] font-[500]">Tiêu đề {index + 1}</p>
                      <p className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] ">
                        {item?.heading}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="w-[20%] font-[500]">Nội dung {index + 1}</p>
                      {item.description &&
                        item.description.length > 0 &&
                        item.description.map((item) => {
                          return (
                            <div className="w-full">
                              <p className="w-[80%] md:px-4  h-auto my-1 py-2  sm:px-0  ">
                                {item}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    {item?.images && (
                      <div className="flex justify-between items-center">
                        <p className="w-[20%] font-[500]">
                          Ảnh minh họa {index + 1}
                        </p>
                        <div className="w-[80%] md:px-4  h-auto my-1 py-2">
                          <img
                            src={item.images.url}
                            alt=""
                            className="w-[50px]- h-[50px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </label>
      </Modal>
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
    </div>
  );
}

export default memo(AdminBlog);
