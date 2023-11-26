import React, { memo, useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../service/userService";

function ListMessage({ data, setOpenMessage, setCurrentChat, me, userOnline }) {
  const [listUser, setListUser] = useState([]);
  const navigate = useNavigate();
  const handleClickConvertion = (id) => {
    navigate(`/system/admin?${id}`);
    setOpenMessage(true);
  };
  useEffect(() => {
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await UserService.getUserById(userId);
        if (res.success) {
          setListUser(res.user);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, [me, data]);

  if (!listUser || Object.keys(listUser).length === 0) {
    return null;
  }

  return (
    <div
      className="w-full flex p-2 my-2 px-3 hover:bg-[#f2f2f2] cursor-pointer"
      onClick={() => handleClickConvertion(data._id) || setCurrentChat(data)}
    >
      {listUser?.avatar ? (
        <div className="relative">
          <img
            src={listUser?.avatar.url}
            alt=""
            className="w-[50px] h-[50px] object-cover rounded-full"
          />
          {userOnline?.some((el) => el.userId === listUser._id) && (
            <p className="absolute w-3 h-3 bg-green-500 rounded-full top-0 right-0"></p>
          )}
        </div>
      ) : (
        <div className="relative">
          <UserOutlined className="text-[24px] p-2" />
          {userOnline?.some((el) => el.userId === listUser._id) && (
            <p className="absolute w-3 h-3 bg-green-500 rounded-full top-0 right-0"></p>
          )}
        </div>
      )}
      <div className="pl-3">
        <h1 className="font-[500]">{listUser.name}</h1>
        {data?.lastMessage && (
          <p className="text-[12px]"> {data?.lastMessage}</p>
        )}
      </div>
    </div>
  );
}

export default memo(ListMessage);
