import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../service/orderService";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import { Button, Modal, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import * as ProductService from "../service/productService";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductRd } from "../redux/action/productAction";
function InfomationOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCart, setOrderCart] = useState();
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const getOrder = async () => {
    setIsLoading(true);
    try {
      const res = await OrderService.getAOrder(id);
      setOrders(res.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);
  useEffect(() => {
    if (orders && orders !== null) {
      const data = orders?.cart.map((order) => {
        return {
          id: order._id,
          name: order?.name,
          price: order?.price,
          quantity: order?.quantity,
          image: order?.image,
        };
      });
      setOrderCart(data);
    }
  }, [orders]);

  const handleCancelOrder = async () => {
    const id = orders._id;
    const status = {
      status: "Cancel",
    };
    const res = await OrderService.cancelOrder(id, status);
    if (res.success) {
      navigate("/profile");
    }
  };
  const handleCancel = () => {
    setShowModalCancel(false);
    setShowModalReview(false);
  };

  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleCreateReview = async () => {
    setShowModalReview(false);
    if (!rating || !comment) {
      toast.warning("Hãy nhập đầy đủ thông tin");
    } else {
      const review = {
        _id: orders._id,
        user: orders.user,
        comment: comment,
        rating: rating,
        cart: orders.cart,
      };
      const res = await ProductService.reviewProduct(review);
      if (res.success) {
        dispatch(getAllProductRd());
        toast.success("Đánh giá thành công");
        localStorage.setItem("hasReviewed", review._id);
      }
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };
  useEffect(() => {
    const hasReviewed = localStorage.getItem("hasReviewed");
    if (orders) {
      if (orders._id === hasReviewed) {
        setHasReviewed(true);
      }
    }
  }, [orders]);
  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4]">
        <div className="w-full p-5 px-[10%]">
          {orderCart?.length > 0 ? (
            <div>
              {orderCart.map((item) => {
                return (
                  <div key={item.id} className="flex border-t py-2">
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
                        <p className="text-[50%] md:text-[100%] px-2">
                          Số lượng:
                        </p>
                        <p className="px-2 text-[50%] md:text-[100%]">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="flex md:items-center md:justify-center  ml-2 md:w-[30%] ">
                        <p className="text-[50%] md:text-[100%] px-2">
                          Giá tiền:
                        </p>
                        <p className="text-[50%] md:text-[100%]">
                          {`${(item.price * item.quantity).toLocaleString()} đ`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="w-auto  items-center bg-white px-[10%] my-2  md:flex md:justify-between">
          <div>
            <p className="text-[50%] md:text-[100%] font-[600] pt-2 ">
              Tổng thanh toán
            </p>
            <p className="text-[50%] md:text-[100%] font-[600] pt-2 text-red-600">
              {orders?.totalPrice.toLocaleString()} đ
            </p>
          </div>
          <div className="bg-[#4b8600] text-white rounded">
            {orders?.status === "Processing" ? (
              <p className="px-2 py-1 text-[50%] md:text-[100%] font-[600]">
                Chờ xử lý
              </p>
            ) : orders?.status === "Transferred" ? (
              <p className="px-2 py-1 text-[50%] md:text-[100%] font-[600]">
                Đang vận chuyển
              </p>
            ) : (
              <p className="px-2 py-1 text-[50%] md:text-[100%] font-[600]">
                Đã giao hàng
              </p>
            )}
          </div>
        </div>
        {orders?.status === "Delivered" && !hasReviewed ? (
          <div className="w-auto items-center bg-white px-[10%] my-1 md:flex md:justify-between">
            <div className="bg-[#4b8600] text-white rounded flex justify-center items-center my-2">
              <button
                className="text-[50%] md:text-[100%] font-[600] px-2 py-1 "
                onClick={() => setShowModalReview(true)}
              >
                Đánh giá
              </button>
            </div>
          </div>
        ) : (
          <div className="w-auto items-center bg-white px-[10%] my-1 md:flex md:justify-between">
            <div className="bg-[#4b8600] text-white rounded flex justify-center items-center my-2">
              <button
                className="text-[50%] md:text-[100%] font-[600] px-2 py-1"
                disabled
              >
                Đã đánh giá
              </button>
            </div>
          </div>
        )}
        {orders?.status === "Processing" ? (
          <div className="w-auto  items-center bg-white px-[10%] my-1  md:flex md:justify-between">
            <div className="bg-red-600 text-white rounded flex justify-center items-center my-2">
              <button
                className="text-[50%] md:text-[100%] font-[600] px-2 py-1 "
                onClick={() => setShowModalCancel(true)}
              >
                Hủy đơn
              </button>
            </div>
          </div>
        ) : null}
        <Footer />
        <Modal
          title="Hủy đơn"
          open={showModalCancel}
          onOk={handleCancelOrder}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" onClick={handleCancelOrder}>
              Xác nhận
            </Button>,
          ]}
        >
          <p>{`Bạn có muốn chăc hủy đơn này?`} </p>
        </Modal>
        <Modal
          title="Đánh giá"
          open={showModalReview}
          onOk={handleCreateReview}
          onCancel={handleCancel}
          width={600}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" onClick={() => handleCreateReview(rating)}>
              Gửi đánh giá
            </Button>,
          ]}
        >
          <div>
            <div className="mb-2">
              <span>Đánh giá </span>
              <Rate
                className="pl-2"
                allowHalf
                onChange={handleRatingChange}
                value={rating}
              />
            </div>
            <TextArea
              placeholder="Hãy chia sẽ nhận xét của bạn"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></TextArea>
          </div>
        </Modal>
      </div>
      ;
    </Loading>
  );
}

export default InfomationOrder;
