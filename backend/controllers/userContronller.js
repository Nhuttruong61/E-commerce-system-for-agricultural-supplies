const User = require("../model/user");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { response } = require("express");
const bcrypt = require("bcrypt");
const createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const user = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    try {
      await sendMail.sendMail({
        email: user.email,
        subject: "Xác nhận đăng kí tài khoản",
        message: `Chào bạn ${user.name}, vui lòng nhấn vào link để xác nhận kích hoạt tài khoản: ${activationUrl}`,
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
    const { name, email, password, phoneNumber, tax } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
    user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      tax,
    });
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// const createUser = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { name, email, password, phoneNumber } = req.body;
//     if (!name || !email || !password || !phoneNumber) {
//       return next(new ErrorHandler("Please provide all fields!", 400));
//     }

//     let user = await User.findOne({ email });
//     if (user) {
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       phoneNumber,
//     });

//     res.status(201).json({
//       success: true,
//       user: newUser,
//     });
//   } catch (err) {
//     return next(new ErrorHandler(err.message, 500));
//   }
// });
//create create account for business
const createAccountBussenes = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, tax } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const user = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      tax: tax,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Active your account",
        message: `Chào bạn ${user.name}, vui lòng nhấn vào link để xác nhận kích hoạt tài khoản: ${activationUrl}`,
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
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler(" Please provide enough information", 400));
    }
    const isCloudinaryImage = avatar && avatar.includes("cloudinary");

    if (avatar && !isCloudinaryImage && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
// update user by id
const updateUserId = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { name, email, phoneNumber, avatar, tax, role } = req.body;
    if (!user) {
      return next(new ErrorHandler(" Please provide enough information", 400));
    }
    const isCloudinaryImage = avatar && avatar.includes("cloudinary");
    if (avatar && !isCloudinaryImage) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    user.name = name;
    user.email = email;
    user.tax = tax;
    user.role = role;
    user.phoneNumber = phoneNumber;

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
    if (user.avatar.public_id) {
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
    const { city, address } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (user.addresses.length === 0) {
      user.addresses.push({
        city: city,
        address: address,
      });
    } else {
      const firstAddress = user.addresses[0];

      firstAddress.city = city;
      firstAddress.address = address;
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
// update addressid
const updateAddressId = catchAsyncErrors(async (req, res, next) => {
  try {
    const { city, address } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (user.addresses.length === 0) {
      user.addresses.push({
        city: city,
        address: address,
      });
    } else {
      const firstAddress = user.addresses[0];

      firstAddress.city = city;
      firstAddress.address = address;
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

const sendResetEmail = async (user) => {
  const resetToken = createResetToken(user);
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  try {
    await sendMail.sendMail({
      email: user.email,
      subject: "Lấy lại mật khẩu",
      message: `Xin chào, vui lòng nhấn vào đường link này: ${resetUrl}`,
    });
  } catch (e) {
    throw new Error("Error sending reset email");
  }
};
const requestPasswordReset = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email });

    if (!userEmail) {
      return next(new ErrorHandler("User not found", 404));
    }
    const user = {
      email: email,
    };

    await sendResetEmail(user);
    res.status(200).json({
      success: true,
      message: `Reset email sent to ${email}. Please check your email.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const createResetToken = (user) => {
  return jwt.sign(user, process.env.RESET_SECRET, {
    expiresIn: "5m",
  });
};
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = jwt.verify(resetToken, process.env.RESET_SECRET);
    if (!user) {
      return next(new ErrorHandler("Invalid reset token", 400));
    }
    const email = user.email;
    const userToUpdate = await User.findOne({ email });
    if (!userToUpdate) {
      return next(new ErrorHandler("User not found", 404));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getUserByid = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("No find user", 400));
    }
    response.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const updateCouponsUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("Invalid reset token", 400));
    }
    const { coupons } = req.body;

    const existingCoupon = user.voucher.find(
      (coupon) => coupon.code === coupons.code
    );
    if (existingCoupon) {
      return next(new ErrorHandler("Coupon already exists for this user", 400));
    }
    user.giftPoints -= coupons.point;
    user.voucher.push(coupons);
    user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
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
  requestPasswordReset,
  resetPassword,
  getUserByid,
  createAccountBussenes,
  updateUserId,
  updateAddressId,
  updateCouponsUser,
};
