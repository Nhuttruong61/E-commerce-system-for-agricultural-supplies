const Blog = require("../model/blog");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

//create a new blog
const createBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, content, selectedImage } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(selectedImage, {
      folder: "imgBlog",
    });
    const blog = await Blog.create({
      title,
      content: content,
      images: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get all blog
const getAllBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.find();
    const formatBlog = blog.map((item) => ({
      _id: item._id,
      title: item.title,
      images: item.images,
      content: item.content.toString("utf-8"),
    }));
    res.status(200).json({
      success: true,
      blog: formatBlog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//get blog by id
const getAblog = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const formatBlog = {
      _id: blog._id,
      title: blog.title,
      images: blog.images,
      content: blog.content.toString("utf-8"),
    };
    if (!blog) return next(new ErrorHandler("Blog not default", 400));
    res.status(200).json({
      success: true,
      blog: formatBlog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const updateBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new ErrorHandler("Blog is not found"), 400);
    const { title, content } = req.body;

    let hasNewImages = false;

    for (const item of content) {
      if (item.images) {
        hasNewImages = true;
        break;
      }
    }

    if (hasNewImages) {
      for (const item of blog.content) {
        const publicId = item.images.public_id;
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }
    const contentData = await Promise.all(
      content.map(async (item) => {
        if (item.images) {
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
        } else {
          return {
            ...item,
            heading: item.heading,
            description: item.description,
          };
        }
      })
    );

    blog.title = title;
    blog.content = contentData;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new ErrorHandler("Blog is not found"), 400);
    await cloudinary.v2.uploader.destroy(blog.images.public_id);
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "delete successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createBlog,
  getAllBlog,
  getAblog,
  updateBlog,
  deleteBlog,
};
