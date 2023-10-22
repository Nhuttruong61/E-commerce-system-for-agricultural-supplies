import React, { memo } from "react";
import AdminUser from "./AdminUser";
import Adminproduct from "./AdminProduct/Adminproduct";
import AdminOrder from "./AdminOrder";
import AdminEvent from "./AdminEvent";
import AdminInbox from "./Inbox/AdminInbox";
import AdminCategory from "./AdminCategory";
import AdminFAQ from "./AdminFAQ";
import AdminFeeTransport from "./AdminFeeTransport";
import ProductAboutToExpire from "./AdminProduct/ProductAboutToExpire";
import ProductExpire from "./AdminProduct/ProductExpire";
import CreateBlog from "./AdminBlog/CreateBlog";
import AdminBlog from "./AdminBlog/AdminBlog";

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
  } else if (active === 11) {
    content = <CreateBlog />;
  } else if (active === 12) {
    content = <AdminBlog />;
  }
  return (
    <div className="flex w-full h-[90vh] overflow-y-auto overflow-x-auto">
      {content}
    </div>
  );
}

export default memo(AdminContent);
