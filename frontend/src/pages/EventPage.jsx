import React, { useEffect } from "react";
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
      <div className="min-h-[100vh] md:px-[4%] px-2">
        {data && data.length > 0 ? (
          data.map((item, index) => <EventCard data={item} key={index} />)
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

export default EventPage;
