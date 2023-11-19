import { memo, useState } from "react";
import FormAccount from "../../components/FormAccount";
import Input from "../../components/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Userservice from "../../service/userService";
import Loading from "../../components/Loading";
import { BsArrowLeft } from "react-icons/bs";

function RegisterBussiness() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tax, setTax] = useState("");

  const [password, setPassword] = useState("");
  const [forGotPassword, setForGotPassword] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowForGotPassword, setIsShowForGotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber || !password || !forGotPassword) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    } else if (password !== forGotPassword) {
      toast.error("Mật khẩu không khớp vui lòng nhập lại");
      setIsLoading(false);
      return;
    } else {
      const data = {
        name: name,
        email: email,
        tax: tax,
        phoneNumber: phoneNumber,
        password: password,
      };

      try {
        setIsLoading(true);
        const response = await Userservice.RegisterService(data);
        if (response.success === true) {
          toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản!");
          // toast.success("Đăng kí kí tài khoản thành công");
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
          <Link to="/register" className="flex items-center text-orange-400">
            <BsArrowLeft />
            <p className="pl-2">Cá nhân</p>
          </Link>
          <form onSubmit={handleSubmit}>
            <Input
              name="Tên người dùng"
              value={name}
              placeholder="Nhập tên đăng nhập"
              onChange={(value) => setName(value)}
            />
            <Input
              name="Sô điện thoại"
              value={phoneNumber}
              placeholder="Nhập số điện thoại của bạn"
              onChange={(value) => setPhoneNumber(value)}
            />
            <Input
              name="Hãy nhập địa email của bạn"
              value={email}
              type="email"
              placeholder="Nhập email"
              onChange={(value) => setEmail(value)}
            />
            <Input
              name="Mã số thuế"
              value={tax}
              placeholder="Nhập mã số thuế của bạn"
              onChange={(value) => setTax(value)}
            />

            <div className="relative">
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="z-10 absolute right-2 top-6"
              >
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
              <Input
                name="Mật khẩu"
                value={password}
                placeholder="Mật khẩu"
                onChange={(value) => setPassword(value)}
                type={isShowPassword ? "text" : "password"}
              />
              <div className="relative">
                <span
                  onClick={() => setIsShowForGotPassword(!isShowForGotPassword)}
                  className="z-10 absolute right-2 top-6"
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
              disabled={!email || !password}
            >
              Đăng Ký
            </button>
          </form>
        </FormAccount>
      </Loading>
    </div>
  );
}

export default memo(RegisterBussiness);
