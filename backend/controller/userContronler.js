const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
router.post("/create-user", async (req, res, next) => {
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
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
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
  })
);

//login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
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
  })
);

//load user
router.get(
  "/getUser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
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
  })
);

//logout user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
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
  })
);

//update user
router.put(
  "/update-user",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;
      const user = await User.findOne({ email }).select("+ password");
      if (!user) {
        return next(
          new ErrorHandler(" Please provide enough information", 400)
        );
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }
      user.name = name;
      user.email = email;
      user.password = password;
      user.phoneNumber = phoneNumber;

      await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (err) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
