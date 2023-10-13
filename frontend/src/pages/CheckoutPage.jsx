import React from "react";
import Footer from "../components/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import CheckOutContent from "../components/Checkout/CheckOutContent";

function CheckoutPage() {
  return (
    <div className="bg-[#f4f1f4]">
      <CheckoutSteps current={1} />
      <CheckOutContent />
      <Footer />
    </div>
  );
}

export default CheckoutPage;
