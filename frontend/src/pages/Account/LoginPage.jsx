import { memo, useEffect, useState } from "react";
import Login from "../../components/FormInput";
import Input from "../../components/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import * as Userservice from "../../service/userService";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/action/userAction";

function LoginPage() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleOnchanEmail = (value) => {
    setEmail(value);
  };
  const handleOnchanPassword = (value) => {
    setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await Userservice.LoginService(user);
      if (response.success === true) {
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        navigate(redirectPath);
        localStorage.removeItem("redirectPath");
        dispatch(getUser());
      }
    } catch (err) {
      toast.error("Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Loading isLoading={isLoading}>
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
                <Link
                  to="/request-password"
                  className="text-[14px] text-red-600 cursor-pointer"
                >
                  {" "}
                  Quên mật khẩu
                </Link>
              </div>
              <div className="flex items-center my-2">
                <p className="text-[14px]">Bạn chưa có tài khoản?</p>
                <Link className="text-orange-400 mx-[2px]" to="/register">
                  Đăng ký
                </Link>
              </div>
            </div>

            <button
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0e9c49] hover:bg-[#345409]"
              type="submit"
              disabled={!email || !password}
            >
              Đăng Nhập
            </button>
          </form>
        </Login>
      </Loading>
    </div>
  );
}

export default memo(LoginPage);
