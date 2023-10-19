import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as BlogService from "../service/blogService";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
function BlogDetailPage() {
  const { id } = useParams();
  const [dataBlog, setDataBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getBlog = async () => {
      try {
        setIsLoading(true);
        const res = await BlogService.getABlog(id);
        setIsLoading(false);
        if (res.success) {
          setDataBlog(res.blog);
        }
        console.log("res", res);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    getBlog();
  }, [id]);
  console.log("dataBlog", dataBlog);
  return (
    <Loading isLoading={isLoading}>
      <div className="w-full min-h-[100vh] bg-[#f4f1f4f4]">
        <div className="md:px-[10%] py-5">
          <p className="font-[600] md:text-[1.8rem]">{dataBlog?.title}</p>
          {dataBlog?.content?.map((item) => {
            return (
              <div key={item._id}>
                <p className="font-[600] md:text-[1.2rem] py-2">
                  {item.heading}
                </p>
                <div className=" flex w-full  ">
                  <img
                    src={item?.images.url}
                    alt=""
                    className="w-320px h-[320px]"
                  />
                </div>
                {item?.description?.map((item) => {
                  return (
                    <p
                      key={item._id}
                      className="py-1 text-justify md:text-[1rem]"
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </Loading>
  );
}

export default BlogDetailPage;
