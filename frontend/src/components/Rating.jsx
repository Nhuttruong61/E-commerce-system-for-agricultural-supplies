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
          className="mr-2 cursor-pointer text-[10px] md:text-[16px] text-[#f6b100]"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      starts.push(
        <BsStarHalf
          key={i}
          className="mr-2 cursor-pointer text-[10px] md:text-[16px] text-[#f6b100]"
        />
      );
    } else {
      starts.push(
        <FaRegStar
          key={i}
          className="mr-2 cursor-pointer text-[10px] md:text-[16px] text-[#f6b100]"
        />
      );
    }
  }
  return <div className="flex"> {starts}</div>;
}

export default memo(Rating);
