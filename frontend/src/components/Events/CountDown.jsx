import React, { useEffect, useState } from "react";
import * as EventService from "../../service/eventService";
import { getAllEvents } from "../../redux/action/eventAction";
import { useDispatch } from "react-redux";
function CountDown({ item }) {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.Ngày === "undefined" &&
      typeof timeLeft.giờ === "undefined" &&
      typeof timeLeft.phút === "undefined" &&
      typeof timeLeft.giây === "undefined"
    ) {
      const deleteEventAsync = async () => {
        try {
          const res = await EventService.deleteEvent(item.data._id);
          if (res.success) {
            dispatch(getAllEvents());
          }
        } catch (error) {
          console.error("Lỗi khi xóa sự kiện:", error);
        }
      };

      deleteEventAsync();
    }

    return () => clearTimeout(timer);
  });
  function calculateTimeLeft() {
    const finishDate = new Date(item.data.finish);

    finishDate.setHours(finishDate.getHours() - 7);

    const difference = finishDate - new Date();

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
        giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
        phút: Math.floor((difference / 1000 / 60) % 60),
        giây: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[25px] text-[#009b49]" key={index}>
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Hết giờ</span>
      )}
    </div>
  );
}

export default CountDown;
