import React from "react";
import SliderComponet from "../components/Slider";
import Categories from "../components/Categories";
import Popular from "../components/Popular";
import Newproduct from "../components/Newproduct";
import Event from "../components/Events/Event";
import Footer from "../components/Footer";
import Header from "../components/Header";

function HomePage() {
  return (
    <div className="bg-[#f4f1f4]">
      <SliderComponet />
      <Categories />
      <Popular />
      <Newproduct />
      <Event />
      <Footer />
    </div>
  );
}

export default HomePage;
