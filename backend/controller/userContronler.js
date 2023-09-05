const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const user = {
      name: name,
      email: email,
      password: password,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Active your account",
        message: `Hello ${user.name}, please activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email: ${user.email} to activate your account`,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

// create activation Token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
// activate user
const activation = catchAsyncErrors(async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const newUser = jwt.verify(accessToken, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
      name,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }
    sendToken(user, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//load user
const getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//logout user
const logOut = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      express: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//update user
const updateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, phoneNumber, avatar } = req.body;
    const user = await User.findOne({ email }).select("+ password");
    if (!user) {
      return next(new ErrorHandler(" Please provide enough information", 400));
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

//change password
const changePassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

// get all users
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

// get user by id
const getaUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

//delete user by id
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

// update address
const updateAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const typeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );

    if (typeAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }
    const existsAddress = user.addresses.find(
      (addr) => addr._id === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

// delete address
const deleteAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

module.exports = {
  createUser,
  activation,
  loginUser,
  getUser,
  logOut,
  updateUser,
  changePassword,
  getAllUsers,
  getaUser,
  deleteUser,
  updateAddress,
  deleteAddress,
};
