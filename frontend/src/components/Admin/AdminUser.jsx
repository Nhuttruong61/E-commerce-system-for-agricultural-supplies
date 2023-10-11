import React, { useEffect, useRef, useState } from "react";
import * as UserSerVice from "../../service/userService";
import TableComponent from "../Table";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import { toast } from "react-toastify";
function AdminUser() {
  const [dataUser, setDataUser] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [idUser, setIdUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const dispatch = useDispatch();
  const getAllUsers = async () => {
    setIsLoading(true);
    const res = await UserSerVice.getAllUser();
    try {
      if (res.success) {
        setDataUser(res?.users);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const renderAction = (text, item) => {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          setIdUser(item.id);
          setShowModal(true);
        }}
      >
        <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
      </div>
    );
  };
  const renderReview = (text, item) => {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          setShowModalReview(true);
          setInfoUser(item.review);
        }}
      >
        <EyeOutlined className="text-blue-600 border border-[blue] py-2 px-1 rounded-[4px]" />
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
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.quality - b.quality,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
    },
    {
      title: "Info",
      dataIndex: "review",
      render: renderReview,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataUser && dataUser.length > 0) {
    dataTable = dataUser.map((user) => {
      return {
        key: user._id,
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user?.phoneNumber ? user.phoneNumber : "No information yet",
        isAdmin: user.role,
        review: {
          ...user,
        },
      };
    });
  }

  const handleCancel = () => {
    setShowModal(false);
    setShowModalReview(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleDeleteUser = async () => {
    setIsLoading(true);
    setShowModal(false);
    const res = await UserSerVice.deleteUser(idUser);
    setShowModal(false);
    if (res.success) {
      dispatch(getAllUsers());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };
  const handleReview = () => {
    setShowModalReview(false);
  };
  return (
    <div className="w-full">
      <div className="flex flex-row-reverse p-2 ">
        <CSVLink
          filename="user.csv"
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-[#73c509]  text-white"
          data={dataTable}
        >
          <CiExport className="md:text-[30px] text-[20px] " />
          <h2 className="font-[600] px-1">Export</h2>
        </CSVLink>
      </div>
      <div className="w-full justify-center items-center">
        <TableComponent
          columns={columns}
          data={dataTable}
          isLoading={isLoading}
        />
        <Modal
          title="Delete"
          open={showModal}
          onOk={handleDeleteUser}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
        >
          <p>{`Are you sure you want to delete this user?`} </p>
        </Modal>
        <Modal
          title="Information user"
          open={showModalReview}
          onOk={handleReview}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
          cancelButtonProps={{ style: { display: "none" } }}
          width={600}
        >
          <div className="flex items-center">
            <div className="w-[30%]">
              {infoUser?.avatar ? (
                <img
                  src={infoUser.avatar.url}
                  alt=""
                  className="w-[80px] h-[80px] rounded-full"
                />
              ) : (
                <UserOutlined style={{ width: "80px", height: "80px" }} />
              )}
            </div>
            <div className="w-[70%]">
              <label className="flex  items-center">
                <p className=" font-[500]">Name:</p>
                <p className="pl-2">{infoUser?.name}</p>
              </label>
              <label className="flex items-center">
                <p className=" font-[500]">Email:</p>
                <p className="pl-2">{infoUser?.email}</p>
              </label>
              <label className="flex items-center">
                <p className=" font-[500]">Number:</p>
                <p className="pl-2">{infoUser?.phoneNumber}</p>
              </label>
              <label className="flex items-center">
                <p className=" font-[500]">Role:</p>
                <p className="pl-2">{infoUser?.role}</p>
              </label>

              <label className="flex  items-center">
                <p className=" font-[500]">Address:</p>
                {infoUser?.addresses.length > 0 ? (
                  <p className="pl-2">{infoUser?.addresses[0].address}</p>
                ) : (
                  <p className="pl-2">No information yet</p>
                )}
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AdminUser;
