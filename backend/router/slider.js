const express = require("express");
const router = express.Router();
const sliderControler = require("../controller/slidercontroler");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-slider",
  isAuthenticated,
  isAdmin("admin"),
  sliderControler.createSlider
);
router.put(
  "/update-slider/:id",
  isAuthenticated,
  isAdmin("admin"),
  sliderControler.updateSlider
);
router.get("/get-all-slider", sliderControler.getAllSlider);
router.delete(
  "/delete-slider/:id",
  isAuthenticated,
  isAdmin("admin"),
  sliderControler.deleteSlider
);

module.exports = router;
