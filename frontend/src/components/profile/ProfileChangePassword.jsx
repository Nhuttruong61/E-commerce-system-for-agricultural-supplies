import React, { useState } from "react";
import Loading from "../Loading";
import { chagePassword } from "../../service/userService";
import { toast } from "react-toastify";
function ProfileChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    newPassword: "",
  });
  const [forgotPassword, setForgotPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.newPassword || !forgotPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
    } else if (form.newPassword !== forgotPassword) {
      toast.warning("Mật khẩu nhập lại không chính xác");
    } else {
      try {
        setIsLoading(true);
        const res = await chagePassword(form);
        setIsLoading(false);
        if (res.success) {
          toast.success("Thay đổi mật khẩu thành công");
          setForm({
            password: "",
            newPassword: "",
          });
          setForgotPassword("");
        }
      } catch (e) {
        setIsLoading(false);
        switch (e.response.status) {
          case 400:
            toast.error("Mật khẩu không chính xác");
            break;

          case 401:
            toast.warning("Mật khẩu phải nhiều hơn 4 kí tự");
            break;
          default:
            return;
        }
      }
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="w-full  h-auto bg-white rounded-[10px]">
        <div className="px-5 md:px-10 lg:px-20 ">
          <h1 className="font-[600] text-[18px] md:text-[24px] lg:text-[24px] xl:text-[24px]">
            Đổi mật khẩu
          </h1>
        </div>
        <div className="flex px-5 md:px-20 py-5 md:py-10 shadow-2xl">
          <form
            className="w-full text-[80%] md:text-[100%]"
            onSubmit={handleSubmit}
          >
            <label className="flex items-center my-2 justify-between">
              <p className="md:w-[30%]  font-[600]">Mật khẩu hiện tại:</p>
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-[60%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 px-1 rounded-[4px]"
              />
            </label>
            <label className="flex items-center my-2 justify-between">
              <p className="md:w-[30%]  font-[600]">Mật khẩu mới:</p>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={form.newPassword}
                className="w-[60%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 px-1 rounded-[4px]"
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </label>
            <label className="flex items-center my-2 justify-between">
              <p className="md:w-[30%]  font-[600]">Nhập lại khẩu mới:</p>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={forgotPassword}
                className="w-[60%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 px-1 rounded-[4px]"
                onChange={(e) => setForgotPassword(e.target.value)}
              />
            </label>

            <div className="flex flex-row-reverse">
              <label className="flex flex-row-reverse font-[500] md:w-[120px]">
                <button className="bg-[#0e9c49] text-white px-4 py-2  rounded-[4px]">
                  Thay đổi
                </button>
              </label>
            </div>
          </form>
        </div>
      </div>
    </Loading>
  );
}

export default ProfileChangePassword;
