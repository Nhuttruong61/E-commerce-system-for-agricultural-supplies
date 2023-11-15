import React, { memo } from "react";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartCard from "./CartCard";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
function Cart({ setOpenCart }) {
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/checkout");
    setOpenCart(false);
  };
  return (
    <div
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20"
      onClick={() => setOpenCart(false)}
    >
      <div
        className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm slide-left-animation"
        onClick={(e) => e.stopPropagation()}
      >
        {cart && cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center ">
            <div className="flex w-full  p-2">
              <CloseOutlined onClick={() => setOpenCart(false)} />
            </div>
            <div className="w-full  h-full flex justify-center items-center">
              <p>Không có sản phẩm nào trong giỏ hàng!</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <div className="flex p-2">
                <CloseOutlined onClick={() => setOpenCart(false)} />
              </div>
              <div className="p-4 flex items-center">
                <ShoppingCartOutlined size={25} />
                <p className="pl-2 font-[500]">
                  {cart && cart.length} Sản phẩm
                </p>
              </div>
            </div>
            <div className="w-full border-t">
              {cart &&
                cart.map((item, index) => <CartCard key={index} item={item} />)}
            </div>
          </div>
        )}
        <div className="px-5 mb-3">
          {/* checkout buttons */}
          <Button
            className="h-[45px] flex items-center justify-center w-[100%] bg-[#009b49]  rounded-[5px]"
            onClick={handleNavigate}
            disabled={cart.length === 0}
          >
            <h1 className="text-[#fff] text-[18px] font-[600]">
              Đến trang thanh toán
            </h1>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(Cart);
