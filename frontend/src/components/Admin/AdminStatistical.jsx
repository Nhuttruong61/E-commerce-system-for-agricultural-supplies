import React from "react";
import { useSelector } from "react-redux";
import ComposedChartComponent from "../chart/ComposedChartComponent";
import BarChartComponent from "../chart/BarChartComponent";
import CustomizedLabelLineChart from "../chart/CustomizedLabelLineChart";
function AdminStatistical() {
  const orders = useSelector((state) => state.order);
  const totalPrice = orders?.data.reduce((acc, item) => {
    if (item.paymentInfo.status === "Đã thanh toán") {
      return (acc += item.totalPrice);
    }
    return acc;
  }, 0);
  return (
    <div className="w-full">
      <div className=" flex w-full py-2">
        <div className="h-[400px] w-[50%] flex-col ">
          <div className="px-4 py-2 flex">
            <p className="font-[600] text-[20px] pr-2">Tổng danh thu:</p>
            <p className="text-[20px]"> {totalPrice.toLocaleString()} đ</p>
          </div>
        </div>
        <div className="h-[400px] w-[50%] flex-col ">
          <ComposedChartComponent orders={orders} />
          <div className="flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện danh thu theo từng tháng{" "}
            </p>
          </div>
        </div>
      </div>
      <div className=" my-10 flex w-full py-2">
        <div className="h-[400px] w-[50%]">
          <BarChartComponent orders={orders} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện danh thu các tuần trong tháng
            </p>
          </div>
        </div>
        <div className="h-[400px] w-[50%]">
          <CustomizedLabelLineChart orders={orders} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện danh thu các ngày trong tuần
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStatistical;
