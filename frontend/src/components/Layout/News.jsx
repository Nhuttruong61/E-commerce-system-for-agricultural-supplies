import React, { memo, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAllBlog } from "../../service/blogService";

function News() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataBog, setDataBlog] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBlog();
      setData(res.blog);
      setIsLoading(false);
    } catch (err) {}
  };
  useEffect(() => {
    const res = data?.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const fillters = res?.splice(0, 3);
    setDataBlog(fillters);
  }, [data]);
  useEffect(() => {
    fetchBlog();
  }, []);
  return (
    <div className=" flex justify-center text-center items-center flex-col md:px-[10%] py-2">
      <p className="   mt-4 mb-8 font-[700] md:text-[32px] text-[20px]  px-6 text-[#555555] ">
        TIN TỨC MỚI NHẤT
      </p>
      <div className="  justify-center   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
        {dataBog?.map((item) => {
          return (
            <div
              key={item._id}
              className="shadow mx-2 py-2 px-2 cursor-pointer w-full hover:shadow-[#0e9c49] hover:-translate-y-1 bg-white"
              onClick={() => {
                navigate(`/blog/${item._id}`);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <div className="w-full flex justify-center md:h-[40vh]">
                <img
                  src={item?.content[0].images.url}
                  alt=""
                  className=" object-cover max-h-[44vh]"
                />
              </div>
              <p className="py-2 font-[600] md:text-[120%]">
                {item?.title.length > 50
                  ? item?.title.slice(0, 50) + "..."
                  : item?.title}
              </p>
              <p className="text-[#aba8a8] py-2">
                {item?.content[0]?.description[0]?.slice(0, 200) + "..."}
              </p>
              <p className=" bottom-0 py-2 right-0 text-[#ccc] px-2 flex justify-end ">
                {moment(item?.createdAt).fromNow()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(News);
