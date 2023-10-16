import React from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { BsStarHalf } from "react-icons/bs";
function Rating({ rating }) {
  const starts = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starts.push(
        <StarFilled
          key={i}
          className="mr-2 cursor-pointer"
          style={{ color: "#f6b100", fontSize: "20" }}
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      starts.push(
        <BsStarHalf
          key={i}
          size={17}
          color="#f6ba00"
          className="mr-2 cursor-pointer"
        />
      );
    } else {
      starts.push(
        <StarOutlined
          key={i}
          size={20}
          style={{ color: "#f6b100", fontSize: "20" }}
          className="mr-2 cursor-pointer"
        />
      );
    }
  }
  return <div className="flex"> {starts}</div>;
}

export default Rating;
