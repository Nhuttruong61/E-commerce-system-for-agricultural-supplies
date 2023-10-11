import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cartAction";
function CheckOutContent() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const handleIncreate = (item) => {
    dispatch(
      increaseQuantity({
        ...item,
        quantity: item.quantity + (1 - item.quantity),
      })
    );
  };
  const handleDecrease = (item) => {
    dispatch(
      decreaseQuantity({
        ...item,
        quantity: item.quantity - (item.quantity - 1),
      })
    );
  };
  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cart]);
  return (
    <div className="">
      <div className="w-full p-5 pb-8 px-[10%]">
        {cart.map((item) => {
          return (
            <div className="flex border-t py-2">
              <div className="md:w-[10%] w-[30%]">
                <img
                  src={item.image}
                  alt=""
                  srcset=""
                  className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] "
                />
              </div>
              <div className="md:w-[90%] w-[70%] flex md:items-center md:justify-between  flex-col md:flex-row ">
                <p className="text-[50%] md:text-[100%] px-4 md:w-[30%] ">
                  {item.name}
                </p>
                <div className="flex items-center md:justify-center  ml-2 md:w-[50%]  ">
                  <p className="text-[50%] md:text-[100%] px-2">Số lượng:</p>
                  <div className="flex items-center justify-center  rounded ml-2">
                    <button
                      className="flex items-center p-1 bg-[#4b8600] h-full rounded"
                      onClick={() => {
                        handleDecrease(item);
                      }}
                    >
                      <MinusOutlined className="text-white" />
                    </button>
                    <p className="px-2">{item.quantity}</p>
                    <button
                      className="flex items-center p-1 h-full bg-[#4b8600] rounded"
                      disabled={item.quantity >= item.quantityProduct}
                      onClick={() => {
                        handleIncreate(item);
                      }}
                    >
                      <PlusOutlined className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="flex md:items-center md:justify-center  ml-2 md:w-[30%] ">
                  <p className="text-[50%] md:text-[100%] px-2">Giá tiền:</p>
                  <p className="text-[50%] md:text-[100%]">
                    {`${(item.price * item.quantity).toLocaleString()} đ`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className=""></div>
      </div>
      <div className="flex flex-row-reverse md:px-8 w-full shadow shadow-black bottom-[41%] py-2 bg-white items-center">
        <button className="bg-[#4b8600] text-white px-2 font-[600] py-1 rounded">
          Thanh toán
        </button>
        <p className="px-2 text-[50%] md:text-[100%] font-[600] text-red-600">
          {totalPrice.toLocaleString()} đ
        </p>
        <p className="text-[50%] md:text-[100%] font-[600] ">Tổng số tiền: </p>
      </div>
    </div>
  );
}

export default CheckOutContent;
