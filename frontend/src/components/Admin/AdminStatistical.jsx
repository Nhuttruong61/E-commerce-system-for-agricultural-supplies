import React, { useEffect, useState } from "react";
import * as OrderSerVice from "../../service/orderService";
import ComposedChartComponent from "../chart/ComposedChartComponent";
import BarChartComponent from "../chart/BarChartComponent";
import CustomizedLabelLineChart from "../chart/CustomizedLabelLineChart";
import { useSelector } from "react-redux";
function AdminStatistical() {
  const { data } = useSelector((state) => state.product);
  const [dataOrder, setDataOrder] = useState([]);
  const getAllOrders = async () => {
    const res = await OrderSerVice.getAllOrder();
    if (res.success) {
      setDataOrder(res.order);
    }
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  const totalPrice = dataOrder?.reduce((acc, item) => {
    if (item.paymentInfo.status === "Đã thanh toán") {
      return (acc += item.totalPrice);
    }
    return acc;
  }, 0);
  const totalCostPrice = dataOrder
    .filter((el) => el.paymentInfo.status === "Đã thanh toán")
    .map((el) => el.cart)
    .flat()
    .reduce((acc, el) => {
      return (acc += (el.price !== undefined ? el.price : 0) * el.quantity);
    }, 0);

  const dataGifts = dataOrder
    .filter((el) => el.paymentInfo.status === "Đã thanh toán")
    .map((el) => el.cart)
    .flat()
    .filter((el) => el.price === undefined);
  const takePriceGifts = dataGifts.map((gift) => {
    const priceProduct = data.find((product) => product._id === gift._id);
    if (priceProduct) {
      return { ...gift, price: priceProduct.price };
    }
    return gift;
  });
  const totalPriceGift = takePriceGifts.reduce(
    (acc, el) => (acc += el.price * el.quantity),
    0
  );

  const totalProfit = totalPrice - (totalCostPrice + totalPriceGift);

  return (
    <div className="w-full">
      <div className=" grid xl:grid-cols-4 md:grid-cols-2 w-full py-2 gap-2 grid-cols-1">
        <div className="px-4 py-2 flex shadow">
          <p className="font-[600] text-[20px] pr-2">Tổng doanh thu:</p>
          <p className="text-[20px]"> {totalPrice.toLocaleString()} đ</p>
        </div>
        <div className="px-4 py-2 flex shadow bg-[#328073] text-white">
          <p className="font-[600] text-[20px] pr-2">Tổng giá nhập:</p>
          <p className="text-[20px]"> {totalCostPrice.toLocaleString()} đ</p>
        </div>
        <div className="px-4 py-2 flex shadow bg-[#F7B48B] text-white">
          <p className="font-[600] text-[20px] pr-2">Chi phí quà tặng:</p>
          <p className="text-[20px]">
            {" "}
            {totalPriceGift ? totalPriceGift.toLocaleString() : 0} đ
          </p>
        </div>
        <div className="px-4 py-2 flex shadow bg-[#e4d155] text-white">
          <p className="font-[600] text-[20px] pr-2 ">Tổng lợi nhuận</p>
          <p className="text-[20px]"> {totalProfit.toLocaleString()} đ</p>
        </div>
      </div>
      <div className=" my-10 md:flex w-full py-2 ">
        <div className="h-[400px] md:w-[50%] w-full flex-col ">
          <ComposedChartComponent orders={dataOrder} />
          <div className="flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện doanh thu theo từng tháng{" "}
            </p>
          </div>
        </div>
        <div className="h-[400px] md:w-[50%] w-full">
          <BarChartComponent orders={dataOrder} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện doanh thu các tuần trong tháng
            </p>
          </div>
        </div>
      </div>
      <div className="my-10 md:flex w-full py-2">
        <div className="h-[400px] md:w-[50%] w-full md:my-0 my-10">
          <CustomizedLabelLineChart orders={dataOrder} />
          <div className="w-full flex justify-center">
            <p className="font-[600]">
              Biểu đồ thể hiện doanh thu các ngày trong tuần
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStatistical;
