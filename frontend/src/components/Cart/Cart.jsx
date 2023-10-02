import React from "react";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartCard from "./CartCard";
import { Link } from "react-router-dom";

function Cart({ setOpenCart }) {
  const cart = [
    {
      name: "PHÂN HỮU CƠ ĐA DỤNG POTAMINO REDGREEN",
      image:
        "https://huucosinhhoc.com/wp-content/uploads/2023/07/z4549368851346_09a6ed4fedbf2616cf41b01eb135da8f.jpg",
      desciption:
        "PotAmino là một công thức hữu cơ đặc biệt với sự bổ sung hàm lượng Đạm và Kali, các Amino Acid tự do và các nguyên tố trung vi lượng.",
      price: 570000,
    },
  ];
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-20">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
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
              {cart && cart.map((item, index) => <CartCard item={item} />)}
            </div>
          </div>
        )}
        <div className="px-5 mb-3">
          {/* checkout buttons */}
          <Link to="/checkout">
            <div className="h-[45px] flex items-center justify-center w-[100%] bg-[#73c509] hover:bg-[#518B06] rounded-[5px]">
              <h1 className="text-[#fff] text-[18px] font-[600]">
                Đến trang thanh toán
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
