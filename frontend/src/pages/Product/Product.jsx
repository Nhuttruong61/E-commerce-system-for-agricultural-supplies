import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCart from "../../components/Product/ProductCart";
import Loading from "../../components/Loading";
import Footer from "../../components/Layout/Footer";
import { Pagination } from "antd";
import Inbox from "../../components/Inbox/Inbox";

function Product() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");
  const nameParam = searchParams.get("name");
  const products = useSelector((state) => state.product);
  const { data } = useSelector((state) => state.event);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dataProduct, setDataProduct] = useState([]);
  const [productData, setProductData] = useState(null);
  const [dataProductEvent, setDataProductEvent] = useState([]);
  const [selectedOption, setSelectedOption] = useState("all");
  const [dataProductFillter, setDataProductFillter] = useState([]);
  useEffect(() => {
    if (products) {
      const res = products.data;
      setIsLoading(false);
      const unExpiredProducts = res.filter((item) => {
        return isNotExpired(new Date(item.expirationDate));
      });
      setProductData(unExpiredProducts);
    }
  }, [products]);

  useEffect(() => {
    if (!productData) return;
    let filteredData = productData;
    if (categoryParam) {
      filteredData = productData.filter(
        (item) => item.category.categoryid.name === categoryParam
      );
    }
    if (nameParam) {
      filteredData = productData.filter((item) =>
        item.name.toLowerCase().includes(nameParam.toLowerCase())
      );
    }
    setDataProduct(filteredData);
    setCurrentPage(1);
  }, [categoryParam, productData, nameParam]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataProductFillter.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const eventId = data?.map((item) => {
      return {
        idProductEvent: item.product[0]._id,
        discount: item.discount,
      };
    });
    const updatedDataSort = dataProduct.map((item) => {
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

    setDataProductEvent(updatedDataSort);
  }, [dataProduct, selectedOption]);
  const isNotExpired = (expirationDate) => {
    const currentDate = new Date();
    return expirationDate > currentDate;
  };
  useEffect(() => {
    if (
      selectedOption === "all" &&
      dataProductEvent &&
      dataProductEvent.length > 0
    ) {
      setDataProductFillter(dataProductEvent);
    } else if (selectedOption === "asc") {
      const res = dataProductEvent?.sort((a, b) => a.price - b.price);
      setDataProductFillter(res);
    } else if (selectedOption === "desc") {
      const res = dataProductEvent?.sort((a, b) => b.price - a.price);
      setDataProductFillter(res);
    } else if (selectedOption === "newest") {
      const res = dataProductEvent?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setDataProductFillter(res);
    } else if (selectedOption === "oldest") {
      const res = dataProductEvent?.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setDataProductFillter(res);
    }
  }, [selectedOption, dataProductEvent]);
  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4] md:min-h-[100vh]">
        <div className="w-full justify-between flex md:px-10 py-2 items-center">
          <span className="flex font-[600]">
            Có tất cả{" "}
            <p className="text-red-600 px-1">{currentItems.length} </p>sản phẩm
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
        <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 md:p-6">
          {currentItems.length !== 0 ? (
            currentItems.map((item, index) => (
              <ProductCart key={index} item={item} />
            ))
          ) : (
            <div className="flex w-full justify-center items-center">
              <h1 className="font-[600]">Không có sản phẩm</h1>
            </div>
          )}
        </div>
        {currentItems.length !== 0 && (
          <div className="grid grid-cols-1 justify-center items-center text-center py-4">
            <Pagination
              current={currentPage}
              total={dataProduct.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        )}
        <Inbox />
      </div>
      <Footer />
    </Loading>
  );
}

export default memo(Product);
