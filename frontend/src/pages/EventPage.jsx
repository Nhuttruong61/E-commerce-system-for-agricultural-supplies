import React, { memo, useEffect } from "react";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../redux/action/eventAction";
function EventPage() {
  useEffect(() => {
    dispatch(getAllEvents());
  }, []);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.event);
  return (
    <div>
      <div className="min-h-[50vh] md:px-[4%] p-2  bg-[#F4F1F4]">
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="mb-2">
              <EventCard data={item} key={index} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Tạm thời không có sự kiện!
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default memo(EventPage);
