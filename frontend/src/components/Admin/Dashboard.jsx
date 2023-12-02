import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ComposedChartComponent from "../chart/ComposedChartComponent";
import BarChartNoPaddingComponent from "../chart/BarChartNoPaddingComponent";
import BarChartComponent from "../chart/BarChartComponent";
import { getAllUser } from "../../service/userService";
import VerticalComposedChart from "../chart/VerticalComposedChart";
import * as OrderSerVice from "../../service/orderService";
function Dashboard() {
  const products = useSelector((state) => state.product);
  const [dataUser, setDataUser] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const fetchDataUser = async () => {
    try {
      const res = await getAllUser();
      if (res.success) {
        setDataUser(res.users);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getAllOrders = async () => {
    const res = await OrderSerVice.getAllOrder();
    if (res.success) {
      setDataOrder(res.order);
    }
  };

  useEffect(() => {
    getAllOrders();
    fetchDataUser();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div className="md:flex py-2 w-full px-2">
        <div className=" h-auto grid md:grid-cols-5 grid-cols-1 w-full gap-2">
          <div className="h-full px-8 py-2 shadow rounded  flex flex-col justify-center ">
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tài khoản
            </p>
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tất cả
            </p>
            <p className="text-center text-[24px] font-[700]">
              {dataUser?.length}
            </p>
          </div>
          <div className="h-full px-8 py-2 shadow rounded  flex flex-col justify-center text-white bg-[#c795ff]">
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tài khoản
            </p>
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Thường
            </p>
            <p className="text-center text-[24px] font-[700]">
              {dataUser?.filter((admin) => admin.role === "user").length}
            </p>
          </div>
          <div className="h-full px-8 py-2 text-white shadow rounded  flex flex-col justify-center bg-[#328073]">
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tài khoản
            </p>
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Admin
            </p>
            <p className="text-center text-[24px] font-[700]">
              {dataUser?.filter((admin) => admin.role === "admin").length}
            </p>
          </div>
          <div className="h-full px-8 py-2 shadow rounded  flex flex-col justify-center bg-[#F7B48B]  text-white">
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tài khoản
            </p>
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Thành viên
            </p>
            <p className="text-center text-[24px] font-[700]">
              {dataUser?.filter((admin) => admin.role === "member").length}
            </p>
          </div>
          <div className="h-full px-8 py-2 shadow rounded  flex flex-col justify-center bg-[#e4d155] text-white">
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Tài khoản
            </p>
            <p className="md:text-[18px] text-[12px] font-[600] text-center">
              Doanh nghiệp
            </p>
            <p className="text-center text-[24px] font-[700]">
              {dataUser?.filter((admin) => admin.role === "business").length}
            </p>
          </div>
        </div>
      </div>
      <div className=" md:flex w-full py-2 ">
        <div className="h-[400px]  md:w-[50%] w-full flex-col ">
          <VerticalComposedChart user={dataUser} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ top 10 người dùng chi nhiều nhất
            </p>
          </div>
        </div>
        <div className="h-[400px] md:w-[50%] w-full flex-col md:my-0 my-10">
          <BarChartNoPaddingComponent products={products} />
          <div className="flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện 10 sản phẩm bán chạy nhất{" "}
            </p>
          </div>
        </div>
      </div>
      <div className=" md:flex w-full py-2 ">
        <div className="h-[400px] md:w-[50%] w-full flex-col ">
          <ComposedChartComponent orders={dataOrder} />
          <div className="flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện doanh thu theo từng tháng{" "}
            </p>
          </div>
        </div>
        <div className="h-[400px] md:w-[50%] w-full flex-col ">
          <BarChartComponent orders={dataOrder} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện doanh thu các tuần trong tháng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Dashboard);
