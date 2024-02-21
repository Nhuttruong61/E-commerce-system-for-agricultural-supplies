const express = require("express");
const router = express.Router();
const sliderControler = require("../controllers/slidercontroller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-slider",
  isAuthenticated,
  isAdmin,
  sliderControler.createSlider
);
router.put(
  "/update-slider/:id",
  isAuthenticated,
  isAdmin,
  sliderControler.updateSlider
);
router.get("/get-all-slider", sliderControler.getAllSlider);
router.delete(
  "/delete-slider/:id",
  isAuthenticated,
  isAdmin,
  sliderControler.deleteSlider
);

module.exports = router;
