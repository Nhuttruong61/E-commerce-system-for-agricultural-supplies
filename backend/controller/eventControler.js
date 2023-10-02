const Event = require("../model/event");
const Product = require("../model/product");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create event
const createEvent = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    description,
    categories,
    product,
    start,
    finish,
    originalPrice,
    discountPrice,
    quantity,
    images,
  } = req.body;

  if (
    !name ||
    !description ||
    !categories ||
    !product ||
    !start ||
    !finish ||
    !images
  ) {
    return next(
      new ErrorHandler("Please provide complete event information", 400)
    );
  }

  try {
    const products = await Product.findById(product);

    if (!products) {
      return next(new ErrorHandler("Product does not exist", 404));
    }
    const myCloud = await cloudinary.v2.uploader.upload(images, {
      folder: "imgEvents",
    });
    const event = await Event.create({
      name,
      description,
      categories,
      product: products,
      start,
      finish,
      originalPrice,
      discountPrice,
      quantity,
      images: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get all events

const getAllEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

// get event by id
const getaEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(201).json({
      success: true,
      event,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

// delete event by id
const deleteEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event does not exist", 404));
    }
    if (event.images[0].public_id) {
      await cloudinary.v2.uploader.destroy(event.images[0].public_id);
    }
    await Event.findByIdAndDelete(event);
    res.status(201).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

module.exports = { createEvent, getAllEvent, getaEvent, deleteEvent };
