import React from "react";

import {
  AiOutlineShop,
  AiOutlineTags,
  AiOutlineInbox,
  AiOutlineMessage,
  AiOutlineGift,
  AiOutlineUser,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
function SideBarAdmin({ active, setActive }) {
  return (
    <div className="w-full h-[92vh] shadow overflow-y-auto sticky top-0 left-0 z-10">
      <div className="flex w-full items-center p-4">
        <div className="flex w-full items-center" onClick={() => setActive(1)}>
          <AiOutlineUser
            className={` text-[24px]  ${
              active === 1 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 1 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            User
          </p>
        </div>
      </div>
      <div className="flex w-full items-center p-4">
        <div className="flex w-full items-center" onClick={() => setActive(2)}>
          <BiCategory
            className={` text-[24px]  ${
              active === 2 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 2 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            Category
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center p-4"
        onClick={() => setActive(3)}
      >
        <div className="flex w-full items-center">
          <AiOutlineShop
            className={` text-[24px]  ${
              active === 3 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 3 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            Products
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center p-4"
        onClick={() => setActive(4)}
      >
        <div className="flex w-full items-center">
          <AiOutlineInbox
            className={` text-[24px]  ${
              active === 4 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 4 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            Orders
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center p-4"
        onClick={() => setActive(5)}
      >
        <div className="flex w-full items-center">
          <AiOutlineTags
            className={` text-[24px]  ${
              active === 5 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 5 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            Event
          </p>
        </div>
      </div>
      <div
        className="flex w-full items-center p-4"
        onClick={() => setActive(6)}
      >
        <div className="flex w-full items-center">
          <AiOutlineMessage
            className={` text-[24px]  ${
              active === 6 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 6 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            Inbox
          </p>
        </div>
      </div>

      <div
        className="flex w-full items-center p-4"
        onClick={() => setActive(7)}
      >
        <div className="flex w-full items-center">
          <AiOutlineQuestionCircle
            className={` text-[24px]  ${
              active === 7 ? "text-[#4b8600]" : "text-black"
            }`}
          />
          <p
            className={`800px:block hidden pl-2 text-[18px] font-[500] ${
              active === 7 ? "text-[#4b8600]" : "text-black"
            }`}
          >
            FAQ
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideBarAdmin;
