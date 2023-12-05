const Order = require("../model/order");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/product");
const User = require("../model/user");
const sendMail = require("../utils/sendMail");
const Receipt = require("../model/receipt");
// Create order
const createOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo, coupons } =
      req.body;
    const orders = [];
    if (coupons) {
      const userData = await User.findById(user._id);
      userData.voucher = userData.voucher.filter(
        (item) => item._id !== coupons._id
      );

      await userData.save();
    }
    const order = await Order.create({
      cart,
      shippingAddress,
      user,
      totalPrice,
      paymentInfo,
    });
    orders.push(order);
    await sendMail.sendMailCreateOrder({ order });
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get all orders user
const getOrderUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.id }).sort({
      createdAt: -1,
    });
    if (!orders) return next(new ErrorHandler("orders is not found", 400));
    res.status(201).json({
      success: true,
      order: orders,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get order by id
const getOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// get all orders
const getAllOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      order: orders,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// cancel order
const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    const { status } = req.body;
    if (!order || order.status != "Processing") {
      return next(new ErrorHandler("This order cannot be canceled", 400));
    }
    order.status = status;
    await order.save({ validateBeforeSave: false });
    res.status(201).json({
      success: true,
      order: order,
      message: "Order canceled successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//update status order admin
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    let totalPoints = 0;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (req.body.status === "Transferred") {
      const listProduct = await order.cart.map((item) => item);
      for (let i = 0; i < listProduct.length; i++) {
        const product = await Product.findById(listProduct[i]);
        if (!product) {
          return next(new ErrorHandler("Product is not found", 401));
        }
      }
      for (const item of order.cart) {
        await updateProductQuantity(item._id, item.quantity);
        await updateReceiptQuantity(item.receipt, item.quantity);
      }
    }
    order.status = req.body.status;
    if (req.body.status === "Delivered") {
      order.paymentInfo.status = "Đã thanh toán";
      order.paymentInfo.paidAt = Date.now();
      totalPoints = order.totalPrice / 100000;

      await updateGiftPoint(totalPoints, order.totalPrice);
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });

    async function updateProductQuantity(id, qty) {
      const product = await Product.findById(id);
      product.quantity -= qty;
      product.sold_out += qty;
      await product.save({ validateBeforeSave: false });
    }
    async function updateReceiptQuantity(id, qty) {
      const receipt = await Receipt.findById(id);
      receipt.quantity -= qty;
      receipt.sold_out += qty;
      await receipt.save({ validateBeforeSave: false });
    }
    async function updateGiftPoint(point, price) {
      const user = await User.findById(order.user._id);
      user.giftPoints += point;
      user.totalAmount += price;
      await user.save();
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete order cancel and Delivered
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    if (order.status === "Transferred") {
      return next(new ErrorHandler("This order cannot be deleted"));
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Order deleted successfully!",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createOrder,
  getOrderUser,
  getOrder,
  getAllOrder,
  cancelOrder,
  updateOrderStatus,
  deleteOrder,
};
