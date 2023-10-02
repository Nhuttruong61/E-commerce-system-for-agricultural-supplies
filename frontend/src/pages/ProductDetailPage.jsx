import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/Product/ProductDetail";
import Footer from "../components/Footer.jsx";
function ProductDetailPage() {
  const { id } = useParams();
  return (
    <div className=" h-full ">
      <ProductDetail id={id} />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
