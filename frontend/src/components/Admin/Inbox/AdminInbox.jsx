import React, { memo, useEffect, useState } from "react";
import * as ConvertionService from "../../../service/conventionService";
import * as MessageService from "../../../service/messageService";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import ListMessage from "./ListMessage";
import SeleteInbox from "./SeleteInbox";
import imageCompression from "browser-image-compression";
const ENDPOINT = "http://localhost:8000/";
const socketId = socketIO(ENDPOINT, {
  transport: ["websocket"],
  withCredentials: true,
});

function AdminInbox() {
  const { account } = useSelector((state) => state.user);
  const [convertion, setConvertion] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const getConvertion = async () => {
    const data = await ConvertionService.getAllConversations(account._id);
    if (data?.success) {
      setConvertion(data.conversations);
    }
  };
  useEffect(() => {
    getConvertion();
  }, []);
  useEffect(() => {
    socketId.emit("addUser", account._id);
  }, [account]);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createAt: data.now,
      });
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  const handleOnchangeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
    }
  };

  // create message
  const createMessageHandler = async () => {
    const message = {
      sender: account._id,
      text: newMessage,
      images: selectedImage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member === account._id
    );
    socketId.emit("sendMessage", {
      senderId: account._id,
      receiverId,
      text: newMessage,
      images: selectedImage,
    });
    try {
      if (newMessage !== "") {
        await MessageService.createMessage(message)
          .then((res) => {
            setMessages([...messages, res.message]);
            setNewMessage("");
            setSelectedImage(null);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get message
  const getMessage = async () => {
    if (currentChat) {
      const res = await MessageService.getAllMessage(currentChat?._id);
      if (res.success) {
        setMessages(res.message);
      }
    }
  };
  useEffect(() => {
    getMessage();
  }, [currentChat]);

  //update last message
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: account._id,
    });
    const data = {
      lastMessage: newMessage,
      lastMessageId: account._id,
    };
    await MessageService.UpdateMessage(currentChat._id, data);
  };
  return (
    <div className="w-[90%] bg-white h-[80vh] m-5  overflow-y-scroll rounded">
      {!openMessage ? (
        <>
          <h1 className="font-[600] text-[24px]">Tất cả tin nhắn</h1>
          {convertion?.map((item, index) => {
            return (
              <ListMessage
                data={item}
                key={index}
                setOpenMessage={setOpenMessage}
                createMessageHandler={createMessageHandler}
                setCurrentChat={setCurrentChat}
                me={account._id}
              />
            );
          })}
        </>
      ) : (
        <>
          <SeleteInbox
            setOpenMessage={setOpenMessage}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            createMessageHandler={createMessageHandler}
            messages={messages}
            sellerId={account._id}
            currentChat={currentChat}
            handleOnchangeImage={handleOnchangeImage}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        </>
      )}
    </div>
  );
}

export default memo(AdminInbox);
