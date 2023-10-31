import React, { memo, useEffect, useRef, useState } from "react";
import * as UserSerVice from "../../service/userService";
import TableComponent from "../Table";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  EditOutlined,
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
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [infoUser, setInfoUser] = useState(null);
  const dispatch = useDispatch();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    tax: "",
    addresses: {
      city: "",
      address: "",
    },
  });
  const getAllUsers = async () => {
    setIsLoading(true);
    const res = await UserSerVice.getAllUser();
    setIsLoading(false);
    try {
      if (res.success) {
        setDataUser(res?.users);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className=" flex">
        <div
          className="cursor-pointer"
          onClick={() => {
            setIdUser(item.id);
            setShowModalAdd(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="cursor-pointer pl-2"
          onClick={() => {
            setEditUser({
              name: item.name,
              email: item.email,
              phoneNumber: item.phoneNumber,
              role: item.role,
              avatar: item.avatar,
              tax: item?.tax ? item?.tax : null,
              addresses: {
                city: item?.addresses?.city ? item?.addresses?.city : "",
                address: item?.addresses?.address
                  ? item?.addresses?.address
                  : "",
              },
            });
            setIdUser(item.id);
            setShowModalEdit(true);
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />
        </div>
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Tên",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
    },
    {
      title: "Xem thêm",
      dataIndex: "review",
      render: renderReview,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataUser && dataUser.length > 0) {
    dataTable = dataUser.map((user, index) => {
      return {
        key: user._id,
        id: user._id,
        stt: index + 1,
        email: user.email,
        name: user.name,
        tax: user?.tax,
        phoneNumber: user?.phoneNumber ? user.phoneNumber : "Chưa có thông tin",
        role: user.role,
        avatar: user?.avatar?.url,
        addresses: user.addresses[0],
        review: {
          ...user,
        },
      };
    });
  }

  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalReview(false);
    setShowModalEdit(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleDeleteUser = async () => {
    setIsLoading(true);
    setShowModalAdd(false);
    const res = await UserSerVice.deleteUser(idUser);
    setShowModalAdd(false);
    if (res.success) {
      getAllUsers();
      toast.success("Xóa tài khoản thành công");
    } else {
      toast.error("Có lỗi xa");
    }
    setIsLoading(false);
  };
  const handleReview = () => {
    setShowModalReview(false);
  };
  const handleEditUser = async () => {
    try {
      setShowModalEdit(false);
      setIsLoading(true);
      const res = await UserSerVice.updateUserId(idUser, editUser);
      if (res.success) {
        const res = await UserSerVice.updateAddressrId(
          idUser,
          editUser.addresses
        );
        if (res.success) {
          getAllUsers();
          toast.success("Cập nhật thông tin thành công");
        }
      }
    } catch (e) {
      toast.error("Đã xãy ra lỗi");
      console.log(e);
    } finally {
      getAllUsers();
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-row-reverse p-2 ">
        <CSVLink
          filename="user.csv"
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-[#009b49]  text-white"
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
          title="Xóa người dùng"
          open={showModalAdd}
          onOk={handleDeleteUser}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
        >
          <p>{`Bạn có muốn chắc xóa người dùng này?`} </p>
        </Modal>
        <Modal
          title="Thông tin người dùng"
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
                <p className=" font-[500]">Tên:</p>
                <p className="pl-2">{infoUser?.name}</p>
              </label>
              <label className="flex items-center">
                <p className=" font-[500]">Email:</p>
                <p className="pl-2">{infoUser?.email}</p>
              </label>
              <label className="flex items-center">
                <p className=" font-[500]">Điện thoại:</p>
                <p className="pl-2">{infoUser?.phoneNumber}</p>
              </label>
              {infoUser?.tax && (
                <label className="flex items-center">
                  <p className=" font-[500]">Mã thuế:</p>
                  <p className="pl-2">{infoUser?.tax}</p>
                </label>
              )}
              <label className="flex items-center">
                <p className=" font-[500]">Vai trò:</p>
                <p className="pl-2">{infoUser?.role}</p>
              </label>

              <label className="flex  items-center">
                <p className=" font-[500]">Địa chỉ:</p>
                {infoUser?.addresses.length > 0 ? (
                  <p className="pl-2">{infoUser?.addresses[0].address}</p>
                ) : (
                  <p className="pl-2">No information yet</p>
                )}
              </label>
            </div>
          </div>
        </Modal>
        <Modal
          title="Chỉnh sửa thông tin"
          open={showModalEdit}
          onOk={handleEditUser}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
          cancelButtonProps={{ style: { display: "none" } }}
          width={600}
        >
          <div className="flex items-center">
            <div className="w-[30%]">
              {editUser?.avatar ? (
                <img
                  src={editUser?.avatar}
                  alt=""
                  className="w-[80px] h-[80px] rounded-full"
                />
              ) : (
                <UserOutlined style={{ width: "80px", height: "80px" }} />
              )}
            </div>
            <div className="w-[70%]">
              <label className="flex justify-between items-center">
                <p className="w-[20%] font-[500]">Tên</p>
                <input
                  value={editUser?.name}
                  className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </label>
              <label className="flex justify-between items-center">
                <p className="w-[20%] font-[500]">Email</p>
                <input
                  value={editUser?.email}
                  className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                  readOnly
                />
              </label>
              <label className="flex justify-between items-center">
                <p className="w-[20%] font-[500]">Điện thoại</p>
                <input
                  value={editUser?.phoneNumber}
                  className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                  onChange={(e) =>
                    setEditUser({ ...editUser, phoneNumber: e.target.value })
                  }
                />
              </label>
              {editUser?.role !== "admin" && (
                <label className="flex justify-between items-center">
                  <p className="w-[20%] font-[500]">Vai trò</p>
                  <select
                    value={editUser?.role}
                    className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none "
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                  >
                    <option value="user">user</option>
                    <option value="business">business</option>
                  </select>
                </label>
              )}
              {editUser?.role === "business" && (
                <label className="flex justify-between items-center">
                  <p className="w-[20%] font-[500]">Mã thuế</p>
                  <input
                    value={editUser?.tax}
                    className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                    onChange={(e) =>
                      setEditUser({ ...editUser, tax: e.target.value })
                    }
                  />
                </label>
              )}
              <label className="flex  items-center">
                <p className="w-[20%] font-[500]">Thành phố:</p>
                <input
                  value={editUser?.addresses?.city}
                  className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                  onChange={(e) =>
                    setEditUser((edit) => ({
                      ...edit,
                      addresses: {
                        ...edit.addresses,
                        city: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label className="flex  items-center">
                <p className="w-[20%] font-[500]">Địa chỉ:</p>
                <input
                  value={editUser?.addresses?.address}
                  className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
                  onChange={(e) =>
                    setEditUser((edit) => ({
                      ...edit,
                      addresses: {
                        ...edit.addresses,
                        address: e.target.value,
                      },
                    }))
                  }
                />
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default memo(AdminUser);
