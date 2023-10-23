import React from "react";
import { useSelector } from "react-redux";
import ComposedChartComponent from "../chart/ComposedChartComponent";

function Statistical() {
  const products = useSelector((state) => state.product);
  const orders = useSelector((state) => state.orders);

  console.log("orders", orders);
  return (
    <div className=" flex">
      <div className="h-[400px] w-[400px] flex-col ">
        <ComposedChartComponent orders={orders} />
        <div className="flex justify-center">
          <p className="font-[600]">
            Biểu đồ thể hiện danh thu 6 tháng gần nhất{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
