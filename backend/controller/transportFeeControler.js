const TransportFree = require("../model/transportfee");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create TransportFree
const ceatetransportFree = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, cost, freeShipping, weight } = req.body;
    if (!title || !cost || !weight || !freeShipping)
      return next(
        new ErrorHandler("Please provide complete event information", 400)
      );
    const transportfee = await TransportFree.create({
      title,
      cost,
      weight,
      freeShipping,
    });
    res.status(201).json({
      success: true,
      transportfee,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
//get all
const getAllTransportFees = catchAsyncErrors(async (req, res, next) => {
  const transportFees = await TransportFree.find();
  res.status(200).json({
    success: true,
    transportFees,
  });
});
const editTransportFee = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, cost, weight, freeShipping } = req.body;
    const transportFee = await TransportFree.findById(req.params.id);
    if (!transportFee) {
      return next(new ErrorHandler("TransportFee not found", 404));
    }
    if (!title || !cost || !weight || !freeShipping) {
      return next(
        new ErrorHandler(
          "Please provide complete transport fee information",
          400
        )
      );
    }
    transportFee.title = title;
    transportFee.cost = cost;
    transportFee.weight = weight;
    transportFee.freeShipping = freeShipping;
    await transportFee.save();
    res.status(200).json({
      success: true,
      transportFee,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const deleteTransportFee = catchAsyncErrors(async (req, res, next) => {
  const transportFeeId = req.params.id;

  try {
    const transportFee = await TransportFree.findByIdAndDelete(transportFeeId);

    if (!transportFee) {
      return next(new ErrorHandler("Transport fee not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Transport fee deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
module.exports = {
  ceatetransportFree,
  getAllTransportFees,
  editTransportFee,
  deleteTransportFee,
};
