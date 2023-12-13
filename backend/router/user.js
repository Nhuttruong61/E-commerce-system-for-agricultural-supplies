const express = require("express");
const router = express.Router();
const userControler = require("../controllers/userContronller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post("/create-user", userControler.createUser);
router.post("/create-account-bussiness", userControler.createAccountBussenes);
router.post("/activation", userControler.activation);
router.post("/login-user", userControler.loginUser);
router.get("/get-user", isAuthenticated, userControler.getUser);
router.get("/logout", userControler.logOut);
router.put("/update-user", isAuthenticated, userControler.updateUser);
router.put(
  "/update-userId/:id",
  isAuthenticated,
  isAdmin("admin"),
  userControler.updateUserId
);
router.put(
  "/update-addressId/:id",
  isAuthenticated,
  isAdmin("admin"),
  userControler.updateAddressId
);
router.put("/change-password", isAuthenticated, userControler.changePassword);
router.get(
  "/get-all-users",
  isAuthenticated,
  isAdmin("admin"),
  userControler.getAllUsers
);
router.get("/get-user/:id", isAuthenticated, userControler.getaUser);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin("admin"),
  userControler.deleteUser
);
router.put("/update-address", isAuthenticated, userControler.updateAddress);
router.delete(
  "/delete-address/:id",
  isAuthenticated,
  userControler.deleteAddress
);
router.post("/request-password", userControler.requestPasswordReset);
router.put("/reset-password", userControler.resetPassword);
router.get("/get-user/:id", userControler.getUserByid);
router.put(
  "/update-coupon-user/:id",
  isAuthenticated,
  userControler.updateCouponsUser
);
router.put("/add-product/:id", isAuthenticated, userControler.addProductCart);
router.put(
  "/delete-product-cart/:id",
  isAuthenticated,
  userControler.deleteProductCart
);
module.exports = router;
