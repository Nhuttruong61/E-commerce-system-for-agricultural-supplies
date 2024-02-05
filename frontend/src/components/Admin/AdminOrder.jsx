import React, { memo, useEffect, useRef, useState } from "react";
import * as OrderSerVice from "../../service/orderService";
import TableComponent from "../common/Table";
import { Button, Modal, Select, Space } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

import { toast } from "react-toastify";
import PieChartComponent from "../chart/PieChartComponet";
import moment from "moment";
import Loading from "../common/Loading";

function AdminOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [idOrder, setIdOrder] = useState("");
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [showModalSeeMore, setShowModalSeeMore] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [dataSeeMore, setDataSeeMore] = useState(null);
  const [dataExportAUser, setDataExportAUser] = useState(null);
  const [showModalPrint, setShowModalPrint] = useState(false);
  const getAllOrders = async () => {
    setIsLoading(true);
    const res = await OrderSerVice.getAllOrder();
    setIsLoading(false);
    if (res.success) {
      setDataOrder(res.order);
    }
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="flex flex-row-reverse"
          onClick={() => {
            setDataExportAUser(item);
            setShowModalPrint(true);
          }}
        >
          <PrinterOutlined className="text-[#009b49] border text-[20px] border-[#009b49] py-2 px-1 rounded-[4px] mx-1" />
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setIdOrder(item.id);
            setshowModalDelete(true);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px] text-[20px]" />
        </div>
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
    try {
      const res = await OrderSerVice.updateOrderStatus(id, status);
      setIsLoading(false);
      if (res.success) {
        setIsLoading(false);
        toast.success("Cập nhật trạng thái thành công");
        getAllOrders();
      }
    } catch (e) {
      setIsLoading(false);
      switch (e.response.status) {
        case 401:
          toast.error("Sản phẩm này không còn bán nữa");
          break;
        case 405:
          toast.warning("Sản phẩm trong kho không đủ số lượng");
          break;
        default:
      }
    }
  };
  const vietnameseStatus = {
    Processing: "Chờ xử lý",
    Transferred: "Đã chuyển hàng",
    Delivered: "Đã giao hàng",
    Cancel: "Đã hủy",
  };
  const handleRenderStatus = (text, item) => {
    const translatedStatus = vietnameseStatus[item.status] || item.status;

    if (item.status === "Cancel" || item.status === "Delivered") {
      return <span>{translatedStatus}</span>;
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
              {vietnameseStatus[option] || option}
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
            Thoát
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
      title: "Người dùng",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (product) => {
        const productName = product.map((item) => item.name).join(", ");
        return productName;
      },
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentInfo",
      render: (paymentInfo) => {
        return paymentInfo === "paymentDelivery"
          ? "Thanh toán trực tiếp"
          : "Thanh toán online";
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentInfoStatus",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Chờ xử lý",
          value: "Processing",
        },
        {
          text: "Đã chuyển hàng",
          value: "Transferred",
        },
        {
          text: "Đã giao hàng",
          value: "Delivered",
        },
        {
          text: "Đã hủy",
          value: "Cancel",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: handleRenderStatus,
    },
    {
      title: "Xem thêm",
      dataIndex: "more",
      render: renderSeeMore,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (dataOrder && dataOrder.length > 0) {
    dataTable = dataOrder.map((order, index) => {
      return {
        key: order._id,
        id: order._id,
        stt: index + 1,
        name: order.user.name,
        phone: order.user.phoneNumber,
        product: order.cart,
        paymentInfo: order.paymentInfo.type,
        paymentInfoStatus: order.paymentInfo.status,
        address: order.shippingAddress.address,
        totalPrice: order.totalPrice,
        date: moment(order.paymentInfo.createdAt).format("YYYY-MM-DD HH:mm:ss"),
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
    setShowModalPrint(false);
  };
  const handleDeleteOrder = async () => {
    try {
      setshowModalDelete(false);
      setIsLoading(true);
      const res = await OrderSerVice.deleteOrder(idOrder);
      setIsLoading(false);
      if (res.success) {
        toast.success("Xóa đơn hàng hành công");
        getAllOrders();
      }
    } catch (e) {
      if (e.response.status === 401) {
        toast.error("Bạn không thể xóa đơn hàng khi đang vận chuyển");
      }
      if (e.response.status === 402) {
        toast.error(
          "Bạn không thể xóa đơn hàng chờ xử lý khi thanh toán online"
        );
      }
      setIsLoading(false);
      console.log(e);
    }
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleExportOrder = () => {
    setShowModalPrint(false);
    html2canvas(document.querySelector("#pdf-content")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(
        { imageData: imgData, format: "PNG", x: 0, y: 0, autoResize: true },
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );
      pdf.save("order.pdf");
    });
  };
  return (
    <div className="w-full">
      <div className="flex">
        <div className="md:flex md:w-[50%]  md:flex-col w-full px-2">
          <div className="h-[180px] w-[180px]">
            <PieChartComponent order={dataOrder} />
          </div>
          <p className="font-[600]">Biểu đồ thể hiện trại thái của đơn hàng</p>
        </div>
      </div>

      <div className="w-full justify-center items-center">
        <TableComponent
          columns={columns}
          data={dataTable}
          isLoading={isLoading}
        />
      </div>
      <Modal
        title="Thông tin đơn hàng"
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
                            {`${(isNaN(item.price) || isNaN(item.quantity)
                              ? 0
                              : item.price * item.quantity
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
                Thông tin đơn hàng
              </p>
              <div className="flex justify-between">
                <div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Tên:
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
                      Điện thoại:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.user.phoneNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Thành phố:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.city}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[50%] md:text-[100%] font-[600] pr-2">
                      Địa chỉ:
                    </p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataSeeMore?.shippingAddress.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-auto  items-center bg-white px-[10%] my-1  md:flex md:justify-between">
            <div>
              <p className="text-[50%] md:text-[100%] font-[600] pt-2 ">
                Tổng thanh toán
              </p>
              <p className="text-[50%] md:text-[100%] font-[600] pt-2 text-red-600">
                {dataSeeMore?.totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Xóa sản đơn hàng"
        open={showModalDelete}
        onOk={handleDeleteOrder}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chăc xóa đơn hàng này?`} </p>
      </Modal>
      <Modal
        title="In hóa đơn"
        open={showModalPrint}
        onOk={handleExportOrder}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
        width={800}
      >
        <div id="pdf-content" className="w-full">
          <div className="w-full p-5 px-[10%]">
            {dataExportAUser?.product?.length > 0 ? (
              <div>
                {dataExportAUser?.product?.map((item) => {
                  return (
                    <div key={item.id} className="flex border-t py-2">
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
                            {`${(isNaN(item.price) || isNaN(item.quantity)
                              ? 0
                              : item.price * item.quantity
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
              <p className="text-[16px] font-[600] pt-2 ">Thông tin đơn hàng</p>
              <div className="flex justify-between">
                <div>
                  <div className="flex">
                    <p className="Text-[14px] pr-2">Tên:</p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataExportAUser?.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="Text-[14px] pr-2">Điện thoại:</p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataExportAUser?.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <p className="Text-[14px] pr-2">Địa chỉ:</p>
                    <p className="text-[50%] md:text-[100%]">
                      {dataExportAUser?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-auto  items-center bg-white px-[10%] my-1 ">
            <div>
              <p className="Text-[14px] pt-2 ">Trạng thái</p>
              <p className="Text-[14px] pt-2 text-red-600">
                {dataExportAUser?.paymentInfoStatus}
              </p>
            </div>
            <div>
              <p className="Text-[14px] pt-2 ">Tổng thanh toán</p>
              <p className="Text-[14px] pt-2 text-red-600">
                {dataExportAUser?.totalPrice.toLocaleString()} đ
              </p>
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AdminOrder);
