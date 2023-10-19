import React from "react";

import {
  AiOutlineShop,
  AiOutlineTags,
  AiOutlineInbox,
  AiOutlineMessage,
  AiOutlineUser,
  AiOutlineQuestionCircle,
  AiOutlineAppstoreAdd,
} from "react-icons/ai";
import { LuTimerOff } from "react-icons/lu";
import { FcExpired } from "react-icons/fc";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiCategory, BiBorderAll } from "react-icons/bi";
function SideBarAdmin({ active, setActive }) {
  return (
    <div className="w-full h-[90vh] shadow overflow-y-auto sticky top-0 left-0 z-10 cursor-pointer">
      <div className="flex w-full items-center px-4 py-3">
        <div
          className="flex w-full items-center  "
          onClick={() => setActive(1)}
        >
          <AiOutlineUser
            className={` text-[24px]  ${
              active === 1 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 1 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Quản lý người dùng
          </p>
        </div>
      </div>
      <div className="flex w-full items-center px-4 py-3">
        <div className="flex w-full items-center" onClick={() => setActive(2)}>
          <BiCategory
            className={` text-[24px]  ${
              active === 2 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 2 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Danh mục hàng hóa
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(3)}
      >
        <div className="flex w-full items-center">
          <AiOutlineShop
            className={` text-[24px]  ${
              active === 3 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 3 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Quản lý sản phẩm
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(4)}
      >
        <div className="flex w-full items-center">
          <AiOutlineInbox
            className={` text-[24px]  ${
              active === 4 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 4 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Quản lý đơn hàng
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(5)}
      >
        <div className="flex w-full items-center">
          <AiOutlineTags
            className={` text-[24px]  ${
              active === 5 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 5 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Quản lý sự kiện
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(6)}
      >
        <div className="flex w-full items-center">
          <AiOutlineMessage
            className={` text-[24px]  ${
              active === 6 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 6 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Inbox
          </p>
        </div>
      </div>

      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(7)}
      >
        <div className="flex w-full items-center">
          <AiOutlineQuestionCircle
            className={` text-[24px]  ${
              active === 7 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 7 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Quản lý bài đăng
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(8)}
      >
        <div className="flex w-full items-center">
          <LiaShippingFastSolid
            className={` text-[24px]  ${
              active === 8 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 8 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Chi phí vận chuyển
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(9)}
      >
        <div className="flex w-full items-center">
          <FcExpired
            className={` text-[24px]  ${
              active === 9 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 9 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Sắp hết hạn
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(10)}
      >
        <div className="flex w-full items-center">
          <LuTimerOff
            className={` text-[24px]  ${
              active === 10 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 10 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Sản phẩm hết hạn
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(11)}
      >
        <div className="flex w-full items-center">
          <AiOutlineAppstoreAdd
            className={` text-[24px]  ${
              active === 11 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 11 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Thêm blog
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center px-4 py-3"
        onClick={() => setActive(12)}
      >
        <div className="flex w-full items-center">
          <BiBorderAll
            className={` text-[24px]  ${
              active === 12 ? "text-[#0e9c49]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 12 ? "text-[#0e9c49]" : "text-black"
            }`}
          >
            Tất cả blog
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideBarAdmin;
