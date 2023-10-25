import React from "react";
import { Carousel } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllSlider } from "../../service/sliderService";
const SliderComponet = () => {
  const onChange = (currentSlide) => {};
  const getAllSlides = async () => {
    const res = await getAllSlider();
    return res;
  };

  const { data: dataSlider } = useQuery({
    queryKey: ["slider"],
    queryFn: getAllSlides,
  });
  return (
    <Carousel afterChange={onChange} className="w-full" autoplay>
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
