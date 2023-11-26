import React, { memo, useEffect, useState } from "react";
import { Carousel } from "antd";
import { getAllSlider } from "../../service/sliderService";
const SliderComponet = () => {
  const [dataSlider, setDataSlider] = useState(null);
  const getAllSlides = async () => {
    const res = await getAllSlider();
    setDataSlider(res);
  };

  useEffect(() => {
    getAllSlides();
  }, []);
  return (
    <Carousel className="w-full" autoplay>
      {dataSlider?.slider?.map((item) =>
        item?.images?.map((i) => (
          <div
            key={i.id}
            className=" w-full  flex items-center justify-center max-h-[476px] md:px-[10%]"
          >
            <img src={i.url} alt="" className=" w-full  max-h-[500px] " />
          </div>
        ))
      )}
    </Carousel>
  );
};
export default memo(SliderComponet);
