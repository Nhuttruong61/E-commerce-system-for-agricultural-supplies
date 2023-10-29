import React, { memo } from "react";
import { Steps } from "antd";

function CheckoutSteps({ current }) {
  const item = [
    {
      title: "Xử lý",
    },
    {
      title: "Thanh toán",
    },
    {
      title: "Thành công",
    },
  ];

  const stepsStyle = {
    borderColor: "#4caf50",
    color: "white",
  };
  return (
    <Steps
      items={item}
      style={stepsStyle}
      current={current}
      className="md:px-[10%] py-4"
    />
  );
}

export default memo(CheckoutSteps);
