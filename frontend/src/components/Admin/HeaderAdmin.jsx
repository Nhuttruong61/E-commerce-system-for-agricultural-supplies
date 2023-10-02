import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
function HeaderAdmin() {
  const user = useSelector((state) => state.user);
  return (
    <div className="w-full h-[80px] shadow sticky top-0 left-0 flex items-center justify-between">
      <div>
        <Link to="/system/admin" className="w-full flex items-center">
          <img src={logo} alt="" className=" w-[12%]" />
          <p className=" text-xs md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4b8600] to-[#e49200]">
            Nông Nghiệp Xanh
          </p>
        </Link>
      </div>
      <div className="flex items-center w-full flex-row-reverse mr-4">
        <div className="flex items-center ">
          <img
            className="w-[40px] h-[40px] object-cover rounded-full"
            src={user.account.avatar.url}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
