import React from "react";
import AdminUser from "./AdminUser";
import Adminproduct from "./Adminproduct";
import AdminOrder from "./AdminOrder";
import AdminEvent from "./AdminEvent";
import AdminInbox from "./AdminInbox";
import AdminCoupons from "./AdminCoupons";

function AdminContent({ active }) {
  let content = null;
  if (active === 1) {
    content = <AdminUser />;
  } else if (active === 2) {
    content = <Adminproduct />;
  } else if (active === 3) {
    content = <AdminOrder />;
  } else if (active === 4) {
    content = <AdminEvent />;
  } else if (active === 5) {
    content = <AdminInbox />;
  } else if (active === 6) {
    content = <AdminCoupons />;
  }
  return <div className="flex w-full overflow-x-auto">{content}</div>;
}

export default AdminContent;
