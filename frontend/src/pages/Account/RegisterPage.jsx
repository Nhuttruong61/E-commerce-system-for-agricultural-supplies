import { useState } from "react";
import FormAccount from "../../components/FormAccount";
import Input from "../../components/Input/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Userservice from "../../service/userService";
import Loading from "../../components/common/Loading";
import { BsArrowRight } from "react-icons/bs";
function RegisterPage() {
  const [userRerister, setUserRerister] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [forGotPassword, setForGotPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowForGotPassword, setIsShowForGotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !userRerister.name ||
      !userRerister.email ||
      !userRerister.phoneNumber ||
      !userRerister.password ||
      !forGotPassword
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
    } else if (userRerister.password !== forGotPassword) {
      toast.error("Mật khẩu không khớp vui lòng nhập lại");
    } else {
      try {
        setIsLoading(true);
        const response = await Userservice.RegisterService(userRerister);
        if (response.success === true) {
          toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản!");
          navigate("/login");
        }
      } catch (error) {
        toast.warning("Email đã tồn tại");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div>
      <Loading isLoading={isLoading}>
        <FormAccount title="Đăng Ký">
          <Link
            to="/register-bussiness"
            className="flex justify-end items-center text-orange-400"
          >
            <p className="pr-2">Doanh nghiệp</p>
            <BsArrowRight />
          </Link>
          <form onSubmit={handleSubmit}>
            <Input
              name="Tên người dùng"
              value={userRerister.name}
              placeholder="Nhập tên đăng nhập"
              onChange={(value) =>
                setUserRerister({ ...userRerister, name: value })
              }
            />
            <Input
              name="Sô điện thoại"
              value={userRerister.phoneNumber}
              placeholder="Nhập số điện thoại của bạn"
              onChange={(value) =>
                setUserRerister({ ...userRerister, phoneNumber: value })
              }
            />
            <Input
              name="Hãy nhập địa email của bạn"
              type="email"
              value={userRerister.email}
              placeholder="Nhập email"
              onChange={(value) =>
                setUserRerister({ ...userRerister, email: value })
              }
            />

            <div className="relative">
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="z-10 absolute right-2 top-[29.5px] cursor-pointer"
              >
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
              <Input
                name="Mật khẩu"
                value={userRerister.password}
                placeholder="Mật khẩu"
                onChange={(value) =>
                  setUserRerister({ ...userRerister, password: value })
                }
                type={isShowPassword ? "text" : "password"}
                min={4}
              />
              <div className="relative">
                <span
                  onClick={() => setIsShowForGotPassword(!isShowForGotPassword)}
                  className="z-10 absolute right-2 top-[29.5px] cursor-pointer"
                >
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <Input
                  name="Nhập lại mật khẩu"
                  value={forGotPassword}
                  placeholder="Nhập lại mật khẩu"
                  onChange={(value) => setForGotPassword(value)}
                  type={isShowForGotPassword ? "text" : "password"}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center my-2">
                <p className="text-[14px]">Bạn đã có tài khoản?</p>
                <Link className="text-orange-400 mx-[2px]" to="/login">
                  Đăng nhập
                </Link>
              </div>
            </div>

            <button
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0e9c49] hover:bg-[#345409]"
              type="submit"
            >
              Đăng Ký
            </button>
          </form>
        </FormAccount>
      </Loading>
    </div>
  );
}

export default RegisterPage;
