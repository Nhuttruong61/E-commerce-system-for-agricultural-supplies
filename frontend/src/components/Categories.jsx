import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
function Categories() {
  const categories = useSelector((state) => state?.category.data);
  const navigate = useNavigate();
  return (
    <div className="  p-6 rounded-lg mb-12  md:px-[10%]">
      <div className=" flex justify-center text-center items-center">
        <p className="  my-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
          Loại sản phẩm
        </p>
      </div>
      <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px] ">
        {categories &&
          categories?.categories.map((i) => {
            const handleSubmit = (i) => {
              navigate(`/products?category=${i.name}`);
            };

            return (
              <div
                className="w-full h-auto flex items-center justify-center cursor-pointer overflow-hidden  p-2 rounded-[4px] shadow hover:shadow-[#5b5959]"
                key={i._id}
                onClick={() => handleSubmit(i)}
              >
                <div className="text-clip">
                  <span className=" p-2 rounded-[4px] overflow-hidden w-auto h-[120px] items-center flex justify-center">
                    <img
                      src={i?.images[0].url}
                      className=" w-[92px] object-cover rounded-[4px]"
                      alt=""
                    />
                  </span>
                  <h5
                    className={
                      "text-[80%] md:text-[100%] font-[600] leading-[1.3] text-center"
                    }
                  >
                    {i.name}
                  </h5>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default memo(Categories);
