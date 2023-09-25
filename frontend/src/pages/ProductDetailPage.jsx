import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail.jsx";
function ProductDetailPage() {
  const { id } = useParams();
  return (
    <div className="md:px-[10%]  h-full ">
      <p className="text-[80%] md:text-[100%] font-[600]">Sản phẩm</p>
      <ProductDetail id={id} />
    </div>
  );
}

export default ProductDetailPage;
