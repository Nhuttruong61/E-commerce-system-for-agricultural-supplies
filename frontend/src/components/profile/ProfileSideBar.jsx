import React, { memo } from "react";
import { UserOutlined, HomeOutlined, CloseOutlined } from "@ant-design/icons";
import { BsBox } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../../redux/action/userAction";
import { useNavigate } from "react-router-dom";
import { RiCoupon2Line, RiLockPasswordLine } from "react-icons/ri";
function ProfileSideBar({ setActive, active }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(LogoutUser());
    navigate("/login");
  };
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <UserOutlined style={{ color: active === 1 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Tài khoản
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <BsBox style={{ color: active === 2 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Đơn hàng
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HomeOutlined style={{ color: active === 3 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Địa chỉ
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4)}
      >
        <RiCoupon2Line style={{ color: active === 4 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Phiếu giảm giá
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <RiLockPasswordLine style={{ color: active === 5 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Đổi mật khẩu
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={handleLogout}
      >
        <CloseOutlined style={{ color: active === 6 ? "#0e9c49" : "" }} />
        <span
          className={`pl-3 ${
            active === 6 ? "text-[#0e9c49]" : ""
          } 800px:block hidden`}
        >
          Đăng xuất
        </span>
      </div>
    </div>
  );
}

export default memo(ProfileSideBar);
