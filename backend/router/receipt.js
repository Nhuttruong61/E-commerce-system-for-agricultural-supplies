const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const receiptController = require("../controllers/receiptController.js");

router.post(
  "/create-receipt",
  isAuthenticated,
  isAdmin("admin"),
  receiptController.createReceipt
);
router.get(
  "/get-all-receipt",
  isAuthenticated,
  isAdmin("admin"),
  receiptController.getAllReceipt
);
router.get(
  "/get-a-receipt/:id",
  isAuthenticated,
  isAdmin("admin"),
  receiptController.getAReceipt
);
router.put(
  "/update-receipt/:id",
  isAuthenticated,
  isAdmin("admin"),
  receiptController.updateReceipt
);
router.delete(
  "/delete-receipt/:id",
  isAuthenticated,
  isAdmin("admin"),
  receiptController.deleteReceipt
);
module.exports = router;
