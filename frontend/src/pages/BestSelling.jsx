import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCart from "../components/Product/ProductCart";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

function BestSelling() {
  const products = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let delay = 300;
    setTimeout(() => {
      if (products?.data && products.data.length > 0) {
        const sortedData = products.data
          .slice()
          .sort((a, b) => b.sold_out - a.sold_out)
          .slice(0, 10);

        setData(sortedData);
      }

      setIsLoading(false);
    }, delay);
  }, [products]);

  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4] md:min-h-[100vh]">
        <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 md:p-6">
          {data.map((item, index) => (
            <ProductCart key={index} item={item} />
          ))}
        </div>
        <Footer />
      </div>
    </Loading>
  );
}

export default BestSelling;
