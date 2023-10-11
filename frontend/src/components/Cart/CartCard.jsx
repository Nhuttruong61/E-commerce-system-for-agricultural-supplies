import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cartAction";
function CartCard({ item }) {
  const [value, setValue] = useState(item.quantity);
  const [totalPrice, setTotalPrice] = useState(null);
  const dispatch = useDispatch();
  const handleIncreate = (item) => {
    setValue((pre) => pre + 1);
    dispatch(
      increaseQuantity({
        ...item,
        quantity: item.quantity + (1 - item.quantity),
      })
    );
  };
  const handleDecrease = (item) => {
    setValue((pre) => pre - 1);
    dispatch(
      decreaseQuantity({
        ...item,
        quantity: item.quantity - (item.quantity - 1),
      })
    );
  };
  useEffect(() => {
    const res = item.price * value;
    setTotalPrice(res);
  }, [value]);
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div className="justify-center flex">
            <img src={item.image} alt="" className="md:w-[120px] w-[48px]" />
            <div className="flex flex-col px-2 justify-center">
              <p className="font-[600]">{item.name}</p>
              <div className="flex justify-between">
                <p>{totalPrice?.toLocaleString()} đ</p>
                <div className="flex items-center justify-center border rounded ml-2">
                  <button
                    className="flex items-center px-1 bg-[#4b8600] h-full"
                    disabled={value <= 0}
                    onClick={() => {
                      handleDecrease(item);
                    }}
                  >
                    <MinusOutlined className="text-white" />
                  </button>
                  <p className="px-2">{value}</p>
                  <button
                    className="flex items-center px-1 h-full bg-[#4b8600]"
                    disabled={value >= item.quantityProduct}
                    onClick={() => {
                      handleIncreate(item);
                    }}
                  >
                    <PlusOutlined className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
