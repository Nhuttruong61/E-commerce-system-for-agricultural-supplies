import { useState } from "react";
import Login from "../components/FormInput";
import Input from "../components/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleOnchanEmail = (value) => {
    setEmail(value);
  };
  const handleOnchanPassword = (value) => {
    setPassword(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Mật khẩu:", password);
  };
  return (
    <div>
      <Login title="Đăng Nhập">
        <form onSubmit={handleSubmit}>
          <Input
            name="Tên tài khoản hoặc địa chỉ email"
            value={email}
            placeholder="Email"
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
              name="Mật khẩu của bạn"
              value={password}
              placeholder="Password"
              onChange={handleOnchanPassword}
              type={isShowPassword ? "text" : "password"}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center my-2">
              <input type="checkbox" />
              <p className="text-[14px]"> Ghi nhớ mật khẩu</p>
            </div>
            <div className="flex items-center my-2">
              <p className="text-[14px]">Bạn chưa có tài khoản?</p>
              <Link className="text-orange-400 mx-[2px]" to="/register">Đăng ký</Link>
            </div>
          </div>
          <div className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700">
            <button type="submit" ddisabled={!email || !password}>Đăng Nhập</button>
          </div>
        </form>
      </Login>
    </div>
  );
}

export default LoginPage;
