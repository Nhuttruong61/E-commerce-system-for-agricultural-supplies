import React, { useEffect, useState } from "react";
import SliderComponet from "../components/Layout/Slider";
import Categories from "../components/Layout/Categories";
import Popular from "../components/Layout/Popular";
import Newproduct from "../components/Layout/Newproduct";
import Event from "../components/Layout/Event";
import Footer from "../components/Layout/Footer";
import Outstanding from "../components/Layout/Discount";
import Inbox from "../components/Inbox/Inbox";
import Slick from "../components/Effect/Slick";
import News from "../components/Layout/News";

function HomePage() {
  return (
    <div className="bg-[#f4f1f4]">
      <SliderComponet />
      <Slick />
      <Categories />
      <Popular />
      <Newproduct />
      <Event />
      <Outstanding />
      <News />
      <Inbox />

      <Footer />
    </div>
  );
}

export default HomePage;
