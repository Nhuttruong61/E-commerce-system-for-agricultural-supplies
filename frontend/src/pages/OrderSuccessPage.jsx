import React from "react";
import Footer from "../components/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Lottie from "react-lottie";
import * as Animation from "../assets/animation/animation.json";
const OrderSuccessPage = () => {
  return (
    <div>
      <CheckoutSteps current={3} />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Bạn đã đặt hàng thành công 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
