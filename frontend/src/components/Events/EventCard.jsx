import React, { memo } from "react";
import CountDown from "./CountDown";
import { useNavigate } from "react-router-dom";
function EventCard(item) {
  const navigate = useNavigate();
  const productPrice =
    item?.data?.product[0]?.price *
    (1 - (item?.data?.product[0]?.distCount / 100 + item?.data.discount / 100));

  const handleNavigate = (item) => {
    navigate(`/product/details/${item.data.product[0]._id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      className="w-full rounded-lg md:flex  shadow-sm cursor-pointer bg-white hover:shadow-[#009b49]"
      onClick={() => handleNavigate(item)}
    >
      <div className="w-full md:w-[50%] m-auto justify-center items-center flex">
        <img
          className="w-[120px] md:w-[280px]"
          src={item?.data?.product[0].images[0].url}
          alt=""
        />
      </div>
      <div className="w-full md:[w-50%] flex flex-col justify-center pl-[4%]">
        <h1 className="font-[700] text-[140%] md:text-[160%] py-2">
          {item?.data.name}
        </h1>
        <p className="font-[600]">{item?.data.description} </p>
        <div className="flex justify-between">
          <div className="flex">
            <h5 className=" font-[500] text-red-500 pl-3 line-through">
              {item.data?.product[0]?.originPrice.toLocaleString()}đ
            </h5>
            <h5 className=" font-[500]  pl-3 ">
              {productPrice.toLocaleString()}đ
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[#0e9c49] ">
            {item?.data?.product[0]?.sold_out} Đã bán
          </span>
        </div>
        <CountDown item={item} />
      </div>
    </div>
  );
}

export default memo(EventCard);
