import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCart from "../components/Product/ProductCart";
import Loading from "../components/Loading";
import Footer from "../components/Layout/Footer";
import Inbox from "../components/Inbox/Inbox";
import { isNotExpired } from "../until";

function BestSelling() {
  const products = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("all");
  const [dataProductFillter, setDataProductFillter] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      if (products?.data && products.data.length > 0) {
        const unExpiredProducts = products?.data?.filter((item) => {
          return isNotExpired(new Date(item.expirationDate));
        });
        const filterProductgift = unExpiredProducts
          ?.map((item) =>
            item?.gifts?.length > 0 ? item?.gifts?.map((gift) => gift) : null
          )
          .filter((item) => item !== null)
          .flat();
        const dataProductgift = unExpiredProducts?.filter((item) => {
          return !filterProductgift.includes(item._id);
        });
        const sortedData = dataProductgift
          .filter((el) => el?.receipt !== "")
          .sort((a, b) => b.sold_out - a.sold_out)
          .slice(0, 10);

        setData(sortedData);
      }
      setIsLoading(false);
    }, 300);
  }, [products, selectedOption]);
  useEffect(() => {
    if (selectedOption === "all" && data && data.length > 0) {
      setDataProductFillter(data);
    } else if (selectedOption === "asc") {
      const res = data?.sort((a, b) => a.price - b.price);
      setDataProductFillter(res);
    } else if (selectedOption === "desc") {
      const res = data?.sort((a, b) => b.price - a.price);
      setDataProductFillter(res);
    } else if (selectedOption === "newest") {
      const res = data?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setDataProductFillter(res);
    } else if (selectedOption === "oldest") {
      const res = data?.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setDataProductFillter(res);
    }
  }, [selectedOption, data]);

  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4] min-h-[100vh] ">
        {dataProductFillter?.length > 0 && (
          <div className="w-full justify-between flex  py-2 items-center  md:px-[10%]">
            <span className="md:flex font-[600] hidden">
              Có tất cả <p className="text-red-600 px-1">{data.length} </p>sản
              phẩm
            </span>
            <div className="flex items-center">
              <p className="font-[600] pr-4">Sắp xếp theo:</p>
              <select
                className="outline-none font-[600] py-1 rounded px-2"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="all">Tất cả sản phẩm</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 md:p-6 md:px-[10%]">
          {dataProductFillter.map((item, index) => (
            <ProductCart key={index} item={item} />
          ))}
        </div>
        <Inbox />
        <Footer />
      </div>
    </Loading>
  );
}

export default BestSelling;
