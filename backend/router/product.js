const express = require("express");
const router = express.Router();
const productControler = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-product",
  isAuthenticated,
  isAdmin,
  productControler.createProduct
);
router.get("/get-all-products", productControler.getAllProducts);
router.get("/get-products/:id", productControler.getaProduct);
router.put(
  "/update-product/:id",
  isAuthenticated,
  isAdmin,
  productControler.updateProduct
);
router.delete(
  "/delete-product/:id",
  isAuthenticated,
  isAdmin,
  productControler.deleteProduct
);
router.post("/create-review", isAuthenticated, productControler.reviewProduct);
module.exports = router;
