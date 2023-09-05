const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/.env",
  });
}

// import routes
const userRouter = require("./router/user");
const productRouter = require("./router/product");
const orderRouter = require("./router/order");
const eventRouter = require("./router/event");

app.use("/api/v2/user", userRouter);
app.use("/api/v2/product", productRouter);
app.use("/api/v2/order", orderRouter);
app.use("/api/v2/event", eventRouter);
app.use(ErrorHandler);
module.exports = app;
