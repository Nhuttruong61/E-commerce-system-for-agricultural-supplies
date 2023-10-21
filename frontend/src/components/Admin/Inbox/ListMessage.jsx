import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../service/userService";

function ListMessage({ data, setOpenMessage, setCurrentChat, me }) {
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
  return (
    <div
      className="w-full flex p-2 my-2 px-3 hover:bg-[#f2f2f2] cursor-pointer"
      onClick={() => handleClickConvertion(data._id) || setCurrentChat(data)}
    >
      {listUser?.avatar ? (
        <img
          src={listUser?.avatar.url}
          alt=""
          className="w-[50px] h-[50px] object-cover rounded-full"
        />
      ) : (
        <UserOutlined className="text-[24px] p-2" />
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

export default ListMessage;
