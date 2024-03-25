import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ProductCart from "../Product/ProductCart";
import { isNotExpired } from "../../until";
function Popular() {
  const productData = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [dataSort, setDataSort] = useState([]);
  const [dataPopular, setDataPopular] = useState([]);

  useEffect(() => {
    const allProduct = productData?.data ? [...productData?.data] : [];
    const sortedProduct = allProduct?.sort((a, b) => b.sold_out - a.sold_out);
    const unExpiredProducts = sortedProduct.filter((item) => {
      return isNotExpired(new Date(item.expirationDate));
    });
    const filterProductgift = unExpiredProducts
      ?.map((item) =>
        item?.gifts?.length > 0 ? item.gifts?.map((gift) => gift) : null
      )
      .filter((item) => item !== null)
      .flat();
    const dataProductgift = unExpiredProducts?.filter((item) => {
      return !filterProductgift.includes(item._id);
    });
    const data =
      dataProductgift &&
      dataProductgift.filter((el) => el?.receipt !== "").slice(0, 5);
    setDataSort(data);
  }, []);
  useEffect(() => {
    const eventId = data?.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const updatedDataSort = dataSort?.map((item) => {
      const event = eventId?.find(
        (eventItem) => eventItem.idProductEvent === item._id
      );
      if (event) {
        return {
          ...item,
          distCount: item.distCount + event.discount,
        };
      }
      return item;
    });

    setDataPopular(updatedDataSort);
  }, [dataSort]);

  return (
    <div className=" p-6 rounded-lg   md:px-[10%]">
      <div className=" flex justify-center text-center items-center">
        <p className="  mt-4 mb-8 font-[700] md:text-[32px] text-[20px]  px-6 text-[#555555] ">
          PHỔ BIẾN
        </p>
      </div>
      <div className="grid gap-[5px] mx-1 lg:grid-cols-5 md:grid-cols-3 grid-cols-2  md:gap-[10px]  lg:gap-[20px]  xl:gap-[30px]">
        {dataPopular && dataPopular.length !== 0 && (
          <>
            {dataPopular &&
              dataPopular.map((i, index) => (
                <ProductCart key={index} item={i} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Popular);
