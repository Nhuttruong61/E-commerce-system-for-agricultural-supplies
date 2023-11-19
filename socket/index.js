const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("dotenv").config({
  path: "./.env",
});

app.use(express.json());
//Khởi tạo Endpoint và xử lý kết nối Socket:
app.get("/", (req, res) => {
  res.send("Hello socket");
});
let users = [];

//Quản lý kết nối Socket
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
// Xử lý sự kiện từ client
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  //// Xử lý sự kiện khi có kết nối mới được thiết lập.
  console.log(`user connect`);
  // Xử lý khi người dùng gửi sự kiện "addUser".
  // Thêm người dùng mới vào danh sách và gửi danh sách người dùng đến tất cả các clients.
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  const messages = {};
  // Xử lý khi người dùng gửi tin nhắn mới.
  // Lưu tin nhắn vào danh sách và gửi tin nhắn đến người nhận.
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    const user = getUser(receiverId);

    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    io.to(user?.socketId).emit("getMessage", message);
  });

  // Xử lý khi người dùng cập nhật tin nhắn cuối cùng.
  // Gửi tin nhắn cuối cùng đến tất cả clients.
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  // Xử lý khi kết nối socket bị đóng.
  // Loại bỏ người dùng khỏi danh sách và cập nhật danh sách người dùng.
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port  + ${process.env.PORT || 8000}`);
});
