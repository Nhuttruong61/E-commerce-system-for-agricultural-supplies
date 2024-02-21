const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncErrors((req, res, next) => {
  const token = req.headers.authorization;
  const rawToken = token.split(" ")[1];
  if (!rawToken) {
    return next(ErrorHandler("Please login to coutinue"), 401);
  }
  jwt.verify(rawToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(ErrorHandler("Token is invalid"), 401);
    }
    req.user = decoded;
  });
  next();
});

exports.isAdmin = catchAsyncErrors((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return next(ErrorHandler("Please login to coutinue"), 401);
  }

  next();
});
