import React, { memo } from "react";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartCard from "./CartCard";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../../assets/css/left.css";
function Cart({ setOpenCart }) {
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/checkout");
    setOpenCart(false);
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20 ">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm slide-left-animation">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <CloseOutlined onClick={() => setOpenCart(false)} />
            </div>
            <p>Không có sản phẩm nào trong giỏ hàng!</p>
          </div>
        ) : (
          <div>
            <div className="flex w-full justify-end pt-5 pr-5">
              <CloseOutlined onClick={() => setOpenCart(false)} />
            </div>
            <div className="p-4 flex items-center">
              <ShoppingCartOutlined size={25} />
              <p className="pl-2  font-[500]">{cart && cart.length} Sản phẩm</p>
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
