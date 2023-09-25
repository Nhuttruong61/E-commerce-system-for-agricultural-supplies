import React, { useState } from "react";
import { getaProduct } from "../service/productService";
import { useQuery } from "@tanstack/react-query";
import Rating from "./Rating";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

function ProductDetail(id) {
  const productId = id?.id;
  const [quantity, setQuantity] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const getProduct = async () => {
    const res = await getaProduct(productId);
    return res;
  };
  const { data: dataProduct } = useQuery({
    queryKey: ["product"],
    queryFn: getProduct,
  });

  const handleIncrease = () => {
    setQuantity((pre) => pre + 1);
  };
  const handleDecrease = () => {
    setQuantity((pre) => pre - 1);
  };
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const productPrice =
    dataProduct?.product?.originPrice *
    (1 - dataProduct?.product?.distCount / 100);
  const handleOrder = () => {};
  return (
    <div className="">
      <div className="w-full flex flex-col  md:flex-row md:justify-between md:px-[10%]">
        <div className=" md:w-[50%] w-[100%] flex justify-center text-center">
          {dataProduct?.product && (
            <img
              src={dataProduct.product.images[0].url}
              alt=""
              className="sm:w-[280px] md:w-[320px] w-[120px] object-contain"
            />
          )}
        </div>
        <div className="w-full sm:m-2 px-[4%]">
          <p className="md:text-xl text-xs font-[700] ">
            {dataProduct?.product.name}
          </p>
          <div className="flex items-center">
            <p className="pr-1"> {dataProduct?.product?.ratings}</p>
            <Rating rating={dataProduct?.product?.ratings} />
          </div>
          <span className="flex items-center">
            <p className="mr-2">Đã bán</p>
            <p className="font-bold">{dataProduct?.product?.sold_out}</p>
          </span>
          <div className="flex">
          {dataProduct?.product?.distCount ? (
            <>
              <h1 className="line-through font-bold text-red-600 pr-2">{dataProduct?.product?.originPrice.toLocaleString()}</h1>
              <h1 className="font-bold">{productPrice.toLocaleString()}</h1>
            </>
          ) : (
            <h1 className="font-bold">{dataProduct?.product?.originPrice.toLocaleString()}</h1>
          )}
        </div>
          <div className="flex items-center">
            <button
              className="p-2 flex items-center border bg-[#f9f9f9]"
              onClick={handleDecrease}
              disabled={quantity <= 0}
            >
              <MinusOutlined />
            </button>
            <p className="p-2 flex items-center font-bold h-full">{quantity}</p>
            <button
              className="p-2 flex items-center border bg-[#f9f9f9]"
              onClick={handleIncrease}
              disabled={quantity >= dataProduct?.product.quantity}
            >
              <PlusOutlined />
            </button>
            <button
              className="bg-[#73c509] p-1 border mx-2 font-[600] text-white px-2"
              onClick={handleOrder}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="relative">
            <h1>Chi tiết sản phẩm</h1>
            <div
              className={`shadow shadow-[#a8a7a7] ${
                expanded ? "h-auto" : "h-[30vh]"
              }`}
            >
              <p className="">{dataProduct?.product?.description}</p>
              <p
                className="absolute bottom-0 w-full text-center text-blue-600 cursor-pointer pl-4"
                onClick={toggleExpand}
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:px-[10%]">
        <div className="relative">
          <p>Bình luận</p>
          <div className="shadow shadow-[#a8a7a7]">
            <p>{dataProduct?.product?.description}</p>
            <p
              className="absolute bottom-0 w-full text-center text-blue-600 cursor-pointer"
              onClick={toggleExpand}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
