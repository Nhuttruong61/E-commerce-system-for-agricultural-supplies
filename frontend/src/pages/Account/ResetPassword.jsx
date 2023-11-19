import { useState } from "react";
import FormAccount from "../../components/FormAccount";
import Input from "../../components/Input";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import * as Userservice from "../../service/userService";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

function ResetPassword() {
  const { resetToken } = useParams();
  const [forgotPassword, setforgotPassword] = useState("");
  const [reforgotPassword, setreforgotPassword] = useState("");
  const [isShowforgotPassword, setIsShowforgotPassword] = useState(false);
  const [isreShowforgotPassword, setIsreShowforgotPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnchanforgotPassword = (value) => {
    setforgotPassword(value);
  };
  const handleOnchanreforgotPassword = (value) => {
    setreforgotPassword(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (forgotPassword === reforgotPassword) {
        setIsLoading(true);
        const data = {
          resetToken: resetToken,
          newPassword: forgotPassword,
        };

        const res = await Userservice.resetPassword(data);
        setIsLoading(false);
        if (res.success === true) {
          navigate("/login");
          toast.success("Đổi mật khẩu thành công");
        }
      } else {
        toast.warning("Mật khẩu không trùng nhau");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <FormAccount title="Mật khẩu mới">
          <form onSubmit={handleSubmit}>
            <div className="relative py-2">
              <span
                onClick={() => setIsShowforgotPassword(!isShowforgotPassword)}
                className="z-10 absolute right-2 top-10"
              >
                {isShowforgotPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
              <Input
                name="Mật khẩu mới"
                value={forgotPassword}
                placeholder="Mật khẩu mới"
                onChange={handleOnchanforgotPassword}
                type={isShowforgotPassword ? "text" : "password"}
              />
              <span
                onClick={() =>
                  setIsreShowforgotPassword(!isreShowforgotPassword)
                }
                className="z-10 absolute right-2 top-[105px]"
              >
                {isreShowforgotPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )}
              </span>
              <Input
                name="Nhập lại mật khẩu"
                value={reforgotPassword}
                placeholder="Mật khẩu mới"
                onChange={handleOnchanreforgotPassword}
                type={isreShowforgotPassword ? "text" : "password"}
              />
            </div>

            <button
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0e9c49] hover:bg-[#345409]"
              type="submit"
              disabled={!forgotPassword}
            >
              Gửi
            </button>
          </form>
        </FormAccount>
      </Loading>
    </div>
  );
}

export default ResetPassword;
