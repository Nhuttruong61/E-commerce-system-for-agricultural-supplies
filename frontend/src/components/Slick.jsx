import React from "react";
import Slider from "react-slick";
import ProductCart from "./Product/ProductCart";
function Slick({ data }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
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

export default Slick;
