import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
function HeaderAdmin() {
  const user = useSelector((state) => state.user);
  return (
    <div className="flex justify-between h-[74px] items-center md:px-8 w-full px-1 bg-white z-20 shadow">
      <Link to="/" className=" w-[25%] flex items-center">
        <img src={logo} alt="" className=" md:w-[12.5%] w-[40%]" />
        <p className="text-xs md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4b8600] to-[#e49200]">
          Nông Nghiệp Xanh
        </p>
      </Link>
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
