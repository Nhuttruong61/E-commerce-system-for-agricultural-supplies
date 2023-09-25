import React from "react";
import CountDown from "./CountDown";

function EventCard() {
  return (
    <div className="w-full rounded-lg md:flex p-2 shadow-lg ">
      <div className="w-full md:w-[50%] m-auto justify-center items-center flex">
        <img
          className="w-[120px] md:w-[280px]"
          src="https://huucosinhhoc.com/wp-content/uploads/2022/10/z2644713490333_a4cb295485c2183e8f06407ebd192819.jpg"
          alt=""
        />
      </div>
      <div className="w-full md:[w-50%] flex flex-col justify-center pl-[4%]">
        <h1 className="font-[700]">
          PHÂN BÓN LÁ NPK 20-20-20 DÙNG CHO MỌI GIAI ĐOẠN SINH TRƯỞNG HŨ 500G
        </h1>
        <p>
          Sử dụng cho suốt thời kỳ sinh trưởng và tăng trưởng trên các loại cây
          trồng, làm cho cây khỏe mạnh. Gia tăng sức đề kháng của cây, chống
          hạn, bệnh, sự khủng hoảng lúc cây sinh sản và sau khi thu hoạch. hạt.
        </p>
        <div className="flex justify-between">
          <div className="flex">
            <h5 className=" font-[500] text-red-500 pl-3 line-through">
              200000
            </h5>
            <h5 className=" font-[500]  pl-3 ">199000</h5>
          </div>
          <span className="pr-3 font-[400] text-[#4b8600] "> Đã bán</span>
        </div>
        <CountDown />
      </div>
    </div>
  );
}

export default EventCard;
