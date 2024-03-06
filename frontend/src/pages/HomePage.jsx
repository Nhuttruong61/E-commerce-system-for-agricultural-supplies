import React, { Suspense, lazy } from "react";
import Footer from "../components/Layout/Footer";
import LoadingCpn from "../components/common/LoadingCpn";
const SliderComponet = lazy(() => import("../components/Layout/Slider"));
const Categories = lazy(() => import("../components/Layout/Categories"));
const Popular = lazy(() => import("../components/Layout/Popular"));
const Newproduct = lazy(() => import("../components/Layout/Newproduct"));
const Event = lazy(() => import("../components/Layout/Event"));
const Outstanding = lazy(() => import("../components/Layout/Discount"));
const Inbox = lazy(() => import("../components/Inbox/Inbox"));
const Slick = lazy(() => import("../components/Effect/Slick"));
const News = lazy(() => import("../components/Layout/News"));

function HomePage() {
  return (
    <div className="bg-[#f4f1f4] flex flex-col">
      <Suspense fallback={<LoadingCpn />}>
        <SliderComponet />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Slick />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Popular />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Newproduct />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Event />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Outstanding />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <News />
      </Suspense>
      <Suspense fallback={<LoadingCpn />}>
        <Inbox />
      </Suspense>
      <Footer />
    </div>
  );
}

export default HomePage;
