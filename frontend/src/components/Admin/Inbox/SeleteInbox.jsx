import React, { memo, useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import * as UserService from "../../../service/userService";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
function SeleteInbox({
  setOpenMessage,
  newMessage,
  setNewMessage,
  createMessageHandler,
  messages,
  sellerId,
  currentChat,
  handleOnchangeImage,
  selectedImage,
  setSelectedImage,
  userOnline,
}) {
  const [user, setUser] = useState(null);
  const bottomRef = useRef();

  const handleExit = () => {
    setOpenMessage(false);
  };
  useEffect(() => {
    const idUser = currentChat?.members?.find((user) => user !== sellerId);
    const getUser = async () => {
      const res = await UserService.getUserById(idUser);
      setUser(res.user);
    };
    getUser();
  }, [currentChat]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="flex shadow">
        <div className="w-full flex m-2">
          {user?.avatar ? (
            <img
              src={user?.avatar.url}
              alt=""
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
          ) : (
            <UserOutlined className="text-[24px] p-2" />
          )}
          <div className="px-2">
            <h1 className="font-[600]">{user?.name}</h1>
            {userOnline?.some((el) => el.userId === user?._id) && (
              <p className="text-[12px]">Đang hoạt động</p>
            )}
          </div>
        </div>
        <AiOutlineClose
          className="text-[24px] hover:bg-red-600 hover:text-white"
          onClick={handleExit}
        />
      </div>
      <div className="px-3 h-[60vh]  overflow-y-scroll py-2" ref={bottomRef}>
        {messages?.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-full flex my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              } `}
            >
              {item.sender !== sellerId && (
                <img
                  src={user?.avatar?.url}
                  alt=""
                  className="w-[30px] h-[30px] rounded-full mr-2"
                />
              )}
              <div className="flex flex-col">
                <div
                  className={`w-max px-2 py-1 rounded-[8px] ${
                    item.sender !== sellerId
                      ? "bg-[#ccc] text-black"
                      : "bg-[#0866ff] text-white"
                  }`}
                >
                  {item?.images && (
                    <img
                      src={item?.images?.url}
                      alt=""
                      className="h-[80px] w-[80px]"
                    />
                  )}
                  <p>{item.text}</p>
                </div>
                <p className="text-[10px]">
                  {moment(item.createdAt).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <div className="w-[10%] flex justify-center items-center cursor-pointer">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleOnchangeImage}
          />
          <label htmlFor="image">
            <BsImages className="text-[24px] text-[#5b5b5b]" />
          </label>
          {selectedImage && (
            <div className="relative">
              <button
                className="absolute top-[-16px] right-[-5px]"
                onClick={() => setSelectedImage(null)}
              >
                <CloseOutlined className="p-1 hover:bg-red-500 hover:text-white text-[10px]" />
              </button>
              <img src={selectedImage} alt="" className="w-[50px] h-[50px]" />
            </div>
          )}
        </div>
        <input
          type="text"
          value={newMessage}
          className="w-[85%] px-2 h-auto my-1 py-2 border-[2px] rounded-[8px] outline-none"
          placeholder="Aa"
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="cursor-pointer w-[5%]"
          disabled={newMessage.trim() === ""}
          onClick={createMessageHandler}
        >
          <AiOutlineSend className="text-[24px] mx-2" />
        </button>
      </div>
    </div>
  );
}

export default memo(SeleteInbox);
