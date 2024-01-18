import React, { useEffect, useState } from "react";
import SliderComponet from "../components/Layout/Slider";
import Categories from "../components/Layout/Categories";
import Popular from "../components/Layout/Popular";
import Newproduct from "../components/Layout/Newproduct";
import Event from "../components/Layout/Event";
import Footer from "../components/Layout/Footer";
import Outstanding from "../components/Layout/Discount";
import Inbox from "../components/Inbox/Inbox";
import Slick from "../components/Slick";
import News from "../components/Layout/News";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
function HomePage() {
  const [checkData, setCheckData] = useState(false);
  const { product } = useSelector((state) => state.product);
  useEffect(() => {
    if (product?.data.length !== 0) {
      setCheckData(true);
    }
  }, [product]);
  return (
    <div className="bg-[#f4f1f4]">
      <Loading isLoading={!checkData}>
        <SliderComponet />
        <Slick />
        <Categories />
        <Popular />
        <Newproduct />
        <Event />
        <Outstanding />
        <News />
        <Inbox />
      </Loading>
      <Footer />
    </div>
  );
}

export default HomePage;
