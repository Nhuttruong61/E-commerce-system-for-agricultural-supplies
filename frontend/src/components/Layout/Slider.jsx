import React from "react";
import { Carousel } from "antd";
import axios from "../../service/axios-costum";
import { useQuery } from "@tanstack/react-query";
const SliderComponet = () => {
  const onChange = (currentSlide) => {};
  const getAllSlides = async () => {
    const res = await axios.get("/slider/get-all-slider");
    return res;
  };

  const { data: dataSlider } = useQuery({
    queryKey: ["slider"],
    queryFn: getAllSlides,
  });
  return (
    <Carousel afterChange={onChange} className="md:mx-[10%]" autoplay>
      {dataSlider?.slider?.map((item) =>
        item?.images?.map((i) => (
          <div
            key={i.id}
            className="md:min-h-[50vh] min-h-[24vh] flex items-center justify-center"
          >
            <img src={i.url} alt="" className="object-cover h-full" />
          </div>
        ))
      )}
    </Carousel>
  );
};
export default SliderComponet;
