import React, { memo } from "react";
import { BsStarHalf, BsStarFill } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";
function Rating({ rating }) {
  const starts = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starts.push(
        <BsStarFill
          key={i}
          size={16}
          color="#f6ba00"
          className="mr-2 cursor-pointer"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      starts.push(
        <BsStarHalf
          key={i}
          size={16}
          color="#f6ba00"
          className="mr-2 cursor-pointer"
        />
      );
    } else {
      starts.push(
        <FaRegStar
          key={i}
          size={16}
          style={{ color: "#f6b100", fontSize: "10" }}
          className="mr-2 cursor-pointer"
        />
      );
    }
  }
  return <div className="flex"> {starts}</div>;
}

export default memo(Rating);
