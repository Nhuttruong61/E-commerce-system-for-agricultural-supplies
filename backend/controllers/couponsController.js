const Coupons = require("../model/coupons");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create a new coupon
const createCoupons = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, discountAmount, point, userType } = req.body;
    const coupon = await Coupons.create({
      name,
      discountAmount,
      point,
      userType,
    });
    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const getCoupons = catchAsyncErrors(async (req, res, next) => {
  try {
    const coupons = await Coupons.find();
    if (!coupons) return next(new ErrorHandler("Coupons not default", 400));

    res.status(201).json({
      success: true,
      coupons,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const getCoupon = catchAsyncErrors(async (req, res, next) => {
  try {
    const coupons = await Coupons.findById(req.params.id);
    if (!coupons) return next(new ErrorHandler("Coupons not default", 400));

    res.status(201).json({
      success: true,
      coupons,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const editCoupon = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, discountAmount, point, userType } = req.body;
    const coupons = await Coupons.findById(req.params.id);
    if (!coupons) return next(new ErrorHandler("Coupons not default", 400));

    coupons.name = name;
    coupons.discountAmount = discountAmount;
    coupons.point = point;
    coupons.userType = userType;
    await coupons.save();
    res.status(201).json({
      success: true,
      coupons,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  try {
    const coupons = await Coupons.findById(req.params.id);
    if (!coupons) return next(new ErrorHandler("Coupons not default", 400));
    await Coupons.findByIdAndDelete(coupons);
    res.status(201).json({
      success: true,
      message: "Delete coupon successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createCoupons,
  getCoupons,
  getCoupon,
  editCoupon,
  deleteCoupon,
};
