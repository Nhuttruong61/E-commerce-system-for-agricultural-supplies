import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../service/productService";
import { getAllProductRd } from "../redux/action/productAction";
import { useQuery } from "@tanstack/react-query";
import ProductCart from "./ProductCart";

function Popular() {
  const dispatch = useDispatch();
  const [dataSort, setDataSort] = useState([]);
  const getAllProduct = async () => {
    const res = await getAllProducts();
    dispatch(getAllProductRd(res));
    return res;
  };
  const { isLoading, data: productData } = useQuery({
    queryKey: ["product"],
    queryFn: getAllProduct,
  });

  useEffect(() => {
    const allProduct = productData?.product ? [...productData.product] : [];
    const sortedProduct = allProduct?.sort((a, b) => b.sold_out - a.sold_out);
    const data = sortedProduct?.slice(0, 5);
    setDataSort(data);
  }, [productData]);
  return (
    <div className="text-white  p-6 rounded-lg mb-12  md:px-[10%]">
      <p className=" flex justify-center my-8 font-[700] md:text-[32px] text-[20px]">
        Phổ biến
      </p>
      <div className="grid gap-[5px] mx-1 grid-cols-4 md:gap-[10px] lg:grid-cols-5 lg:gap-[20px]  xl:gap-[30px]">
        {dataSort && dataSort.length !== 0 && (
          <>
            {dataSort && dataSort.map((i, index) => <ProductCart item={i} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default Popular;
