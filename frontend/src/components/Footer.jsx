import React from "react";
import logo from "../assets/logo/logo.png";
import { Link } from "react-router-dom";
import {
  FacebookFilled,
  YoutubeFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { footerProductLinks, footerSupportLinks } from "../static/data";
function Footer() {
  return (
    <div className=" flex flex-col ">
      <div className=" md:flex md:justify-between md:items-center bg-[#73C509] p-2">
        <h1 className=" md:mb-0 mb-6 md:w-2/5 lg:text-3xl text-2xl font-[700]">
          <span className="text-red-500">Đăng ký </span>
          <span className="text-white">nhận tin khi có sự kiện mới</span>
        </h1>
        <div className="md:px-[4%]">
          <input
            type="text"
            placeholder="Nhập email của bạn...."
            className="text-[#545252] sm:w-72 w-full sm:mr-5 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
          />
          <button className="bg-red-700 p-2 px-4 rounded font-[600] hover:bg-red-800 text-white">
            Đăng ký
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3  grap-6 sm:px-8 px-5 py-8 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img src={logo} alt="" className="w-[90px]" />
          <p className=" font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4b8600] to-[#e49200]">
            Nông Nghiệp Xanh
          </p>
          <p className="font-[600]">Uy tính - Chất lượng - Bền vững </p>
          <div className="flex my-2">
            <Link to="https://www.facebook.com/profile.php?id=100007950272205">
              <FacebookFilled
                className="text-blue-700 mx-2 "
                style={{ fontSize: "32px" }}
              />
            </Link>
            <Link to="/">
              <YoutubeFilled
                className="text-red-700 mx-2 "
                style={{ fontSize: "32px" }}
              />
            </Link>
            <Link to="/">
              <TwitterCircleFilled
                className="text-blue-500 mx-2 "
                style={{ fontSize: "32px" }}
              />
            </Link>
          </div>
        </ul>
        <ul className="text-center sm:text-start">
          <h1 className="font-[600]">Công ty</h1>
          {footerProductLinks.map((link) => {
            return (
              <li key={link.name}>
                <Link
                  className="hover:text-[#4b8600] duration-300"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="text-center sm:text-start">
          <h1 className="font-[600]">Hổ trợ</h1>
          {footerSupportLinks.map((link) => {
            return (
              <li key={link.name}>
                <Link
                  className="hover:text-[#4b8600] duration-300"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:px-8 px-5 py-2 text-center bg-[#73c509] text-white">
        <span className="font-[600]">Copyright 2023 Nongsanxanh.com</span>
      </div>
    </div>
  );
}

export default Footer;
