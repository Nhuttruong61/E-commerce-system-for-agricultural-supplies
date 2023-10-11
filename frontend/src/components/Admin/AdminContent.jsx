import React from "react";
import AdminUser from "./AdminUser";
import Adminproduct from "./Adminproduct";
import AdminOrder from "./AdminOrder";
import AdminEvent from "./AdminEvent";
import AdminInbox from "./AdminInbox";
import AdminCategory from "./AdminCategory";
import AdminFAQ from "./AdminFAQ";

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
  }
  return <div className="flex w-full overflow-x-auto">{content}</div>;
}

export default AdminContent;
