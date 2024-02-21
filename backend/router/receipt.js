const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const receiptController = require("../controllers/receiptController.js");

router.post(
  "/create-receipt",
  isAuthenticated,
  isAdmin,
  receiptController.createReceipt
);
router.get(
  "/get-all-receipt",
  isAuthenticated,
  isAdmin,
  receiptController.getAllReceipt
);
router.get(
  "/get-a-receipt/:id",
  isAuthenticated,
  isAdmin,
  receiptController.getAReceipt
);
router.put(
  "/update-receipt/:id",
  isAuthenticated,
  isAdmin,
  receiptController.updateReceipt
);
router.delete(
  "/delete-receipt/:id",
  isAuthenticated,
  isAdmin,
  receiptController.deleteReceipt
);
module.exports = router;
