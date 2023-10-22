import React from "react";
import SliderComponet from "../components/Layout/Slider";
import Categories from "../components/Categories";
import Popular from "../components/Layout/Popular";
import Newproduct from "../components/Layout/Newproduct";
import Event from "../components/Events/Event";
import Footer from "../components/Layout/Footer";
import Outstanding from "../components/Discount";
import Inbox from "../components/Inbox/Inbox";

function HomePage() {
  return (
    <div className="bg-[#f4f1f4]">
      <SliderComponet />
      <Categories />
      <Popular />
      <Newproduct />
      <Event />
      <Outstanding />
      <Inbox />
      <Footer />
    </div>
  );
}

export default HomePage;
