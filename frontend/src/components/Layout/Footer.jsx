import React, { memo } from "react";
import logo from "../../assets/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FacebookFilled,
  YoutubeFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { FaEarthAsia } from "react-icons/fa6";
import { footerProductLinks, footerSupportLinks } from "../../static/data";
function Footer() {
  const navigate = useNavigate();
  const handlePhoneClick = () => {
    const callPhone = "tel:0384999999";
    window.location.href = callPhone;
  };
  const handleEmailClick = () => {
    const email = "Nongnghiepxanh.com";
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };
  return (
    <div className=" flex flex-col ">
      <div className=" md:flex md:justify-between md:items-center bg-[#009b49] p-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-3  grap-6 sm:px-8 px-5 py-8 sm:text-center bg-white">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <div className="md:flex items-center">
            <div className="flex justify-center">
              <img src={logo} alt="" className="w-[60px]" />
            </div>
            <div className="flex flex-col">
              <p className=" font-extrabold text-[18px] text-transparent bg-clip-text bg-gradient-to-r from-[#0e9c49] to-[#e49200]">
                Nông Nghiệp Xanh
              </p>
              <p className="font-[600] text-[16px]">
                Uy tính - Chất lượng - Bền vững{" "}
              </p>
            </div>
          </div>
          <div className="flex items-center pl-2 pt-2">
            <AiOutlineHome style={{ fontSize: "18px", fontWeight: "700" }} />
            <p className=" pl-2">Add: Vĩnh Xuân, Trà ôn, Vĩnh Long</p>
          </div>
          <div
            className="flex items-center pl-2 pt-2 cursor-pointer hover:text-[#0e9c49]"
            onClick={handlePhoneClick}
          >
            <BsTelephone style={{ fontSize: "18px", fontWeight: "700" }} />
            <p className=" pl-2">Phone: 0384 999 999</p>
          </div>
          <div className="flex items-center pl-2 pt-2 ">
            <FaEarthAsia style={{ fontSize: "18px", fontWeight: "700" }} />
            <p className=" pl-2">Website: Nongnghiepxanh.com</p>
          </div>
          <div
            className="flex items-center pl-2 pt-2 cursor-pointer hover:text-[#0e9c49]"
            onClick={handleEmailClick}
          >
            <AiOutlineMail style={{ fontSize: "18px", fontWeight: "700" }} />
            <p className=" pl-2">Email: Nongnghiepxanh@gmail.com</p>
          </div>
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
          <h1 className="font-[700] text-[18px]">Công ty</h1>
          {footerProductLinks.map((link) => {
            return (
              <li key={link.name}>
                <Link
                  className="hover:text-[#0e9c49] duration-300"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="text-center sm:text-start">
          <h1 className="font-[700] text-[18px]">Trang</h1>
          {footerSupportLinks.map((link) => {
            return (
              <li key={link.name}>
                <div
                  className="hover:text-[#0e9c49] duration-300 cursor-pointer"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                    navigate(`${link.link}`);
                  }}
                >
                  {link.name}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:px-8 px-5 py-2 text-center bg-[#009b49] text-white">
        <span className="font-[600]">Copyright 2023 Nongsanxanh.com</span>
      </div>
    </div>
  );
}

export default memo(Footer);
