import { useState } from "react";
import Login from "../../components/FormInput";
import Input from "../../components/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Userservice from "../../service/userService";
import Loading from "../../components/Loading";
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forGotPassword, setForGotPassword] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowForGotPassword, setIsShowForGotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnchanName = (value) => {
    setName(value);
  };
  const handleOnchanEmail = (value) => {
    setEmail(value);
  };
  const handleOnchanPassword = (value) => {
    setPassword(value);
  };
  const handleOnchanForgotPassword = (value) => {
    setForGotPassword(value);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name || !email || !password || !forGotPassword) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    if (password !== forGotPassword) {
      toast.error("Mật khẩu không khớp vui lòng nhập lại");
      setIsLoading(false);
      return;
    }
    const newUser = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await Userservice.RegisterService(newUser);
      if (response.success === true) {
        // toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản!");
        toast.success("Đăng kí kí tài khoản thành công");
        navigate("/login");
      }
    } catch (error) {
      toast.warning("Email đã tồn tại");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Login title="Đăng Ký">
          <form onSubmit={handleSubmit}>
            <Input
              name="Tên người dùng"
              value={name}
              placeholder="Nhập tên đăng nhập"
              onChange={handleOnchanName}
            />
            <Input
              name="Tên tài khoản hoặc địa chỉ email"
              value={email}
              placeholder="Nhập email"
              onChange={handleOnchanEmail}
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
                onChange={handleOnchanPassword}
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
                  onChange={handleOnchanForgotPassword}
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
        </Login>
      </Loading>
    </div>
  );
}

export default RegisterPage;
