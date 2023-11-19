import { memo, useState } from "react";
import FormAccount from "../../components/FormAccount";
import Input from "../../components/Input";
import { Link, useNavigate } from "react-router-dom";
import * as Userservice from "../../service/userService";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnchanEmail = (value) => {
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        email: email,
      };
      const res = await Userservice.forgotPassword(data);
      if (res.success === true) {
        navigate("/login");
        toast.success("Vui lòng kiểm tra email để xác nhận");
      }
    } catch {
      toast.error("Email không chính xác");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <FormAccount title="Quên mật khẩu">
          <form onSubmit={handleSubmit}>
            <div className="relative py-2">
              <Input
                name="Email"
                value={email}
                placeholder="Email đăng kí của bạn"
                onChange={handleOnchanEmail}
              />
            </div>

            <button
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0e9c49] hover:bg-[#345409]"
              type="submit"
              disabled={!email}
            >
              Gửi
            </button>
          </form>
          <Link
            to="/login"
            className="text-[14px] text-orange-400 mx-[2px] cursor-pointer py-2"
          >
            Đăng nhập
          </Link>
        </FormAccount>
      </Loading>
    </div>
  );
}

export default memo(ForgotPassword);
