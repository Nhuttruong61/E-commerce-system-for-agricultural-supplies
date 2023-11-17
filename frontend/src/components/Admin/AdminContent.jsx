import React, { memo } from "react";
import AdminUser from "./AdminUser";
import Adminproduct from "./AdminProduct/Adminproduct";
import AdminOrder from "./AdminOrder";
import AdminEvent from "./AdminEvent";
import AdminInbox from "./Inbox/AdminInbox";
import AdminCategory from "./AdminCategory";
import AdminFeeTransport from "./AdminFeeTransport";
import ProductAboutToExpire from "./AdminProduct/ProductAboutToExpire";
import ProductExpire from "./AdminProduct/ProductExpire";
import CreateBlog from "./AdminBlog/CreateBlog";
import AdminBlog from "./AdminBlog/AdminBlog";
import Dashboard from "./Dashboard";
import SliderAdmin from "./SliderAdmin";
import AdminStatistical from "./AdminStatistical";
import AdminCoupon from "./AdminCoupon";
import AdminForum from "./Adminforum";
function AdminContent({ active }) {
  let content = null;
  if (active === 1) {
    content = <Dashboard />;
  } else if (active === 2) {
    content = <AdminUser />;
  } else if (active === 3) {
    content = <AdminCategory />;
  } else if (active === 4) {
    content = <Adminproduct />;
  } else if (active === 5) {
    content = <AdminOrder />;
  } else if (active === 6) {
    content = <AdminEvent />;
  } else if (active === 7) {
    content = <AdminInbox />;
  } else if (active === 8) {
    content = <AdminForum />;
  } else if (active === 9) {
    content = <AdminFeeTransport />;
  } else if (active === 10) {
    content = <ProductAboutToExpire />;
  } else if (active === 11) {
    content = <ProductExpire />;
  } else if (active === 12) {
    content = <CreateBlog />;
  } else if (active === 13) {
    content = <AdminBlog />;
  } else if (active === 15) {
    content = <AdminStatistical />;
  } else if (active === 16) {
    content = <AdminCoupon />;
  } else if (active === 17) {
    content = <SliderAdmin />;
  }
  return (
    <div className="flex w-full h-[90vh] overflow-y-auto overflow-x-auto">
      {content}
    </div>
  );
}

export default memo(AdminContent);
