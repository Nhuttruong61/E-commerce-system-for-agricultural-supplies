import React, { memo } from "react";
import Slider from "react-slick";
function Slick({ children }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="custom-slider">
      {children}
    </Slider>
  );
}

export default memo(Slick);
