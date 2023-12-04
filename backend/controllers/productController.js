const Product = require("../model/product");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/order");
const Category = require("../model/categories");

//create product
const createProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, description, category, images } = req.body;

    const categoryid = await Category.findById(category);
    if (!categoryid) {
      return next(new ErrorHandler("category not found", 404));
    }
    const myCloud = await cloudinary.v2.uploader.upload(images, {
      folder: "imgProducts",
    });
    const product = await Product.create({
      name,
      description,

      category: {
        categoryid,
        name: categoryid.name,
      },

      images: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    await product.save();
    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { category, name } = req.query;
    let products;

    if (category) {
      products = await Product.find({
        category: { $regex: new RegExp(category, "i") },
      });
    }

    if (name) {
      products = await Product.find({
        name: { $regex: new RegExp(name, "i") },
      });
    }

    if (!category && !name) {
      products = await Product.find();
    }

    res.status(200).json({
      success: true,
      product: products,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// get product by id
const getaProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// update product
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = await Product.findById(req.params.id);
    const product = await Product.findById(productId);
    const {
      name,
      description,
      receipt,
      category,
      weight,
      capacity,
      price,
      wholesalePrice,
      expirationDate,
      originPrice,
      origin,
      distCount,
      gifts,
      quantity,
      images,
    } = req.body;
    if (!productId) {
      return next(new ErrorHandler("Product does not exists", 400));
    }
    const categoryid = await Category.findById(category);
    if (!categoryid) {
      return next(new ErrorHandler("category not found", 404));
    }
    const isCloudinaryImage = images && images.includes("cloudinary");
    if (images && !isCloudinaryImage) {
      if (product?.images[0]?.public_id) {
        await cloudinary.v2.uploader.destroy(product.images[0].public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(images, {
        folder: "imgProducts",
      });
      product.images = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    product.name = name;
    product.description = description;
    product.receipt = receipt;
    product.category = {
      categoryid,
      name: categoryid.name,
    };
    product.weight = weight;
    product.capacity = capacity;
    product.originPrice = originPrice;
    product.price = price;
    product.wholesalePrice = wholesalePrice;
    product.expirationDate = expirationDate;
    product.origin = origin;
    product.distCount = distCount;
    product.gifts = gifts;
    product.quantity = quantity;
    await product.save();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//delete product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product does not exist", 404));
    }
    if (product.images[0].public_id) {
      await cloudinary.v2.uploader.destroy(product.images[0].public_id);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// review for a product
const reviewProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user, comment, rating, cart } = req.body;
    const orderId = await req.body._id;
    const productIds = cart.map((cartItem) => cartItem._id);
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    for (const ProductId of productIds) {
      const product = await Product.findById(ProductId);
      if (!product) {
        return next(new ErrorHandler("Product not found with this id", 400));
      }
      const isReview = product.reviews.find((review) => review.user === user);
      if (isReview) {
        isReview.rating = rating;
        isReview.comment = comment;
        await isReview.save();
      } else {
        const newReview = {
          user,
          rating,
          comment,
        };
        product.reviews.push(newReview);
      }
      let totalRating = 0;
      product.reviews.forEach((review) => {
        totalRating += review.rating;
      });
      product.ratings = totalRating / product.reviews.length;
      await product.save();
    }
    order.iscomment = true;
    order.save();
    res.status(200).json({
      success: true,
      message: "Review created successfully!",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getaProduct,
  updateProduct,
  deleteProduct,
  reviewProduct,
};
