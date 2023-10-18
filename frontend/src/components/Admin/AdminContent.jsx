import React from "react";
import AdminUser from "./AdminUser";
import Adminproduct from "./AdminProduct/Adminproduct";
import AdminOrder from "./AdminOrder";
import AdminEvent from "./AdminEvent";
import AdminInbox from "./AdminInbox";
import AdminCategory from "./AdminCategory";
import AdminFAQ from "./AdminFAQ";
import AdminFeeTransport from "./AdminFeeTransport";
import ProductAboutToExpire from "./AdminProduct/ProductAboutToExpire";
import ProductExpire from "./AdminProduct/ProductExpire";

function AdminContent({ active }) {
  let content = null;
  if (active === 1) {
    content = <AdminUser />;
  } else if (active === 2) {
    content = <AdminCategory />;
  } else if (active === 3) {
    content = <Adminproduct />;
  } else if (active === 4) {
    content = <AdminOrder />;
  } else if (active === 5) {
    content = <AdminEvent />;
  } else if (active === 6) {
    content = <AdminInbox />;
  } else if (active === 7) {
    content = <AdminFAQ />;
  } else if (active === 8) {
    content = <AdminFeeTransport />;
  } else if (active === 9) {
    content = <ProductAboutToExpire />;
  } else if (active === 10) {
    content = <ProductExpire />;
  }
  return <div className="flex w-full overflow-x-auto">{content}</div>;
}

export default AdminContent;
