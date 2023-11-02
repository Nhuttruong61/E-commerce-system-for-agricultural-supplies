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

  return (
    <Steps
      items={item}
      current={current}
      className="px-[10%] py-4  "
      progressDot={false}
    />
  );
}

export default memo(CheckoutSteps);
