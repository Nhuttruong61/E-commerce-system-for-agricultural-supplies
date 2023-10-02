import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrder } from "../../redux/action/orderAction";
import { ArrowRightOutlined } from "@ant-design/icons";
import TableComponent from "../Table";
import { useNavigate } from "react-router-dom";
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
      title: "Mã hàng",
      dataIndex: "_id",
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
  if (orders && orders.data.length > 0) {
    dataTable = orders?.data.map((order) => {
      return {
        ...order,
        name: order?.cart[0].name,
        quality: order?.cart?.length,
        status:
          order?.status === "Transferred" ? "Đang vận chuyển" : "Chờ xử lý",
      };
    });
  }
  const handleDetail = (item) => {
    navigate(`/information/order/${item._id}`);
  };
  return (
    <div className="w-full overflow-x-auto">
      <TableComponent columns={columns} data={dataTable} />
    </div>
  );
}

export default ProfileOrder;
