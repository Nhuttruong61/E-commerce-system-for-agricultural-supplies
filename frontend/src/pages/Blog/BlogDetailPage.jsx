import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as BlogService from "../../service/blogService";
import Loading from "../../components/common/Loading";
import Footer from "../../components/Layout/Footer";
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
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    getBlog();
  }, [id]);
  return (
    <Loading isLoading={isLoading}>
      <div className="w-full min-h-[100vh] bg-[#f4f1f4f4]">
        <div className="md:px-[10%] py-5 px-2">
          <p className="font-[600] md:text-[1.8rem]">{dataBlog?.title}</p>
        </div>
        <div
          className="px-[10%] text-justify md:text-[1rem] max-w-full imgrender"
          dangerouslySetInnerHTML={{
            __html: dataBlog?.content,
          }}
        ></div>
      </div>
      <Footer />
    </Loading>
  );
}

export default BlogDetailPage;
