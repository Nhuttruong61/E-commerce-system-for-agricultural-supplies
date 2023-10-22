import React, { memo } from "react";
import Header from "./Layout/Header";

function DefaultComponet({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default memo(DefaultComponet);
