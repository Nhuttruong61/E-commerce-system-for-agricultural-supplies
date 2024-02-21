const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const {
  getAllTransportFees,
  editTransportFee,
  deleteTransportFee,
  ceatetransportFree,
} = require("../controllers/transportFeeController");

router.post(
  "/create-transport-fee",
  isAuthenticated,
  isAdmin,
  ceatetransportFree
);
router.get("/get-transport-fee", getAllTransportFees);
router.put(
  "/edit-transport-fee/:id",
  isAuthenticated,
  isAdmin,
  editTransportFee
);
router.delete(
  "/delete-transport-fee/:id",
  isAuthenticated,
  isAdmin,
  deleteTransportFee
);

module.exports = router;
