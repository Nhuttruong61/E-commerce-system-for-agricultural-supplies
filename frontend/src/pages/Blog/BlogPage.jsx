import React, { useEffect, useState } from "react";
import Footer from "../../components/Layout/Footer";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../../redux/action/blog";
import { useNavigate } from "react-router-dom";
import moment from "moment";
function BlogPage() {
  const blogs = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllBlog());
    setIsLoading(false);
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (id) => {
    navigate(`/blog/${id}`);
  };
  return (
    <Loading isLoading={isLoading}>
      <div className=" min-h-[100vh] bg-[#f4f1f4f4]">
        <div className="md:px-[10%] py-5">
          {blogs?.data?.map((item) => {
            return (
              <div
                className="flex py-2 cursor-pointer"
                key={item._id}
                onClick={() => handleNavigate(item._id)}
              >
                <div className="w-[20%]">
                  <img src={item?.content[0]?.images.url} alt="" />
                </div>
                <div className="w-[80%]  px-2">
                  <p className="font-[600] md:text-[1.8rem]">{item?.title}</p>
                  <p>{item.content[0].description[0].substring(0, 200)}...</p>
                  <p className=" w-full py-2 text-[#cabebe]">
                    {moment(item.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </Loading>
  );
}

export default BlogPage;
