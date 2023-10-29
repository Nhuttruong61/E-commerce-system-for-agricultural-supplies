import React, { memo } from "react";
import EventCard from "./EventCard";
import { useSelector } from "react-redux";

function Event() {
  const { data } = useSelector((state) => state.event);
  return (
    <div className="p-6 rounded-lg mb-12 md:px-[10%] bg-[#f4f1f4]">
      <div className="flex justify-center text-center items-center">
        <p className="my-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
          SỰ KIỆN
        </p>
      </div>
      <div className="w-full grid shadow-lg">
        {data && data.length > 0 ? (
          data.map((item, index) => <EventCard data={item} key={index} />)
        ) : (
          <p className="text-center text-gray-500">
            Tạm thời không có sự kiện!
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(Event);
