import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrder } from "../../redux/action/orderAction";
import { ArrowRightOutlined } from "@ant-design/icons";
import TableComponent from "../common/Table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
function ProfileOrder() {
  const { account } = useSelector((state) => state.user);
  const orders = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUserOrder(account._id));
  }, []);
  const navigate = useNavigate();
  const renderAction = (text, item) => {
    return (
      <div onClick={() => handleDetail(item)}>
        <ArrowRightOutlined className="cursor-pointer" />
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "sst",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Số sản phẩm",
      dataIndex: "quality",
      sorter: (a, b) => a.quality - b.quality,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment",
      render: (payment) => {
        return payment === "paymentDelivery"
          ? "Thanh toán trực tiếp"
          : "Thanh toán online";
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Chi tiết",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  let dataTable = [];
  if (orders && orders.data?.length > 0) {
    dataTable = orders?.data
      .map((order, index) => {
        let statusText = "";
        if (order.status === "Cancel") {
          statusText = "Đã hủy";
        } else if (order.status === "Transferred") {
          statusText = "Đang vận chuyển";
        } else if (order.status === "Processing") {
          statusText = "Chờ xử lý";
        } else if (order.status === "Delivered") {
          statusText = "Đã giao hàng";
        }

        return {
          ...order,
          sst: index + 1,
          name: order?.cart[0]?.name,
          quality: order?.cart?.length,
          payment: order?.paymentInfo?.type,
          status: statusText,
          createdAt: moment(order?.paymentInfo.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        };
      })
      .filter((order) => order !== null);
  }

  const handleDetail = (item) => {
    navigate(`/information/order/${item._id}`);
  };
  return (
    <div className="w-full ">
      <TableComponent columns={columns} data={dataTable} />
    </div>
  );
}

export default ProfileOrder;
