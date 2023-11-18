const Sliser = require("../model/slider");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

const createSlider = catchAsyncErrors(async (req, res, next) => {
  try {
    const { images } = req.body;
    if (!images) {
      return next(
        new ErrorHandler("Please provide complete informations", 400)
      );
    }
    const myCloud = await cloudinary.v2.uploader.upload(images, {
      folder: "imgSlider",
    });
    const slider = await Sliser.create({
      images: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      slider,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const updateSlider = catchAsyncErrors(async (req, res, next) => {
  try {
    const slider = await Sliser.findById(req.params.id);
    const { images } = req.body;
    if (!images) {
      return next(
        new ErrorHandler("Please provide complete informations", 400)
      );
    }
    const isCloudinaryImage = images && images.includes("cloudinary");
    if (images && !isCloudinaryImage) {
      await cloudinary.v2.uploader.destroy(slider.images[0].public_id);
      const myCloud = await cloudinary.v2.uploader.upload(images, {
        folder: "imgSlider",
      });
      slider.images = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await slider.save();
    res.status(201).json({
      success: true,
      slider,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
//get all slider
const getAllSlider = catchAsyncErrors(async (req, res, next) => {
  try {
    const slider = await Sliser.find();
    res.status(201).json({
      success: true,
      slider,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete slider
const deleteSlider = catchAsyncErrors(async (req, res, next) => {
  try {
    const slider = await Sliser.findById(req.params.id);
    if (!slider) {
      return next(new ErrorHandler("Slider does not exist", 404));
    }
    if (slider.images[0].public_id) {
      await cloudinary.v2.uploader.destroy(slider.images[0].public_id);
    }
    await Sliser.findByIdAndDelete(slider);
    res.status(201).json({
      success: true,
      message: "slider deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createSlider,
  getAllSlider,
  deleteSlider,
  updateSlider,
};
