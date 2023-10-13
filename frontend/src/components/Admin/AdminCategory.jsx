import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../Table";
import { Button, Modal, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import imageCompression from "browser-image-compression";
import * as CategoryService from "../../service/categoryService";
import { toast } from "react-toastify";
import { getCaterogy } from "../../redux/action/cateroryAction";
function AdminCategory() {
  const { data } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const searchInput = useRef(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [idCategory, setIdCategory] = useState("");

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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setShowModalDelete(true);
            setIdCategory(item._id);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },

    {
      title: "Image",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.image}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (data && data?.categories) {
    dataTable = data.categories.map((item) => {
      return {
        ...item,
        image: item.images[0].url,
      };
    });
  }
  const handleOnchangeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
    }
  };
  const handleAddCategory = async () => {
    if (!name || !selectedImage) {
      toast.warning("Please enter full information");
    } else {
      setIsLoading(true);
      setShowModalAdd(false);
      const category = {
        name,
        images: selectedImage,
      };
      const res = await CategoryService.createCategory(category);
      if (res.success) {
        toast.success(res.message);
        dispatch(getCaterogy());
      } else {
        toast.error(res.message);
      }
      setName("");
      setSelectedImage(null);
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalDelete(false);
  };
  const handleDelete = async () => {
    setShowModalDelete(false);
    setIsLoading(true);
    const res = await CategoryService.deleteCategory(idCategory);
    if (res.success) {
      dispatch(getCaterogy());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };
  const okButtonAdd = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  useEffect(() => {
    dispatch(getCaterogy());
  }, []);
  return (
    <div className="w-full flex flex-col">
      <div
        className=" flex  md:flex-row m-2 cursor-pointer rounded w-[25%]"
        onClick={() => setShowModalAdd(true)}
      >
        <span className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-red-500  text-white">
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Import</h2>
        </span>
      </div>

      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Add new categories"
        open={showModalAdd}
        onOk={handleAddCategory}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Name</p>
          <input
            value={name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a category name..."
          />
        </label>

        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#4b8600] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2"
          >
            Image
          </label>
          <input
            id="inport"
            type="file"
            hidden
            onChange={handleOnchangeImage}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={selectedImage}
              alt=""
              value={selectedImage}
            />
          ) : null}
        </label>
      </Modal>
      <Modal
        title="Delete"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Are you sure you want to delete this category?`} </p>
      </Modal>
    </div>
  );
}

export default AdminCategory;
