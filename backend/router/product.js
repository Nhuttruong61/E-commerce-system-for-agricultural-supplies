const express = require("express");
const router = express.Router();
const productControler = require("../controller/productControler");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-product",
  isAuthenticated,
  isAdmin("admin"),
  productControler.createProduct
);
router.get("/get-all-products", productControler.getAllProducts);
router.get("/get-products/:id", productControler.getaProduct);
router.put(
  "/update-product/:id",
  isAuthenticated,
  isAdmin("admin"),
  productControler.updateProduct
);
router.delete(
  "/delete-product/:id",
  isAuthenticated,
  isAdmin("admin"),
  productControler.deleteProduct
);
router.put("/create-review", isAuthenticated, productControler.reviewProduct);
module.exports = router;
