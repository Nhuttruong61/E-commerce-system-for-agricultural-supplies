const express = require("express");
const router = express.Router();
const orderControler = require("../controllers/orderController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
router.post("/create-order", isAuthenticated, orderControler.createOrder);
router.get("/get-orders/:id", isAuthenticated, orderControler.getOrderUser);
router.get("/get-order/:id", isAuthenticated, orderControler.getOrder);
router.get(
  "/get-all-orders",
  isAuthenticated,
  isAdmin,
  orderControler.getAllOrder
);
router.put("/cancel-order/:id", isAuthenticated, orderControler.cancelOrder);
router.put(
  "/update-order-status/:id",
  isAuthenticated,
  isAdmin,
  orderControler.updateOrderStatus
);
router.delete(
  "/delete-order/:id",
  isAuthenticated,
  isAdmin,
  orderControler.deleteOrder
);
module.exports = router;
