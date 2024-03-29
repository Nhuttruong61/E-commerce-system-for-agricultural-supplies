import React, { memo, useEffect, useState } from "react";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as ConventionService from "../../service/conventionService";
import socketIO from "socket.io-client";
import * as MessageService from "../../service/messageService";
import imageCompression from "browser-image-compression";
import InboxForm from "./InboxForm";
import Swal from "sweetalert2";
const ENDPOINT = "https://server-chat-ecommerce.onrender.com/";
const socketId = socketIO(ENDPOINT, {
  transport: ["websocket"],
  withCredentials: true,
});
function Inbox() {
  const { account, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [listUser, setListUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userOnline, setUserOnline] = useState(null);
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
    socketId.emit("addUser", account?._id);
  }, [account]);
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
    socketId.on("getUsers", (listUser) => {
      setUserOnline(listUser);
    });
  }, []);

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
  const handleMessageSubmit = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Bạn phải đăng nhập trước khi nhắn tin?",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      const message = {
        groupTitle: account._id + "64ed97e2a41b317df2d04bbf",
        userId: account._id,
        AdminId: "64ed97e2a41b317df2d04bbf",
      };

      const res = await ConventionService.createConversation(message);
      if (res.success) {
        setCurrentChat(res.conversation);
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="fixed bottom-10 z-30 right-5 ">
        {isModalOpen ? (
          <div
            className="cursor-pointer border rounded-full p-2 bg-[#009b49]"
            onClick={handleCloseModal}
          >
            <AiOutlineClose className="text-[42px] text-white fadeIn" />
          </div>
        ) : (
          <div
            className="cursor-pointer border rounded-full p-2 bg-[#009b49]"
            onClick={handleMessageSubmit}
          >
            <AiOutlineMessage className="text-[42px] text-white fadeIn" />
          </div>
        )}
      </div>
      {isModalOpen && (
        <InboxForm
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          createMessageHandler={createMessageHandler}
          messages={messages}
          listUser={listUser}
          sellerId={account._id}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleOnchangeImage={handleOnchangeImage}
          currentChat={currentChat}
          account={account}
          setListUser={setListUser}
          userOnline={userOnline}
        />
      )}
    </div>
  );
}

export default memo(Inbox);
