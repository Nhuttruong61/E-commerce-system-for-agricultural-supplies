import React, { useEffect, useRef, useState } from "react";
import * as OrderSerVice from "../../service/orderService";
import TableComponent from "../Table";
import { Button, Modal, Select, Space } from "antd";
import { SearchOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { CiExport } from "react-icons/ci";
import { toast } from "react-toastify";

function AdminOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [dataOrder, setDataOrder] = useState([]);
  const [idOrder, setIdOrder] = useState("");
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [showModalSeeMore, setShowModalSeeMore] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSeeMore, setDataSeeMore] = useState(null);
  const [dataExport, setDataExport] = useState([]);
  const getAllOrders = async () => {
    setIsLoading(true);
    const res = await OrderSerVice.getAllOrder();
    if (res.success) {
      setDataOrder(res.order);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  const renderAction = (text, item) => {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          setIdOrder(item.id);
          setshowModalDelete(true);
        }}
      >
        <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
      </div>
    );
  };
  const renderSeeMore = (text, item) => {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          setDataSeeMore(item.more);
          setShowModalSeeMore(true);
        }}
      >
        <EyeOutlined className="text-blue-600 border border-[blue] py-2 px-1 rounded-[4px]" />
      </div>
    );
  };
  const handleStatusChange = async (id, value) => {
    setIsLoading(true);
    const status = {
      status: value,
    };
    const res = await OrderSerVice.updateOrderStatus(id, status);
    if (res.success) {
      toast.success("Updated order status successfully");
      getAllOrders();
    }
    setIsLoading(false);
  };

  const handleRenderStatus = (text, item) => {
    if (item.status === "Cancel" || item.status === "Delivered") {
      return <span>{item.status}</span>;
    } else {
      const options =
        item.status === "Processing"
          ? ["Processing", "Transferred"]
          : ["Transferred", "Delivered"];

      return (
        <Select
          value={item.status}
          onChange={(value) => handleStatusChange(item.id, value)}
        >
          {options.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      );
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
      title: "User",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "address",
      dataIndex: "address",
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (product) => {
        const productName = product.map((item) => item.name).join(", ");
        return productName;
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentInfo",
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: handleRenderStatus,
    },
    {
      title: "More",
      dataIndex: "more",
      render: renderSeeMore,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataOrder && dataOrder.length > 0) {
    dataTable = dataOrder.map((order) => {
      return {
        key: order._id,
        id: order._id,
        name: order.user.name,
        phone: order.user.phoneNumber,
        product: order.cart,
        paymentInfo: order.paymentInfo.type,
        address: order.shippingAddress.address,
        totalPrice: order.totalPrice,
        status: order.status,
        more: {
          ...order,
        },
      };
    });
  }
  const handleSeeMore = () => {
    setShowModalSeeMore(false);
  };
  const handleCancel = () => {
    setShowModalSeeMore(false);
    setshowModalDelete(false);
  };
  const handleDeleteOrder = async () => {
    setshowModalDelete(false);
    setIsLoading(true);
    const res = await OrderSerVice.deleteOrder(idOrder);
    if (res.success) {
      toast.success("Order deleted successfully");
      getAllOrders();
    }
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleExportOrder = () => {
    let res = [];
    if (dataTable && dataTable.length > 0) {
      dataTable.forEach((item) => {
        const products = item.product
          .map((product) => {
            return `${product.name} (${product.quantity})`;
          })
          .join(", ");
        let orders = {
          _id: item.id,
          product: products,
          name: item.name,
          address: item.address,
          phone: item.phone,
          payment: item.paymentInfo,
          price: item.totalPrice,
        };
        res.push(orders);
      });
      setDataExport(res);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-row-reverse p-2 ">
        <CSVLink
          filename="order.csv"
          className="border-[2px] flex justify-center rounded items-center px-2 py-1 bg-[#73c509]  text-white"
          onClick={handleExportOrder}
          data={dataExport}
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
      </div>
      <Modal
        title="Information order"
        open={showModalSeeMore}
        onOk={handleSeeMore}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        cancelButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <div className="w-full">
          <div className="w-full p-5 px-[10%]">
            {dataSeeMore?.cart?.length > 0 ? (
              <div>
                {dataSeeMore.cart.map((item) => {
                  return (
                    <div key={item.id} className="flex border-t py-2">
                      <div className="md:w-[10%] w-[30%]">
                        <img
                          src={item.image}
                          alt=""
                          className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] "
                        />
                      </div>
                      <div className="md:w-[90%] w-[70%] flex md:items-center md:justify-between  flex-col md:flex-row ">
                        <p className="text-[50%] md:text-[100%] px-4 md:w-[30%] ">
                          {item.name}
                        </p>
                        <div className="flex items-center md:justify-center  ml-2 md:w-[50%]  ">
                          <p className="text-[50%] md:text-[100%] px-2">
                            Số lượng:
                          </p>
                          <p className="px-2 text-[50%] md:text-[100%]">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="flex md:items-center md:justify-center  ml-2 md:w-[30%] ">
                          <p className="text-[50%] md:text-[100%] px-2">
                            Giá tiền:
                          </p>
                          <p className="text-[50%] md:text-[100%]">
                            {`${(
                              item.price * item.quantity
                            ).toLocaleString()} đ`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="w-full  items-center bg-white px-[10%] my-1  md:flex md:justify-between">
            <div className="w-full">
              <p className="text-[50%] md:text-[100%] font-[600] pt-2 ">
                Client information
              </p>
              <div className="flex justify-between">
                <div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Name:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.user.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Email:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.user.email}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Phone:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.user.phoneNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      country:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.country}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      city:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.city}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      address:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.address}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      addressType:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.addressType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-auto  items-center bg-white px-[10%] my-1  md:flex md:justify-between">
            <div>
              <p className="text-[50%] md:text-[100%] font-[600] pt-2 ">
                Total payment
              </p>
              <p className="text-[50%] md:text-[100%] font-[600] pt-2 text-red-600">
                {dataSeeMore?.totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Delete"
        open={showModalDelete}
        onOk={handleDeleteOrder}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Are you sure you want to delete this order?`} </p>
      </Modal>
    </div>
  );
}

export default AdminOrder;
