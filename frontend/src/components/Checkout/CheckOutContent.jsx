import React, { memo, useEffect, useState } from "react";
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
import { getaProduct } from "../../service/productService";
import voucher from "../.././assets/image/mgg.png";
function CheckOutContent() {
  const { cart } = useSelector((state) => state.cart);
  const { account, isAuthenticated } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.fee);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModalAddress, setShowModalAddress] = useState(false);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Paymentethods, setPaymentMethod] = useState("paymentDelivery");
  const [price, setPrice] = useState();
  const [shipCost, setShipCost] = useState(0);
  const [idGifts, setIdGifts] = useState(null);
  const [dataGift, setDataGift] = useState(null);
  const [dataCart, setDataCart] = useState([]);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [coupon, setCoupon] = useState(null);
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
    const totalWeight = cart.reduce((acc, item) => {
      return acc + item.weight * item.quantity;
    }, 0);
    const selectedShippingOption = data?.find(
      (option) => totalWeight <= option.weight
    );

    const totalFeecost = selectedShippingOption?.cost * totalWeight;
    const freeShip = selectedShippingOption?.freeShipping;

    const total = cart.reduce((acc, item) => {
      if (account?.role === "business" && item?.quantity >= 10) {
        return acc + item.wholesalePrice * item.quantity;
      } else {
        return acc + item.price * item.quantity;
      }
    }, 0);
    if (coupon) {
      let couponPrice = total - coupon.discountAmount;
      if (couponPrice < 0) {
        setPrice(0);
      } else setPrice(couponPrice);
    } else {
      setPrice(total);
    }

    if (total >= freeShip) {
      setTotalPrice(price);
      setShipCost(0);
    } else {
      setTotalPrice(price + totalFeecost);
      setShipCost(totalFeecost);
    }
  }, [cart, data, coupon, price]);
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
        setCity(item.city);
        setAddress(item.address);
      }
    }
  }, [account]);
  const handleOnchangeCity = (e) => setCity(e.target.value);
  const handleOnchangeAddress = (e) => setAddress(e.target.value);

  const handleCancel = () => {
    setShowModalAddress(false);
  };
  const handleEditAddress = async () => {
    setShowModalAddress(false);
    if (!city || !address) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
    } else {
      const addressUser = {
        city: city,
        address: address,
      };
      setIsLoading(true);
      const update = await updateAddress(addressUser);
      setIsLoading(false);
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
    if (!isAuthenticated) {
      localStorage.setItem("redirectPath", window.location.pathname);
      navigate("/login");
    } else if (account?.addresses.length === 0) {
      setShowModalAddress(true);
    } else {
      const order = {
        cart: dataCart,
        user: account,
        totalPrice: totalPrice,
        shippingAddress: {
          city,
          address,
        },
        paymentInfo: {
          type: Paymentethods,
          status: "Chưa thanh toán",
        },
        coupons: {
          ...coupon,
        },
      };
      setIsLoading(true);
      const res = await OrderService.createOrder(order);
      setIsLoading(false);
      if (res.success) {
        navigate("/order/success");
        dispatch(clearQuantity());
        dispatch(getUser());
        setCoupon([]);
        localStorage.setItem("voucher", null);
        localStorage.setItem("activeVouchers", null);
      }
    }
  };
  const handlePayment = async () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (account?.addresses.length === 0) {
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
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const res = await PaymentService.peymentReturn(encodedParams);
      if (res.Message === "Success" && res.RspCode === "00") {
        if (account?.addresses.length !== 0 && totalPrice !== 0) {
          const order = {
            cart: dataCart,
            user: account,
            totalPrice: totalPrice,
            shippingAddress: {
              city: account?.addresses[0].city,
              address: account?.addresses[0].address,
            },
            paymentInfo: {
              type: "onlinePayment",
              status: "Đã thanh toán",
            },
            coupons: {
              ...coupon,
            },
          };
          try {
            setIsLoading(true);
            const res = await OrderService.createOrder(order);
            setIsLoading(false);
            if (res.success) {
              navigate("/order/success");
              dispatch(clearQuantity());
              localStorage.setItem("voucher", null);
              localStorage.setItem("activeVouchers", null);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };
  useEffect(() => {
    if (isAuthenticated && totalPrice) {
      handleOrderPayment();
    }
  }, [totalPrice]);
  const getGiftData = async () => {
    const giftIds = cart.flatMap((item) => item.gifts);
    setIdGifts(giftIds);
  };
  useEffect(() => {
    getGiftData();
  }, [cart]);
  const getGiftProduct = async () => {
    if (idGifts) {
      try {
        const productPromises = idGifts.map(async (id) => {
          const res = await getaProduct(id);
          const cartItem = cart.find((item) => item.gifts.includes(id));
          const quantityProduct = cartItem ? cartItem.quantity : 0;
          return (res.product = {
            _id: res.product._id,
            name: res.product.name,
            image: res.product.images[0].url,
            weight: res.product.weight,
            quantity: quantityProduct,
          });
        });
        const products = await Promise.all(productPromises);

        setDataGift(products);
      } catch (error) {
        console.error("Error fetching gift products:", error);
      }
    }
  };
  useEffect(() => {
    getGiftProduct();
  }, [idGifts, cart]);

  useEffect(() => {
    if (dataGift?.length > 0) {
      const updatedCart = [...cart];
      dataGift.forEach((giftProduct) => {
        const dataGiftIndex = updatedCart.findIndex(
          (item) => item._id === giftProduct._id
        );

        if (dataGiftIndex !== -1) {
          updatedCart[dataGiftIndex].quantity += giftProduct.quantity;
        } else {
          updatedCart.push(giftProduct);
        }
      });

      setDataCart(updatedCart);
    } else {
      setDataCart(cart);
    }
  }, [dataGift, cart]);
  const handleAddCoupon = (item) => {
    const isVoucherActive = activeVouchers.includes(item._id);

    if (isVoucherActive) {
      setActiveVouchers(activeVouchers.filter((Id) => Id !== item._id));
      localStorage.setItem(
        "activeVouchers",
        setActiveVouchers(activeVouchers.filter((Id) => Id !== item._id))
      );
      setCoupon(null);
      localStorage.setItem("voucher", null);
    } else {
      setActiveVouchers([item._id]);
      setCoupon(item);
      localStorage.setItem("activeVouchers", item._id);
      localStorage.setItem("voucher", JSON.stringify(item));
    }
  };
  useEffect(() => {
    const activeVoucher = localStorage.getItem("activeVouchers");
    const voucher = JSON.parse(localStorage.getItem("voucher"));
    if (activeVoucher) {
      setActiveVouchers(activeVoucher);
    }
    if (voucher) {
      setCoupon(voucher);
    }
  }, []);
  return (
    <Loading isLoading={isLoading}>
      <div>
        <div className="w-full p-5 pb-8 px-[10%] ">
          {cart.map((item) => {
            return (
              <div key={item._id} className="flex border-t border-black py-2 ">
                <div className="md:w-[10%] w-[30%]">
                  <img
                    src={item.image}
                    alt=""
                    className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] "
                  />
                </div>
                <div className="md:w-[90%] w-[70%] flex md:items-center md:justify-between  flex-col md:flex-row ">
                  <p className="text-[100%] px-4 md:w-[30%] ">{item.name}</p>
                  <div className="flex items-center md:justify-center  ml-2 md:w-[50%]  ">
                    <p className="text-[100%] px-2 hidden sm:block">
                      Số lượng:
                    </p>
                    <div className="flex items-center justify-center  rounded ml-2">
                      <button
                        className="flex items-center p-1 bg-[#0e9c49] h-full rounded"
                        disabled={item.quantity <= 1}
                        onClick={() => {
                          handleDecrease(item);
                        }}
                      >
                        <MinusOutlined className="text-white" />
                      </button>
                      <p className="px-2">{item.quantity}</p>
                      <button
                        className="flex items-center p-1 h-full bg-[#0e9c49] rounded"
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
                    <p className="text-[100%] px-2">Giá tiền:</p>
                    <p className="text-[100%]">
                      {(item?.price * item?.quantity).toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {dataGift?.length > 0 && (
            <div className="w-full">
              {dataGift?.map((item) => {
                if (item.quantity > 0) {
                  return (
                    <div
                      key={item._id}
                      className="flex border-t border-black py-2 "
                    >
                      <div className="md:w-[10%] w-[30%]">
                        <img
                          src={item.image}
                          alt=""
                          className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] "
                        />
                      </div>
                      <div className="md:w-[90%] w-[70%] flex md:items-center md:justify-between  flex-col md:flex-row ">
                        <p className="text-[100%] px-4 md:w-[30%] ">
                          {item.name}
                        </p>
                        <div className="flex items-center md:justify-center  ml-2 md:w-[50%]  ">
                          <p className="text-[100%] px-2 hidden sm:block">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="flex md:items-center md:justify-center  ml-2 md:w-[30%] ">
                          <p className="text-[100%] px-2">Giá tiền:</p>
                          <p className="text-[100%]">0đ</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
        <div className="w-auto md:flex items-center bg-white px-[10%] my-1">
          <div
            className="cursor-pointer"
            onClick={() => setShowModalAddress(true)}
          >
            <p className="text-[100%] font-[600] pt-2 text-red-600">
              Địa chỉ nhận hàng
            </p>
            {account?.addresses.length > 0 ? (
              <div>
                <p className="text-[100%] ">{account?.addresses[0].city}</p>
                <p className="text-[100%]">{account?.addresses[0].address}</p>
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
        {account?.voucher.length > 0 && (
          <div className="w-auto  items-center bg-white px-[10%] my-1">
            <p className="text-[100%]  font-[600] pt-2 text-red-600">
              Mã giảm giá
            </p>
            <div className="grid md:grid-cols-2 w-full gap-2">
              {account?.voucher.map((item) => {
                const isVoucherActive = activeVouchers.includes(item._id);
                return (
                  <div
                    key={item._id}
                    className="flex border px-4 py-2 rounded shadow w-full mx-2 my-2 items-center"
                  >
                    <div className="md:w-[40%] w-[30%]">
                      <img
                        src={voucher}
                        alt=""
                        className="md:h-[50px] h-[40px]"
                      />
                    </div>
                    <div className="md:w-[40%] w-[45%] px-2">
                      <p className="md:text-[16px] font-[500] text-[14px]">
                        {item?.name}
                      </p>
                      <p className="md:text-[16px] font-[500] text-[14px]">
                        Giảm: {item?.discountAmount?.toLocaleString()} đ
                      </p>
                    </div>
                    <p
                      className={`md:w-[15%] w-[25%] cursor-pointer hover:underline md:text-[16px] text-[12px] ${
                        isVoucherActive
                          ? "bg-[#9a9797] text-black "
                          : "bg-[#009b49]"
                      }  font-[500] text-white py-1 px-2 rounded flex justify-center`}
                      onClick={() => handleAddCoupon(item)}
                    >
                      {isVoucherActive ? "Hủy" : "Áp dụng"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="w-auto  items-center bg-white px-[10%] my-1 ">
          <p className="text-[100%] font-[600] pt-2 text-red-600">
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
          <div className="flex md:flex-row-reverse  md:px-8 w-full shadow shadow-black bottom-[41%] py-2 bg-white items-center px-[10%]">
            <div className="flex flex-col ">
              <p className="text-[100%] font-[600] ">Chi tiết thanh toán: </p>
              <span className="flex">
                <p className="text-[100%] font-[600]">Tổng tiền hàng: </p>
                <p className="text-[100%] pl-2">{price?.toLocaleString()}đ</p>
              </span>
              <span className="flex">
                <p className="text-[100%] font-[600]">Tổng phí vận chuyển: </p>
                <p className="text-[100%] pl-2">
                  {shipCost?.toLocaleString()}đ
                </p>
              </span>
              <span className="flex">
                <p className="text-[100%] font-[600]">Tổng thanh toán: </p>
                <p className="text-[100%] pl-2">
                  {totalPrice?.toLocaleString()}đ
                </p>
              </span>
            </div>
          </div>
        )}
        {Paymentethods === "paymentDelivery" && (
          <div className="flex md:flex-row-reverse md:px-8 w-full shadow shadow-black bottom-[41%] py-2 bg-white items-center px-[10%]">
            <button
              disabled={cart.length === 0}
              className="bg-[#0e9c49] text-white px-2 font-[600] py-1 rounded"
              onClick={handleOrder}
            >
              Đặt hàng
            </button>

            <div className="flex items-center px-2">
              <p className="text-[100%] font-[600] ">Tổng số tiền </p>
              <p className="px-2 text-[100%] font-[600] text-red-600">
                {totalPrice?.toLocaleString()} đ
              </p>
            </div>
          </div>
        )}
        {Paymentethods === "onlinePayment" && (
          <div className="w-auto  items-center bg-white px-[10%] my-1">
            <h1 className="font-[600] md:text-[1.6rem]">
              Thông tin thanh toán
            </h1>
            <label className="items-center">
              <p className="w-full font-[400]">Loại thanh toán</p>
              <input
                type="text"
                value="Thanh toán hóa đơn"
                readOnly={true}
                className="w-full md:px-4 px-2 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
              />
            </label>

            <label className="items-center">
              <p className="w-[20%] font-[400]">Số tiền</p>
              <input
                type="text"
                value={totalPrice}
                readOnly={true}
                className="w-full md:px-4 px-2 h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px] outline-none"
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
        </Modal>
      </div>
    </Loading>
  );
}

export default memo(CheckOutContent);
