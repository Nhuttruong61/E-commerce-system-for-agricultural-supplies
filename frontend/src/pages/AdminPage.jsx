import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../components/Admin/HeaderAdmin";
import SideBarAdmin from "../components/Admin/SideBarAdmin";
import AdminContent from "../components/Admin/AdminContent";

function AdminPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isAdmin = user.isAuthenticated && user?.account?.role === "admin";
  const [active, setActive] = useState(1);
  if (!isAdmin) {
    return navigate("/");
  }
  return (
    <div>
      <HeaderAdmin />
      <div className="flex w-full">
        <div className="w-[80px] 800px:w-[300px]">
          <SideBarAdmin active={active} setActive={setActive} />
        </div>
        <AdminContent active={active} />
      </div>
    </div>
  );
}

export default AdminPage;
