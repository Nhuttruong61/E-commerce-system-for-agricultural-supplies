import React, { memo } from "react";
import Slider from "react-slick";
import ProductCart from "./Product/ProductCart";
function Slick({ data }) {
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
      {data?.map((item, index) => (
        <div key={index} className="px-4">
          <ProductCart item={item} />
        </div>
      ))}
    </Slider>
  );
}

export default memo(Slick);
