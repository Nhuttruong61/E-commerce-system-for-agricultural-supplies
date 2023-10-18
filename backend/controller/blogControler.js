const Blog = require("../model/blog");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create a new blog
const createBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(
        new ErrorHandler("Please provide complete category informations", 400)
      );
    }

    const contentData = await Promise.all(
      content.map(async (item) => {
        const imageUrl = item.images;

        const myCloud = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: "imgBlog",
        });

        return {
          heading: item.heading,
          description: item.description,
          images: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
        };
      })
    );

    const blog = await Blog.create({
      title,
      content: contentData,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const getAllBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.find();
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createBlog,
  getAllBlog,
};
