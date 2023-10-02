import React, { useEffect, useRef, useState } from "react";
import * as UserSerVice from "../../service/userService";
import TableComponent from "../Table";
import { Button, Modal, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
function AdminUser() {
  const [dataUser, setDataUser] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [idUser, setIdUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      };
    });
  }

  const handleCancel = () => {
    setShowModal(false);
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleDeleteUser = async () => {
    setIsLoading(true);

    try {
      const res = await UserSerVice.deleteUser(idUser);
      setShowModal(false);
      if (res.success) {
        dispatch(getAllUsers());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full justify-center items-center">
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Xóa"
        open={showModal}
        onOk={handleDeleteUser}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có chắc muốn xóa người dùng này!`} </p>
      </Modal>
    </div>
  );
}

export default AdminUser;
