import React from "react";
import { UserOutlined, HomeOutlined, CloseOutlined } from "@ant-design/icons";
import { BsBox } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../../redux/action/userAction";
import { useNavigate } from "react-router-dom";
import { clearQuantity } from "../../redux/action/cartAction";
function ProfileSideBar({ setActive, active }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(LogoutUser());
    dispatch(clearQuantity());
    navigate("/login");
  };
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <UserOutlined style={{ color: active === 1 ? "#4b8600" : "" }} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[#4b8600]" : ""
          } 800px:block hidden`}
        >
          Tài khoản
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <BsBox style={{ color: active === 2 ? "#4b8600" : "" }} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[#4b8600]" : ""
          } 800px:block hidden`}
        >
          Đơn hàng
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HomeOutlined style={{ color: active === 3 ? "#4b8600" : "" }} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[#4b8600]" : ""
          } 800px:block hidden`}
        >
          Địa chỉ
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={handleLogout}
      >
        <CloseOutlined style={{ color: active === 4 ? "#4b8600" : "" }} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[#4b8600]" : ""
          } 800px:block hidden`}
        >
          Đăng xuất
        </span>
      </div>
    </div>
  );
}

export default ProfileSideBar;
