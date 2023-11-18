const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const Payment = require("../controllers/vnpayController");
router.post("/vnpay", isAuthenticated, Payment.createPaymentVNP);
router.get("/vnpay-return", isAuthenticated, Payment.handleVnpayReturn);
module.exports = router;
