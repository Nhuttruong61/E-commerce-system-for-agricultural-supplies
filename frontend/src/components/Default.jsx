import React from "react";
import Header from "./Header";

function DefaultComponet({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DefaultComponet;
