const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/product");

// Create order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      if (!cart || !shippingAddress || !user || !totalPrice || !paymentInfo) {
        return next(
          new ErrorHandler("Please provide complete order informations", 400)
        );
      }
      const orders = [];
      for (const product of cart) {
        const order = await Order.create({
          cart: [product],
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  })
);
//get all orders user
router.get(
  "/get-orders/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.id }).sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        order: orders,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  })
);
// get all orders
router.get(
  "/get-all-orders",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find();
      res.status(200).json({
        success: true,
        order: orders,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// cancel order
router.put(
  "/cancel-order/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order || order.status != "Processing") {
        return next(new ErrorHandler("This order cannot be canceled", 400));
      }
      order.status = "Canceled";
      await order.save({ validateBeforeSave: false });
      res.status(201).json({
        success: true,
        order: order,
        message: "Order canceled successfully",
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  })
);

//update status order admin
router.put(
  "/update-order-status/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred") {
        for (const item of order.cart) {
          console.log(item);
          await updateProductQuantity(item._id, item.quantity);
        }
      }
      order.status = req.body.status;
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
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
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  })
);

//delete order cancel and Delivered
router.delete(
  "/delete-order/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
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
      return next(new ErrorHandler(err.message, 400));
    }
  })
);

module.exports = router;
