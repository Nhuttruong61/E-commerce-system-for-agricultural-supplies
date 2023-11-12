import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCart from "../Product/ProductCart";
import { isNotExpired } from "../../until";

function Discount() {
  const products = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [productData, setProductData] = useState([]);
  const [dataSort, setDataSort] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  useEffect(() => {
    if (products) {
      let res = products?.data?.filter((item) => {
        return isNotExpired(new Date(item.expirationDate));
      });
      const filterProductgift = res
        ?.map((item) =>
          item?.gifts?.length > 0 ? item.gifts.map((gift) => gift) : null
        )
        .filter((item) => item !== null)
        .flat();
      const dataProductgift = res?.filter((item) => {
        return !filterProductgift.includes(item._id);
      });

      setProductData(dataProductgift);
    }
  }, [products]);

  useEffect(() => {
    const eventId = data?.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const updatedDataSort = productData?.map((item) => {
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
    setDataProduct(updatedDataSort);
  }, [productData, data]);
  useEffect(() => {
    const fillterDiscount = () => {
      if (dataProduct) {
        const clonedProductData = [...dataProduct];
        const res = clonedProductData?.filter(
          (item) => item.distCount > 0 || item?.gifts?.length > 0
        );
        setDataSort(res);
      }
    };
    fillterDiscount();
  }, [dataProduct]);
  return (
    <div>
      <div className=" p-6 rounded-lg mb-12  md:px-[10%]">
        <div className=" flex justify-center text-center items-center">
          <p className="  my-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
            KHUYẾN MÃI
          </p>
        </div>
        <div className="grid gap-[5px] mx-1 lg:grid-cols-5 md:grid-cols-3 grid-cols-2  md:gap-[10px]  lg:gap-[20px]  xl:gap-[30px]">
          {dataSort && dataSort?.length !== 0 && (
            <>
              {dataSort &&
                dataSort?.map((i, index) => (
                  <ProductCart key={index} item={i} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Discount);
