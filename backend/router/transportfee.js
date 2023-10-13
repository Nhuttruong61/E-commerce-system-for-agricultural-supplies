const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const {
  getAllTransportFees,
  editTransportFee,
  deleteTransportFee,
  ceatetransportFree,
} = require("../controller/transportFeeControler");

router.post(
  "/create-transport-fee",
  isAuthenticated,
  isAdmin("admin"),
  ceatetransportFree
);
router.get("/get-transport-fee", getAllTransportFees);
router.put(
  "/edit-transport-fee/:id",
  isAuthenticated,
  isAdmin("admin"),
  editTransportFee
);
router.delete(
  "/delete-transport-fee/:id",
  isAuthenticated,
  isAdmin("admin"),
  deleteTransportFee
);

module.exports = router;
