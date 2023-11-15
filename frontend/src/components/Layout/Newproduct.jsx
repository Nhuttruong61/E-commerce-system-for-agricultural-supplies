import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slick from "../Slick";
import { isNotExpired } from "../../until";
import ProductCart from "../Product/ProductCart";
function Newproduct() {
  const products = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [productData, setProductData] = useState(null);
  const [dataSort, setDataSort] = useState([]);
  const [dataNewProduct, setDataNewProduct] = useState([]);
  useEffect(() => {
    if (products) {
      let res = products?.data;
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
    const filterProduct = () => {
      if (productData) {
        const clonedProductData = [...productData];
        const sortedProduct = clonedProductData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const res = sortedProduct?.slice(0, 6);
        setDataSort(res);
      }
    };
    filterProduct();
  }, [productData]);
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
    const unExpiredProducts = updatedDataSort.filter((item) => {
      return isNotExpired(new Date(item.expirationDate));
    });

    setDataNewProduct(unExpiredProducts);
  }, [dataSort]);

  return (
    <div className=" p-6 rounded-lg   md:px-[2%]">
      <div className=" flex justify-center text-center items-center">
        <p className="  mt-4 mb-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
          SẢN PHẨM MỚI
        </p>
      </div>
      <Slick>
        {dataNewProduct?.map((item, index) => (
          <div key={index} className="px-4">
            <ProductCart item={item} />
          </div>
        ))}
      </Slick>
    </div>
  );
}

export default memo(Newproduct);
