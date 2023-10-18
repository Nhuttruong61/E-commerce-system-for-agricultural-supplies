import { useState } from "react";
import Login from "../components/FormInput";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import * as Userservice from "../service/userService";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

function ForgotPassword() {
  const [email, sêtmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnchanEmail = (value) => {
    sêtmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email: email,
    };

    const res = await Userservice.forgotPassword(data);
    if (res.success === true) {
      navigate("/login");
      toast.success("Đổi mật khẩu thành công");
    }
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Login title="Quên mật khẩu">
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
        </Login>
      </Loading>
    </div>
  );
}

export default ForgotPassword;
