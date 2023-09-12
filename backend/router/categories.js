const express = require("express");
const router = express.Router();
const categoryControler = require("../controller/categorycontroler");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post(
  "/create-category",
  isAuthenticated,
  isAdmin("admin"),
  categoryControler.createCategory
);
router.get("/get-all-categories", categoryControler.getallCategories);
router.delete(
  "/delete-category/:id",
  isAuthenticated,
  isAdmin("admin"),
  categoryControler.deleteCategory
);

module.exports = router;
