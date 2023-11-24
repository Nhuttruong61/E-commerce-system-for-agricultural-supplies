import React, { memo, useEffect, useRef } from "react";
import moment from "moment";
import { AiOutlineSend } from "react-icons/ai";
import { CloseOutlined } from "@ant-design/icons";
import { BsImages } from "react-icons/bs";
import * as UserService from "../../service/userService";
function InboxForm({
  newMessage,
  setNewMessage,
  createMessageHandler,
  messages,
  sellerId,
  listUser,
  selectedImage,
  setSelectedImage,
  handleOnchangeImage,
  currentChat,
  account,
  setListUser,
}) {
  const bottomRef = useRef();
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    const userId = currentChat?.members.find((user) => user !== account._id);
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
  }, [currentChat, account]);

  return (
    <div className="fixed bottom-2 z-50 right-24 bg-white w-[280px] rounded fadeIn min-h-[48vh]">
      <div className="flex shadow  p-2">
        <img
          src={listUser?.avatar.url}
          alt=""
          className="w-[40px] h-[40px] object-cover rounded-full "
        />
        <div className="px-2">
          <h1 className="font-[600]">{listUser?.name}</h1>
        </div>
      </div>
      <div className="px-3 h-[34vh]  overflow-y-scroll " ref={bottomRef}>
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
                  src={listUser?.avatar.url}
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
                <p className="text-[10px]">{moment(item.createdAt).fromNow}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <div className="w-[20%] flex justify-center items-center cursor-pointer">
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
              <img src={selectedImage} alt="" className="w-[30px] h-[30px]" />
            </div>
          )}
        </div>
        <input
          type="text"
          value={newMessage}
          className="w-[70%] px-2 h-auto my-1 p-1 border-[2px] rounded-[8px] outline-none"
          placeholder="Aa"
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="cursor-pointer w-[15%]"
          disabled={newMessage.trim() === ""}
          onClick={createMessageHandler}
        >
          <AiOutlineSend className="text-[20px] mx-2" />
        </button>
      </div>
    </div>
  );
}

export default memo(InboxForm);
