import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../../components/Product/ProductDetail";
import Footer from "../../components/Layout/Footer.jsx";
import Inbox from "../../components/Inbox/Inbox";
function ProductDetailPage() {
  const { id } = useParams();
  return (
    <div className=" h-full ">
      <ProductDetail id={id} />
      <Inbox />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
