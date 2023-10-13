import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCart from "./Product/ProductCart";

function Discount() {
  const products = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [productData, setProductData] = useState([]);
  const [dataSort, setDataSort] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
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
    const eventId = dataEvent.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const updatedDataSort = productData?.map((item) => {
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

    setDataProduct(updatedDataSort);
  }, [productData, dataEvent]);
  useEffect(() => {
    const fillterDiscount = () => {
      if (dataProduct) {
        const clonedProductData = [...dataProduct];
        const res = clonedProductData.filter((item) => item.distCount > 0);
        setDataSort(res);
      }
    };
    fillterDiscount();
  }, [dataProduct]);
  return (
    <div>
      <div className=" p-6 rounded-lg mb-12  md:px-[10%]">
        <div className=" flex justify-center text-center items-center">
          <p className="  my-8 font-[700] md:text-[32px] text-[20px] border px-6 bg-[#4b8600] text-white rounded-[20px]">
            Khuyến mãi
          </p>
        </div>
        <div className="grid gap-[5px] mx-1 grid-cols-4 md:gap-[10px] lg:grid-cols-5 lg:gap-[20px]  xl:gap-[30px]">
          {dataSort && dataSort.length !== 0 && (
            <>
              {dataSort &&
                dataSort.map((i, index) => (
                  <ProductCart key={index} item={i} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discount;
