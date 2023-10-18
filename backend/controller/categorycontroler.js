const Category = require("../model/categories");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create a new category

const createCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, images } = req.body;
    if (!name || !images) {
      return next(
        new ErrorHandler("Please provide complete category informations", 400)
      );
    }
    const myCloud = await cloudinary.v2.uploader.upload(images, {
      forder: "imgCategorie",
    });
    const category = await Category.create({
      name,
      images: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      category,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
//get all  categories
const getallCategories = catchAsyncErrors(async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(201).json({
      success: true,
      categories,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete category
const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorHandler("categories not default", 404));
    }
    if (category.images.length > 0) {
      await cloudinary.v2.uploader.destroy(category.images[0].public_id);
    }
    await Category.findByIdAndDelete(category);
    res.status(201).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
module.exports = { createCategory, getallCategories, deleteCategory };
