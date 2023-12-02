import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCart from "../../components/Product/ProductCart";
import Loading from "../../components/Loading";
import Footer from "../../components/Layout/Footer";
import { Pagination } from "antd";
import Inbox from "../../components/Inbox/Inbox";
import { isNotExpired } from "../../until";

function Product() {
  const category = useSelector((state) => state.category);
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
  const [dataProductArrange, setDataProductArrange] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dataProductFillter, setDataProductFillter] = useState([]);
  const [priceRanges, setPriceRanges] = useState({
    under100: false,
    from100to500: false,
    over500: false,
  });
  const [initialCheckboxState, setInitialCheckboxState] = useState({
    under100: false,
    from100to500: false,
    over500: false,
  });

  const [dataProductFillterPrice, setDataProductFillterPrice] = useState([]);
  const [isCheckFilterPrice, setIsCheckFilterPrice] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (products) {
        const res = products.data;
        setIsLoading(false);
        const unExpiredProducts = res.filter((item) => {
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

        setProductData(dataProductgift);
      }
    }, 300);
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
  const currentItems =
    dataProductFillterPrice && isCheckFilterPrice === true
      ? dataProductFillterPrice.slice(indexOfFirstItem, indexOfLastItem)
      : dataProductFillter.slice(indexOfFirstItem, indexOfLastItem);

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
  }, [dataProduct, selectedOption, data]);

  useEffect(() => {
    if (selectedOption === "all") {
      setDataProductArrange(dataProductEvent);
    } else if (selectedOption === "asc") {
      const res = dataProductEvent?.sort((a, b) => a.price - b.price);
      setDataProductArrange(res);
    } else if (selectedOption === "desc") {
      const res = dataProductEvent?.sort((a, b) => b.price - a.price);
      setDataProductArrange(res);
    } else if (selectedOption === "newest") {
      const res = dataProductEvent?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setDataProductArrange(res);
    } else if (selectedOption === "oldest") {
      const res = dataProductEvent?.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setDataProductArrange(res);
    }
  }, [selectedOption, dataProductEvent]);

  const handleCheckboxChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  useEffect(() => {
    const res = dataProductArrange.filter((item) => {
      if (selectedCategories.length === 0) {
        return true;
      }
      const productCategories = item?.category?.categoryid?._id;
      return selectedCategories.includes(productCategories);
    });

    setDataProductFillter(res);
  }, [selectedCategories, dataProductArrange]);
  useEffect(() => {
    setInitialCheckboxState({
      under100: priceRanges.under100,
      from100to500: priceRanges.from100to500,
      over500: priceRanges.over500,
    });
  }, []);
  const handleCheckboxChangePrice = (e) => {
    const { name, checked } = e.target;
    setPriceRanges({
      ...priceRanges,
      [name]: checked,
    });
    if (initialCheckboxState[name] !== checked) {
      setIsCheckFilterPrice(true);
    } else {
      setIsCheckFilterPrice(false);
    }
  };
  useEffect(() => {
    const res = dataProductFillter?.filter((item) => {
      if (priceRanges.under100 && item.price <= 100000) {
        return item.price <= 100000;
      }
      if (
        priceRanges.from100to500 &&
        item.price > 100000 &&
        item.price <= 500000
      ) {
        return true;
      }
      if (priceRanges.over500 && item.price > 500000) {
        return true;
      }
      return false;
    });
    setDataProductFillterPrice(res);
  }, [priceRanges, dataProductFillter]);
  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4] px-2">
        {dataProductEvent?.length > 0 && (
          <div className="w-full justify-between flex md:px-10 py-2 items-center">
            <span className=" font-[600] hidden md:flex">
              Có tất cả{" "}
              <p className="text-red-600 px-1">{currentItems.length} </p>sản
              phẩm
            </span>
            <div className="flex items-center">
              <p className="font-[600] pr-4 ">Sắp xếp theo:</p>
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
        <div className="w-full flex ">
          <div className="md:w-[15%] shadow hidden md:block pb-1 bg-white">
            <div className="w-full bg-[#f69329] flex justify-center">
              <p className="font-[600] py-2 text-white">Lọc sản phẩm</p>
            </div>
            <div className="w-full py-1">
              <p className="px-2 font-[500]">Loại sản phẩm</p>
              {category?.data?.categories.map((item) => (
                <div key={item._id} className="flex px-2 py-1">
                  <input
                    type="checkbox"
                    id={item._id}
                    className="mr-1"
                    value={item._id}
                    onChange={() => handleCheckboxChange(item._id)}
                  />
                  <label className="cursor-pointer" htmlFor={item._id}>
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="w-full py-1">
              <p className="px-2 font-[500]">Giá sản phẩm</p>
              <div className="flex px-2 py-1">
                <input
                  type="checkbox"
                  name="under100"
                  id="under100"
                  checked={priceRanges.under100}
                  className="mr-1"
                  onChange={handleCheckboxChangePrice}
                />
                <label htmlFor="under100" className="cursor-pointer">
                  Dưới 100 nghìn
                </label>
              </div>
              <div className="flex px-2 py-1">
                <input
                  type="checkbox"
                  id="from100to500"
                  name="from100to500"
                  className="mr-1"
                  checked={priceRanges.from100to500}
                  onChange={handleCheckboxChangePrice}
                />
                <label htmlFor="from100to500" className="cursor-pointer">
                  Từ 100 nghìn đến 500 nghìn
                </label>
              </div>
              <div className="flex px-2 py-1">
                <input
                  type="checkbox"
                  id="over500"
                  className="mr-1"
                  name="over500"
                  checked={priceRanges.over500}
                  onChange={handleCheckboxChangePrice}
                />
                <label htmlFor="over500" className="cursor-pointer">
                  Hơn 500 nghìn
                </label>
              </div>
            </div>
          </div>
          <div className="md:w-[85%] w-full bg-[#f4f1f4]">
            <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] md:p-6">
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
          </div>
        </div>
        {currentItems.length !== 0 && (
          <div className="grid grid-cols-1 justify-center items-center text-center pb-4">
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
