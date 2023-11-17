import React, { memo, useEffect } from "react";
import EventCard from "../Events/EventCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../redux/action/eventAction";

function Event() {
  const { data } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEvents());
  }, []);
  const sortEvents = data?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="p-6 rounded-lg  md:px-[10%] bg-[#f4f1f4]">
      <div className="flex justify-center text-center items-center">
        <p className="mt-4 mb-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
          SỰ KIỆN
        </p>
      </div>
      <div className="w-full grid shadow-lg">
        {sortEvents && sortEvents.length > 0 ? (
          <EventCard data={sortEvents[0]} />
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
