import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCart from "./Product/ProductCart";

function Newproduct() {
  const products = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [productData, setProductData] = useState(null);
  const [dataSort, setDataSort] = useState([]);
  const [dataNewProduct, setDataNewProduct] = useState([]);
  const [dataEvent, setDataEvent] = useState([]);
  useEffect(() => {
    if (data) {
      setDataEvent(data);
    } else {
      setDataEvent([]);
    }
  }, [data]);
  useEffect(() => {
    if (products) {
      let res = products.data;
      setProductData(res);
    }
  }, [products]);
  useEffect(() => {
    const filterProduct = () => {
      if (productData) {
        const clonedProductData = [...productData];
        const sortedProduct = clonedProductData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const res = sortedProduct?.slice(0, 5);
        setDataSort(res);
      }
    };
    filterProduct();
  }, [productData]);
  useEffect(() => {
    const eventId = dataEvent.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const updatedDataSort = dataSort.map((item) => {
      const event = eventId.find(
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

    setDataNewProduct(updatedDataSort);
  }, [dataSort, dataEvent]);
  return (
    <div className=" p-6 rounded-lg mb-12  md:px-[10%]">
      <div className=" flex justify-center text-center items-center">
        <p className="  my-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#0e9c49] text-white rounded-[20px]">
          Sản phẩm mới
        </p>
      </div>
      <div className="grid gap-[5px] mx-1 grid-cols-4 md:gap-[10px] lg:grid-cols-5 lg:gap-[20px]  xl:gap-[30px]">
        {dataNewProduct && dataNewProduct.length !== 0 && (
          <>
            {dataNewProduct &&
              dataNewProduct.map((i, index) => (
                <ProductCart key={index} item={i} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Newproduct;
