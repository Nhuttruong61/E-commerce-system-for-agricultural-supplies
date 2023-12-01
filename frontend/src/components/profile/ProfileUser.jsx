import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { updateAUser } from "../../service/userService";
import { getUser, updateUser } from "../../redux/action/userAction";
import Loading from "../Loading";
import { toast } from "react-toastify";
import { handleOnchangeImage } from "../../until";
function Profile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.isAuthenticated) {
      setName(user.account.name);
      setEmail(user.account.email);
      setPhoneNumber(user.account.phoneNumber);
      if (user.account.avatar) {
        setSelectedImage(user.account.avatar.url);
      }
    }
  }, [user]);
  const handleOnchangeName = (e) => {
    return setName(e.target.value);
  };
  const handleOnchangeNumber = (e) => {
    return setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      avatar: selectedImage,
    };

    try {
      setIsLoading(true);
      const response = await updateAUser(user);
      if (response.success) {
        dispatch(updateUser(response));
        toast.success("Thay đổi thông tin thành công");
      }
    } catch (error) {
      toast.error("Đã xãy ra lỗi vui lòng thử lại sao", error);
      console.error(error);
    } finally {
      dispatch(getUser());
      setIsLoading(false);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="w-full  h-auto bg-white rounded-[10px] ">
        <div className="px-5 md:px-10 lg:px-20 ">
          <h1 className="font-[600] text-[18px] md:text-[24px] lg:text-[24px] xl:text-[24px]">
            Tài khoản cá nhân
          </h1>
          <p className="text-[#ff7700] font-[600] text-lg md:text-xl lg:text-xl xl:text-xl">
            Tài khoản
          </p>
        </div>
        <div className="flex  px-5 md:px-20 py-5 md:py-10 shadow-2xl">
          <form
            className="w-full text-[80%] md:text-[100%]"
            onSubmit={handleSubmit}
          >
            <label className="flex items-center my-2 justify-between ">
              <p className="md:w-[30%] xl:w-[20%]  font-[600] ">
                Tên người dùng:
              </p>
              <input
                type="text"
                name="name"
                value={name}
                required
                className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
                onChange={handleOnchangeName}
              />
            </label>
            <label className="flex items-center my-2 justify-between">
              <p className="md:w-[30%] xl:w-[20%] font-[600]">Email:</p>
              <input
                type="text"
                name="email"
                required
                value={email}
                className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px] outline-none cursor-not-allowed"
                readOnly
              />
            </label>
            <label className="flex items-center my-2 justify-between">
              <p className="md:w-[30%] xl:w-[20%] font-[600]">Số điện thoại:</p>
              <input
                type="text"
                value={phoneNumber}
                required
                name="phone"
                className="w-[70%] md:px-4 xl:w-[85%] h-auto py-2 border-[2px] sm:px-0 rounded-[4px]"
                onChange={handleOnchangeNumber}
              />
            </label>
            <label className="flex items-center my-8 xl:w-[20%] md:w-[100]">
              <label
                htmlFor="inport"
                className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
              >
                Chọn ảnh
              </label>
              <input
                id="inport"
                type="file"
                hidden
                onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
              />
              {selectedImage ? (
                <img
                  className="w-[40px] h-[40px] object-cover rounded-full"
                  src={selectedImage}
                  alt="Avatar"
                  value={selectedImage}
                />
              ) : user?.account?.avatar ? (
                <img
                  className="w-[40px] h-[40px] object-cover rounded-full"
                  src={user.account.avatar.url}
                  alt="Avatar"
                />
              ) : (
                <UserOutlined className="text-[24px] p-2" />
              )}
            </label>
            <div className="flex flex-row-reverse">
              <label className="flex flex-row-reverse font-[500] md:w-[120px]">
                <button className="bg-[#0e9c49] text-white px-4 py-2  rounded-[4px] ">
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

export default memo(Profile);
