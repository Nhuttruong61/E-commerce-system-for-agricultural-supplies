import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, MinusOutlined, RightOutlined } from "@ant-design/icons";
import {
  clearQuantity,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cartAction";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { updateAddress } from "../../service/userService";
import { getUser } from "../../redux/action/userAction";
import { getAllFee } from "../../redux/action/feeAction";
import Loading from "../Loading";
import * as OrderService from "../../service/orderService";
import * as PaymentService from "../../service/payment";

import { useNavigate } from "react-router-dom";
function CheckOutContent() {
  const { cart } = useSelector((state) => state.cart);
  const { account } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.fee);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModalAddress, setShowModalAddress] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const [newAddressType, setNewAddressType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Paymentethods, setPaymentMethod] = useState("paymentDelivery");
  const [price, setPrice] = useState();
  const [shipCost, setShipCost] = useState(0);

  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  const encodedParams = queryParams.toString();

  const navigate = useNavigate();
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
    dispatch(getAllFee());
  }, []);
  useEffect(() => {
    const cost = data[0].cost;
    const freeShip = data[0].freeShipping;
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    setPrice(total);
    if (total >= freeShip) {
      setTotalPrice(total);
      setShipCost(0);
    } else {
      setTotalPrice(total + cost);
      setShipCost(cost);
    }
  }, [cart, data]);
  useEffect(() => {
    if (account?.addresses.length === 0) {
      setShowModalAddress(true);
    } else {
      setShowModalAddress(false);
    }
  }, [account]);
  useEffect(() => {
    if (account?.addresses) {
      for (let i = 0; i < account.addresses.length; i++) {
        const item = account.addresses[i];
        setCountry(item.country);
        setCity(item.city);
        setAddress(item.address);
        setAddressType(item.addressType);
      }
    }
  }, [account]);
  const handleOnchangeCountry = (e) => setCountry(e.target.value);
  const handleOnchangeCity = (e) => setCity(e.target.value);
  const handleOnchangeAddress = (e) => setAddress(e.target.value);
  const handleOnchangaAddressType = (e) => setAddressType(e.target.value);
  const handleOnchangaNewAddressType = (e) => {
    setNewAddressType(e.target.value);
  };

  const handleCancel = () => {
    setShowModalAddress(false);
  };
  const handleEditAddress = async () => {
    setShowModalAddress(false);
    const finalAddressType =
      addressType === "other" ? newAddressType : addressType;
    if (!country || !city || !address) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
    } else {
      const addressUser = {
        country: country,
        city: city,
        address: address,
        addressType: finalAddressType,
      };
      setIsLoading(true);
      const update = await updateAddress(addressUser);
      if (update.success) {
        dispatch(getUser());
        toast.success("Thay đổi địa chỉ thành công");
      } else {
        toast.error("Đã có lỗi xãy ra vui lòng thử lại sao");
      }
    }
  };
  const okButtonAdd = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
  const handleOrder = async () => {
    if (account?.addresses.length === 0) {
      setShowModalAddress(true);
    } else {
      const order = {
        cart,
        user: account,
        totalPrice: totalPrice,
        shippingAddress: {
          country,
          city,
          address,
          addressType,
        },
        paymentInfo: {
          type: Paymentethods,
          status: "Chưa thanh toán",
        },
      };
      if (order.paymentInfo.type === "") {
        toast.warning("Bạn chưa chọn phương thức thanh toán");
      } else {
        const res = await OrderService.createOrder(order);
        if (res.success) {
          navigate("/order/seccess");
          dispatch(clearQuantity());
        }
      }
    }
  };
  const handlePayment = async () => {
    if (account?.addresses.length === 0) {
      setShowModalAddress(true);
    } else {
      const order = {
        amount: totalPrice,
      };
      const res = await PaymentService.payment(order);
      if (res.success) {
        window.location.href = res.paymentUrl;
      }
    }
  };
  const handleOrderPayment = async () => {
    const res = await PaymentService.peymentReturn(encodedParams);
    if (res.Message === "Success" && res.RspCode === "00") {
      if (account?.addresses.length !== 0 && totalPrice !== 0) {
        const order = {
          cart,
          user: account,
          totalPrice: totalPrice,
          shippingAddress: {
            country: account?.addresses[0].country,
            city: account?.addresses[0].city,
            address: account?.addresses[0].address,
            addressType: account?.addresses[0].addressType,
          },
          paymentInfo: {
            type: Paymentethods,
            status: "Đã thanh toán",
          },
        };
        const res = await OrderService.createOrder(order);
        if (res.success) {
          navigate("/order/seccess");
          dispatch(clearQuantity());
        }
      }
    }
  };
  useEffect(() => {
    if (account?.addresses.length !== 0) {
      handleOrderPayment();
    }
  }, [encodedParams, account]);
  return (
    <Loading isLoading={isLoading}>
      <div>
        <div className="w-full p-5 pb-8 px-[10%]">
          {cart.map((item) => {
            return (
              <div key={item._id} className="flex border-t py-2">
                <div className="md:w-[10%] w-[30%]">
                  <img
                    src={item.image}
                    alt=""
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
        </div>
        <div className="w-auto md:flex items-center bg-white px-[10%] my-1">
          <div
            className="cursor-pointer"
            onClick={() => setShowModalAddress(true)}
          >
            <p className="text-[50%] md:text-[100%] font-[600] pt-2 text-red-600">
              Địa chỉ nhận hàng
            </p>
            {account?.addresses.length > 0 ? (
              <div>
                <p className="text-[50%] md:text-[100%] ">
                  {account?.addresses[0].city}
                </p>
                <p className="text-[50%] md:text-[100%]">
                  {account?.addresses[0].address}
                </p>
              </div>
            ) : null}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setShowModalAddress(true)}
          >
            <RightOutlined className="md:text-[24px]" />
          </div>
        </div>
        <div className="w-auto  items-center bg-white px-[10%] my-1 ">
          <p className="text-[50%] md:text-[100%] font-[600] pt-2 text-red-600">
            Phương thức thanh toán
          </p>
          <select
            value={Paymentethods}
            className="w-auto h-auto py-2 border  rounded-[4px] px-2 my-2 focus:outline-none"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="paymentDelivery">Thanh toán khi nhận hàng</option>
            <option value="onlinePayment">Thanh toán qua VNPAY</option>
          </select>
        </div>
        {Paymentethods === "paymentDelivery" && (
          <div className="flex flex-row-reverse md:px-8 w-full shadow shadow-black bottom-[41%] py-2 bg-white items-center">
            <div className="flex flex-col ">
              <p className="text-[50%] md:text-[100%] font-[600] ">
                Chi tiết thanh toán:{" "}
              </p>
              <span className="flex">
                <p className="text-[50%] md:text-[90%] font-[600]">
                  Tổng tiền hàng:{" "}
                </p>
                <p className="text-[50%] md:text-[90%] pl-2">
                  {price?.toLocaleString()}đ
                </p>
              </span>
              <span className="flex">
                <p className="text-[50%] md:text-[90%] font-[600]">
                  Tổng phí vận chuyển:{" "}
                </p>
                <p className="text-[50%] md:text-[90%] pl-2">
                  {shipCost?.toLocaleString()}đ
                </p>
              </span>
              <span className="flex">
                <p className="text-[50%] md:text-[90%] font-[600]">
                  Tổng thanh toán:{" "}
                </p>
                <p className="text-[50%] md:text-[90%] pl-2">
                  {totalPrice.toLocaleString()}đ
                </p>
              </span>
            </div>
          </div>
        )}
        {Paymentethods === "paymentDelivery" && (
          <div className="flex flex-row-reverse md:px-8 w-full shadow shadow-black bottom-[41%] py-2 bg-white items-center">
            <button
              className="bg-[#4b8600] text-white px-2 font-[600] py-1 rounded"
              onClick={handleOrder}
            >
              Đặt hàng
            </button>

            <p className="px-2 text-[50%] md:text-[100%] font-[600] text-red-600">
              {totalPrice.toLocaleString()} đ
            </p>
            <p className="text-[50%] md:text-[100%] font-[600] ">
              Tổng số tiền:{" "}
            </p>
          </div>
        )}
        {Paymentethods === "onlinePayment" && (
          <div className="w-auto  items-center bg-white px-[10%] my-1">
            <h1 className="font-[600] md:text-[1.6rem]">
              Thông tin thanh toán
            </h1>
            <label className="items-center">
              <p className="w-[20%] font-[400]">Loại thanh toán</p>
              <input
                type="text"
                value="Thanh toán hóa đơn"
                readOnly={true}
                className="w-full md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
              />
            </label>

            <label className="items-center">
              <p className="w-[20%] font-[400]">Số tiền</p>
              <input
                type="text"
                value={totalPrice}
                readOnly={true}
                className="w-full md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
              />
            </label>
            <button
              className="bg-[#005baa] px-2 py-1 rounded font-[600] text-white my-2"
              onClick={handlePayment}
            >
              Thanh toán
            </button>
          </div>
        )}
        <Modal
          title="Địa chỉ"
          open={showModalAddress}
          onOk={handleEditAddress}
          onCancel={handleCancel}
          okButtonProps={okButtonAdd}
          okType="none"
          width={600}
        >
          <label className="flex items-center my-2 justify-between ">
            <p className="md:w-[30%] xl:w-[20%]  font-[600] ">Quốc Gia</p>
            <input
              type="text"
              placeholder="Nhập tên quốc gia"
              value={country}
              className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
              onChange={handleOnchangeCountry}
            />
          </label>
          <label className="flex items-center my-2 justify-between">
            <p className="md:w-[30%] xl:w-[20%] font-[600]">Thành Phố:</p>
            <input
              type="text"
              placeholder="Nhập địa chỉ thành phố"
              value={city}
              onChange={handleOnchangeCity}
              className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
            />
          </label>
          <label className="flex items-center my-2 justify-between">
            <p className="md:w-[30%] xl:w-[20%] font-[600]">Địa chỉ:</p>
            <input
              type="text"
              placeholder="Nhập địa chỉ cụ thế"
              value={address}
              className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
              onChange={handleOnchangeAddress}
            />
          </label>
          <label className="flex items-center my-2 justify-between">
            <p className="md:w-[30%] xl:w-[20%] font-[600]">Loại địa chỉ:</p>
            <select
              value={addressType}
              onChange={handleOnchangaAddressType}
              className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
            >
              <option value="Nhà">Nhà</option>
              <option value="Doanh nghiệp">Doanh Nghiệp</option>
              <option value="other">Khác</option>
            </select>
          </label>
          {addressType === "other" && (
            <div className="flex items-center my-2 justify-end">
              <input
                type="text"
                placeholder="Nhập loại địa chỉ"
                value={newAddressType}
                name="newAddressType"
                className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px] flex-row-reverse"
                onChange={handleOnchangaNewAddressType}
              />
            </div>
          )}
        </Modal>
      </div>
    </Loading>
  );
}

export default CheckOutContent;
