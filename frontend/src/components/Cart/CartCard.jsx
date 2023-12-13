import React, { memo, useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  getDataCart,
  increaseQuantity,
} from "../../redux/action/cartAction";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteProductToCart } from "../../service/userService";
function CartCard({ item }) {
  const { account } = useSelector((state) => state.user);
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
    if (account?.role === "business" && item.quantity >= 10) {
      const res = item.wholesalePrice * value;
      setTotalPrice(res);
    } else {
      const res = item.price * value;
      setTotalPrice(res);
    }
  }, [value]);
  const deteteProductCart = async (item) => {
    try {
      const res = await deleteProductToCart(account._id, { data: item });
      if (res.success) {
        dispatch(getDataCart());
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="border-b p-4 w-full ">
      <div className="w-full">
        <div>
          <div className="justify-between flex  items-center w-full">
            <div className="w-[30%]">
              <img src={item.image} alt="" className="md:w-[120px] w-[48px]" />
            </div>
            <div className="flex flex-col px-2 justify-center w-[60%]">
              <p className="font-[600]">{item.name}</p>
              <div className="flex justify-between">
                <p>{totalPrice?.toLocaleString()} đ</p>
                <div className="flex items-center justify-center border rounded ml-2">
                  <button
                    className="flex items-center px-1 bg-[#0e9c49] h-full"
                    disabled={value <= 1}
                    onClick={() => {
                      handleDecrease(item);
                    }}
                  >
                    <MinusOutlined className="text-white" />
                  </button>
                  <p className="px-2">{value}</p>
                  <button
                    className="flex items-center px-1 h-full bg-[#0e9c49]"
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
            <div
              className="w-[10%]flex justify-end hover:text-red-300 cursor-pointer"
              onClick={() => {
                deteteProductCart(item);
              }}
            >
              {" "}
              <AiOutlineDelete className="text-[18px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartCard);
