import React, { memo, useEffect, useState } from "react";
import { getaProduct } from "../../service/productService";
import Rating from "../Rating";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import ProductCart from "./ProductCart";
import { increaseQuantity } from "../../redux/action/cartAction";
import { toast } from "react-toastify";
import Zoom from "../Zoom";
import { isNotExpired } from "../../until";
import { useNavigate } from "react-router-dom";
function ProductDetail(id) {
  const { data } = useSelector((state) => state.product);
  const dataEvent = useSelector((state) => state.event);
  const { cart } = useSelector((state) => state.cart);
  const { account, isAuthenticated } = useSelector((state) => state.user);
  const _id = id?.id;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [dataProduct, setDataProduct] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [dataReviews, setDataReviews] = useState(null);
  const [productData, setProductData] = useState(null);
  const [checkQuantity, setCheckQuantity] = useState(null);
  const [dataSuggest, setDataSuggest] = useState(null);
  const [activeReview, setActiveReview] = useState(false);
  const [dataGift, setDataGift] = useState([]);
  const navigate = useNavigate();
  const getProduct = async () => {
    const res = await getaProduct(_id);
    setDataProduct(res);
  };
  useEffect(() => {
    getProduct();
  }, [id]);
  useEffect(() => {
    const eventId = dataEvent.data.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const foundEvent = eventId.find(
      (eventItem) => eventItem.idProductEvent === _id
    );
    if (foundEvent && dataProduct) {
      const updatedProduct = {
        ...dataProduct?.product,
        distCount: foundEvent.discount + dataProduct?.product.distCount,
      };
      setProductData(updatedProduct);
    } else {
      setProductData(dataProduct?.product);
    }
  }, [dataEvent, _id, dataProduct]);
  const handleIncrease = () => {
    setQuantity((pre) => pre + 1);
  };
  const handleDecrease = () => {
    setQuantity((pre) => pre - 1);
  };
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const productPrice = productData?.price * (1 - productData?.distCount / 100);
  const productPriceWholesalePrice =
    productData?.wholesalePrice * (1 - productData?.distCount / 100);
  useEffect(() => {
    if (dataProduct && dataProduct.success) {
      const res = dataProduct?.product?.reviews.sort((a, b) => {
        return new Date(b.createAt) - new Date(a.createAt);
      });
      setDataReviews(res);
    }
  }, [dataProduct, _id]);
  useEffect(() => {
    const filteredItems = cart?.filter((item) => item._id === _id);
    setCheckQuantity(filteredItems);
  }, [cart, _id]);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectPath", window.location.pathname);
      navigate("/login");
    } else {
      if (productData?.quantity < 1) {
        toast.warning("Sản phẩm tạm hết hàng");
      } else {
        if (quantity > 0) {
          dispatch(
            increaseQuantity({
              _id: productData?._id,
              name: productData?.name,
              description: productData?.description,
              price: productPrice,
              wholesalePrice: productPriceWholesalePrice,
              disCount: productData?.distCount,
              gifts: productData?.gifts,
              weight: productData?.weight,
              image: productData?.images[0].url,
              quantityProduct: productData?.quantity,
              quantity,
            })
          );
          if (
            checkQuantity &&
            checkQuantity.length > 0 &&
            checkQuantity[0].quantity < checkQuantity[0].quantityProduct
          ) {
            toast.success("Thêm sản phẩm thành công");
          } else if (
            checkQuantity &&
            checkQuantity.length > 0 &&
            checkQuantity[0].quantity === checkQuantity[0].quantityProduct
          ) {
            toast.error("Đã đạt số lượng tối đa");
          } else {
            toast.success("Thêm sản phẩm thành công");
          }
        }
      }
    }
  };
  useEffect(() => {
    if (quantity > productData?.quantity) {
      setQuantity(productData?.quantity);
    }
  }, [quantity]);

  useEffect(() => {
    const unExpiredProducts = data.filter((item) => {
      return isNotExpired(new Date(item.expirationDate));
    });
    setDataSuggest(unExpiredProducts);
  }, [data]);

  const getGiftData = async () => {
    if (productData && productData.gifts && Array.isArray(productData.gifts)) {
      const promises = productData.gifts.map(async (id) => {
        const res = await getaProduct(id);
        return res?.product;
      });

      try {
        const gifts = await Promise.all(promises);
        setDataGift(gifts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu quà tặng", error);
      }
    }
  };

  useEffect(() => {
    getGiftData();
  }, [productData]);
  return (
    <div className=" mb-10 px-1">
      <p className="text-[18px] md:text-[24px] mx-2 font-[700] md:px-[10%]">
        Sản phẩm
      </p>
      <div className="w-full flex flex-col  md:flex-row md:justify-between md:px-[10%] ">
        <div className=" md:w-[50%] w-[100%] flex justify-center text-center py-2 md:h-[50vh]">
          {productData && <Zoom image={productData?.images[0].url} />}
        </div>

        <div className="w-full sm:m-2 px-[4%] py-1">
          <p className="text-[16px] md:text-[20px] font-[600] ">
            {productData?.name}
          </p>
          {productData?.ratings && (
            <div className="flex items-center py-1">
              <Rating rating={productData?.ratings} />
            </div>
          )}
          <div className="flex py-1 text-[14px] md:text-[18px]">
            <span className="flex items-center">
              <p className="mr-2">Đã bán:</p>
              <p className="font-bold">{productData?.sold_out}</p>
            </span>
            <span className="flex ml-8 justify-center items-center  text-[14px] md:text-[18px]">
              <p className="mr-2 text-slate-400 ">Có sẳn:</p>
              <p className="text-slate-400">{productData?.quantity}</p>
            </span>
          </div>
          <div className="flex">
            {productData?.distCount ? (
              <>
                <h1 className=" text-[14px] md:text-[18px] line-through font-bold text-red-600 pr-2">
                  {productData?.price.toLocaleString()} đ
                </h1>
                <h1 className="font-bold  text-[14px] md:text-[18px]">
                  {productPrice.toLocaleString()}đ
                </h1>
              </>
            ) : (
              <h1 className="font-bold  text-[14px] md:text-[18px]">
                {dataProduct?.product?.price.toLocaleString()} đ
              </h1>
            )}
            {account?.role === "business" && (
              <>
                {productData?.distCount ? (
                  <div className="px-10 flex items-center">
                    <p className="font-[600] pr-2  text-[14px] md:text-[18px]">
                      Giá sỉ:
                    </p>
                    <div className="flex  pr-2 items-start">
                      <h1 className="line-through font-bold text-red-600   text-[14px] md:text-[18px] pr-2">
                        {productData?.wholesalePrice.toLocaleString()} đ
                      </h1>
                      <h1 className="font-bold   text-[14px] md:text-[18px]">
                        {productPriceWholesalePrice.toLocaleString()} đ
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex px-10 ">
                    <p className="font-[600] pr-2  text-[14px] md:text-[18px]">
                      Giá sỉ:
                    </p>
                    <h1 className="font-bold md:  text-[14px] md:text-[18px]">
                      {productData?.wholesalePrice.toLocaleString()} đ
                    </h1>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center py-2">
            <button
              className="p-2 flex items-center border bg-[#f9f9f9]  text-[14px] md:text-[18px]"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <MinusOutlined />
            </button>
            <input
              value={quantity}
              onChange={(e) => {
                const parsedValue =
                  e.target.value !== "" ? parseInt(e.target.value, 10) : 1;
                setQuantity(parsedValue);
              }}
              className="flex items-center font-bold h-full w-[48px] py-1 px-2 outline-none text-center md:text-[100%] text-[80%]"
            />

            <button
              className="p-2 flex items-center border bg-[#f9f9f9] md:text-[100%] text-[80%]"
              onClick={handleIncrease}
              disabled={quantity >= dataProduct?.product.quantity}
            >
              <PlusOutlined />
            </button>
            <button
              className="bg-[#009b49] p-1 border mx-2 font-[600] text-white px-2 md:text-[100%] text-[80%]"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="py-2">
            <p className="text-[16px] md:text-[20px] font-[600] pb-2">
              Chi tiết sản phẩm
            </p>
            <div
              className={`shadow shadow-[#a8a7a7] ${
                expanded ? "h-auto" : "h-[11vh] overflow-hidden"
              }`}
            >
              <div className=" text-[14px] md:text-[16px] px-2 py-2">
                {dataProduct?.product?.description.map((item, index) => {
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  );
                })}
              </div>
            </div>
            <p
              className=" w-full text-center text-blue-600 cursor-pointer pl-4  text-[14px] md:text-[18px] "
              onClick={toggleExpand}
            >
              {expanded ? "Thu gọn" : "Xem thêm"}
            </p>
          </div>
          <div className="py-2 flex items-center">
            <p className=" text-[14px] md:text-[18px] font-[600] pr-2">
              Quy cách:
            </p>
            {dataProduct?.product.capacity ? (
              dataProduct?.product.capacity < 1 ? (
                <p className="text-[14px] md:text-[18px]">
                  {dataProduct?.product.capacity * 1000} ml
                </p>
              ) : (
                <p className="text-[14px] md:text-[18px]">
                  {dataProduct?.product.capacity} lít
                </p>
              )
            ) : dataProduct?.product.weight < 1 ? (
              <p className="text-[14px] md:text-[18px]">
                {dataProduct?.product.weight * 1000} gam
              </p>
            ) : (
              <p className="text-[14px] md:text-[18px]">
                {dataProduct?.product.weight} kg
              </p>
            )}
          </div>
          {dataGift?.length > 0 && (
            <div className=" flex items-center ">
              <p className="text-[14px] md:text-[18px] font-[600] pr-2">
                Tặng kèm:
              </p>
              <div className="flex justify-center items-center ">
                {dataGift &&
                  dataGift?.map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="flex justify-center flex-col items-center"
                      >
                        <p className=" font-[400] ">{item.name}</p>
                        <img
                          src={item?.images[0].url}
                          alt=""
                          className="h-[50px] w-[50px] hidden"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
      {dataSuggest?.filter(
        (item) =>
          item.category.categoryid._id ===
            dataProduct?.product.category.categoryid._id &&
          item._id !== dataProduct.product._id
      ).length > 0 && (
        <div className="flex w-full flex-col md:px-[10%] px-2">
          <p className="font-[600] md: text-[16px] md:text-[20px]">
            Sản phẩm tương tự
          </p>
          <div className="flex w-full">
            <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 md:p-6 w-full">
              {dataSuggest && dataSuggest.length > 0
                ? dataSuggest
                    .filter(
                      (item) =>
                        item.category.categoryid._id ===
                          dataProduct?.product.category.categoryid._id &&
                        item._id !== dataProduct.product._id
                    )
                    .map((item, index) => (
                      <ProductCart item={item} key={index} />
                    ))
                : null}
            </div>
          </div>
        </div>
      )}

      {productData?.reviews?.length > 0 && (
        <div className="w-full md:px-[10%]">
          <div className="relative">
            <p className="  text-[14px] md:text-[18px] font-[600]">Đánh giá</p>
            <div
              className={`shadow shadow-[#a8a7a7] h-full ${
                activeReview ? "w-auto" : "h-[31.5vh] overflow-hidden"
              }`}
            >
              <div className="bg-[#009b49] py-1 px-1  items-center text-white">
                <span className="flex items-center px-1">
                  {dataProduct?.product?.ratings ? (
                    <p className="  text-[14px] md:text-[18px] font-[600]">
                      {dataProduct?.product?.ratings?.slice(0, 3)}
                    </p>
                  ) : (
                    <p className="  text-[14px] md:text-[18px] font-[600]">5</p>
                  )}

                  <p className="md:  text-[14px] md:text-[18px] pl-1">
                    {" "}
                    trên 5
                  </p>
                </span>
                <div className="text-[10px] md:text-[14px] ">
                  <Rating rating={dataProduct?.product?.ratings} />
                </div>
              </div>

              <div
                className={`
             ${
               activeReview && dataReviews?.length > 2 ? "h-auto" : "h-[25vh]"
             } overflow-hidden
             `}
              >
                {dataReviews?.map((review) => {
                  return (
                    <div
                      key={review._id}
                      className="w-full py-1 px-1 border-b-2"
                    >
                      <div className="flex w-full items-center ">
                        {review && review.user?.avatar?.url ? (
                          <img
                            src={review.user.avatar.url}
                            alt=""
                            className=" md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-[50%] mr-1 "
                          />
                        ) : (
                          <div className="border rounded-[50%] ">
                            <UserOutlined className="text-[24px] p-2 text-[#009b49]" />
                          </div>
                        )}
                        <div className=" flex flex-col w-full">
                          <p className="md:  text-[14px] md:text-[18px]">
                            {review?.user?.name}
                          </p>
                          <span className=" text-[8px] md:text-[10px]">
                            <Rating rating={review?.rating} />
                          </span>
                          <p className="md: md:text-[100%] text-[50%] ">
                            {review.createAt
                              ? format(new Date(review.createAt), "dd/MM/yyyy")
                              : null}
                          </p>
                          <p className="md:  text-[14px] md:text-[18px]">
                            {review?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {dataReviews?.length > 2 && (
              <div className="flex justify-center">
                <p
                  className="md:  text-[14px] md:text-[18px] text-blue-700 cursor-pointer "
                  onClick={() => setActiveReview(!activeReview)}
                >
                  {!activeReview ? "Tải thêm" : "Thu nhỏ"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProductDetail);
