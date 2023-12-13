const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: [
    "https://e-commerce-system-for-agricultural-supplies.vercel.app",
    "http://localhost:3000",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/.env",
  });
}

// import routes
const userRouter = require("./router/user");
const categoriesRouter = require("./router/categories");
const productRouter = require("./router/product");
const orderRouter = require("./router/order");
const eventRouter = require("./router/event");
const questionRouter = require("./router/question");
const sliderRouter = require("./router/slider");
const transportFeeRouter = require("./router/transportfee");
const paymentRouter = require("./router/vnpay");
const conversationRouter = require("./router/convertion");
const messageRouter = require("./router/message");
const blogRouter = require("./router/blog");
const couponsRouter = require("./router/coupon");
const receiptsRouter = require("./router/receipt");

app.use("/api/v2/user", userRouter);
app.use("/api/v2/category", categoriesRouter);
app.use("/api/v2/product", productRouter);
app.use("/api/v2/order", orderRouter);
app.use("/api/v2/event", eventRouter);
app.use("/api/v2/question", questionRouter);
app.use("/api/v2/slider", sliderRouter);
app.use("/api/v2/transportfee", transportFeeRouter);
app.use("/api/v2/payment", paymentRouter);
app.use("/api/v2/convertion", conversationRouter);
app.use("/api/v2/message", messageRouter);
app.use("/api/v2/blog", blogRouter);
app.use("/api/v2/coupon", couponsRouter);
app.use("/api/v2/receipt", receiptsRouter);
app.use(ErrorHandler);
module.exports = app;
