import React from "react";
import { Spin } from "antd";
function LoadingCpn() {
  return <Spin spinning={true} delay={200} size="large"></Spin>;
}

export default LoadingCpn;
