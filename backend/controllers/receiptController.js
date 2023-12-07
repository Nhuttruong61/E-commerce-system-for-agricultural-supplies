const Receipt = require("../model/receipt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/product");

const createReceipt = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId, originPrice, quantity } = req.body;
    const product = await Product.findById(productId);
    const receipt = await Receipt.create({
      product: product,
      originPrice,
      quantity,
    });
    res.status(201).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const getAllReceipt = catchAsyncErrors(async (req, res, next) => {
  try {
    const receipt = await Receipt.find(req.params.id);
    if (!receipt) {
      return next(new ErrorHandler("receipt not found ", 400));
    }

    res.status(201).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const getAReceipt = catchAsyncErrors(async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return next(new ErrorHandler("receipt not found ", 400));
    }

    res.status(201).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const updateReceipt = catchAsyncErrors(async (req, res, next) => {
  try {
    const { productId, originPrice, quantity } = req.body;
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return next(new ErrorHandler("receipt not found ", 400));
    }
    const product = await Product.findById(productId);
    receipt.product = product;
    receipt.originPrice = originPrice;
    receipt.quantity = quantity;
    await receipt.save();
    res.status(201).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const deleteReceipt = catchAsyncErrors(async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return next(new ErrorHandler("receipt not found ", 400));
    }
    const product = await Product.findById(receipt.product._id);
    await Receipt.findByIdAndDelete(req.params.id);
    product.receipt = "";
    await product.save();

    res.status(201).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createReceipt,
  getAllReceipt,
  getAReceipt,
  updateReceipt,
  deleteReceipt,
};
