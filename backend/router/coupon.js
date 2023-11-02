const express = require("express");
const router = express.Router();
const CouponsController = require("../controller/couponsControler");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-coupon",
  isAuthenticated,
  isAdmin("admin"),
  CouponsController.createCoupons
);

router.get("/get-coupons", CouponsController.getCoupons);
router.get("/get-coupon/:id", CouponsController.getCoupon);
router.put("/edit-coupon/:id", CouponsController.editCoupon);
router.delete("/delete-coupon/:id", CouponsController.deleteCoupon);
module.exports = router;
