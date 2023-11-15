import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../Table";
import { Button, Modal, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { toast } from "react-toastify";
import * as EventService from "../../service/eventService";
import { getAllEvents } from "../../redux/action/eventAction";
function AdminEvent() {
  const { data } = useSelector((state) => state.event);
  const products = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(products?.data[0]._id);
  const [discount, setDiscount] = useState(0);
  const [startDay, setStartDay] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [finishDay, setFinishDay] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [idEvent, setIdEvent] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    dispatch(getAllEvents());
  }, []);
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
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1"
          onClick={() => {
            setIdEvent(item._id);
            setShowModalDelete(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Tên",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Bắt đầu",
      dataIndex: "start",
    },
    {
      title: "Kết thúc",
      dataIndex: "finish",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (data) {
    dataTable = data.map((item, index) => {
      return {
        ...item,
        stt: index + 1,
        productName: item.product[0].name,
      };
    });
  }
  const handleAddEvent = async () => {
    if (!name || !description || !product) {
      toast.warning("Xin hãy nhập đầy đủ thông tin");
    } else if (discount <= 0) {
      toast.warning("Mức giảm giá không hợp lệ");
    } else {
      setShowModalAdd(false);
      setIsLoading(true);
      const event = {
        name,
        description,
        product: {
          _id: product,
        },
        discount,
        start: startDay,
        finish: finishDay,
      };
      const res = await EventService.createEvent(event);
      if (res.success) {
        dispatch(getAllEvents());
        toast.success("Tạo sự kiện thành công");
      }
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalDelete(false);
  };
  const handleDeleteEvent = async () => {
    setIsLoading(true);
    setShowModalDelete(false);
    const res = await EventService.deleteEvent(idEvent);
    if (res.success) {
      dispatch(getAllEvents());
      toast.success("Xóa sự kiện thành công");
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
    const productIds = products.data.map((item) => item._id);
    const eventProductIds = dataTable.map((item) => {
      return {
        idProduct: item.product[0]._id,
        idEvent: item._id,
      };
    });
    const uniqueEvents = eventProductIds.filter((event) => {
      return !productIds.includes(event.idProduct);
    });

    if (uniqueEvents.length > 0) {
      setIsLoading(true);
      uniqueEvents.forEach(async (item) => {
        const res = await EventService.deleteEvent(item.idEvent);
        if (res.success) {
          dispatch(getAllEvents());
        }
      });
      setIsLoading(false);
    }
  }, [products, dataTable]);

  return (
    <div className="w-full">
      <div
        className="flex md:flex-row m-2 justify-between cursor-pointer"
        onClick={() => setShowModalAdd(true)}
      >
        <span className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-red-500  text-white">
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Tạo mới</h2>
        </span>
      </div>
      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thêm mới sự kiện"
        open={showModalAdd}
        onOk={handleAddEvent}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên</p>
          <input
            type="text"
            value={name}
            placeholder="Nhận tên sự kiện"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Mô tả</p>
          <textarea
            cols={12}
            rows={4}
            value={description}
            placeholder="hãy miêu tả thông tin sự kiện"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Sản phẩm</p>
          <select
            value={product}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setProduct(e.target.value)}
          >
            {products && products.data.length > 0
              ? products.data.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Giảm giá</p>
          <input
            type="text"
            value={discount}
            placeholder="Phần trăm giảm giá"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setDiscount(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Bắt đầu</p>
          <input
            type="date"
            value={startDay}
            placeholder="Enter discount event"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setStartDay(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Kết thúc</p>
          <input
            type="date"
            value={finishDay}
            placeholder="Enter discount event"
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setFinishDay(e.target.value)}
          />
        </label>
      </Modal>
      <Modal
        title="Xóa sự kiện"
        open={showModalDelete}
        onOk={handleDeleteEvent}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>Bạn có muốn chắc xóa sự kiện này?</p>
      </Modal>
    </div>
  );
}

export default memo(AdminEvent);
